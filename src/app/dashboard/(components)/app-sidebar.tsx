"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import Bpmn from './bpmn-info';

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/providers/user-provider";
import { NavBpmnFile } from "./nav-bpmn-file";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Text2BPMN",
          url: "/dashboard/text2bpmn",
        },
        {
          title: "Image2BPMN",
          url: "/dashboard/image2bpmn",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const [organization, setOrganization] = React.useState(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user && user.email) {
      const fetchOrganizations = async () => {
        try {
          const response = await fetch(`/api/organization/get-organizations?userId=${user.id}`);
          const data = await response.json();
          setOrganization(data.organization);
        } catch (error) {
          console.error("Error fetching organizations:", error);
        }
      };

      fetchOrganizations();
    }
  }, [user]);

  React.useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    if (storedProjectId) {
      setSelectedProjectId(storedProjectId);
    }
  }, []);


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher organization={organization} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {selectedProjectId && <NavBpmnFile projectId={selectedProjectId} />}
        <div className="m-4">
          <Bpmn />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}