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
  User,
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/providers/user-provider";
import { NavBpmnFile } from "./nav-bpmn-file";
import { UserRole } from "@/types/user/user";
import { useOrganizationWorkspaceContext } from "@/providers/organization-workspace-provider";
import { Organization } from "@/types/organization/organization";
import { Settings } from "./settings";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: UserRole.MEMBER,
    organizationId: "",
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
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const {currentOrganization, setCurrentOrganization, currentProject, setCurrentProject} = useOrganizationWorkspaceContext();

  React.useEffect(() => {
    console.log('test');
    if (user && user.id) {
      const fetchOrganizations = async () => {
        try {
          const response = await fetch(`/api/organization/get-organizations?userId=${user.id}`);
          const data = await response.json();
          if (data.organizations.length > 0) {
            console.log(data.organizations);
            setOrganizations(data.organizations);
            setCurrentOrganization(data.organizations[0]);
          } else {
            setOrganizations([]);
            setCurrentOrganization(null);
          }
        } catch (error) {
          console.error("Error fetching organizations:", error);
        }
      };

      fetchOrganizations();
    }
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher organizations={organizations} />
      </SidebarHeader>
      <SidebarContent>
        {user.role !== UserRole.STAKEHOLDER && (
          <NavMain items={data.navMain} />
        )}
        {currentProject && <NavBpmnFile projectId={currentProject.id} />}
        {user.role !== UserRole.STAKEHOLDER && (
          <div className="m-4">
            <Bpmn />
          </div>
        )}
        {user.role === UserRole.ADMIN && (
          <Settings/>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}