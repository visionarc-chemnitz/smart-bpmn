"use client";

import { use, useEffect } from "react";
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
  // User,
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
import { User, UserRole } from "@/types/user/user";
// import { useOrganizationContext } from "@/providers/organization-provider";
import { Settings } from "./settings";
import { apiWrapper } from "@/lib/utils";
import { API_PATHS } from "@/app/api/api-path/apiPath";
// import useSWR from "swr";
import { Project } from "@/types/project/project";
import { useOrganizationStore } from "@/store/organization-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Organization } from "@/types/organization/organization";
// import { useWorkspaceContext } from "@/providers/workspace-provider";

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
        // {
        //   title: "Text2BPMN",
        //   url: "/dashboard/text2bpmn",
        // },
        {
          title: "Chat",
          url: "/dashboard/chat",
        },
        {
          title: "Image2BPMN",
          url: "/dashboard/image2bpmn",
        },
        {
          title: "Diff Checker",
          url: "/dashboard/diff-checker",
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  orgs: Organization[];
  projs: Project[];
}

export function AppSidebar({orgs, projs, ...props }: AppSidebarProps ) {
  const user = useUser();
  const {setCurrentOrganization, setOrgList} = useOrganizationStore();
  const {currentProject ,setProjectList} = useWorkspaceStore();

  useEffect(() => {
    if (orgs && orgs.length > 0) {
      setOrgList(orgs);
      setCurrentOrganization(orgs[0]);
    }

    if (projs && projs?.length > 0) {
      setProjectList(projs);
    }
  }, [user, orgs, projs, setOrgList, setCurrentOrganization, setProjectList])

  // const { setCurrentOrganization, setOrgList} = useOrganizationContext();
  // const { currentProject ,setProjectList} = useWorkspaceContext();
  
  // const orgFetcher = async (url: string ) => {
  //   return await fetch(url).then((res) => res.json());
  // }
  // const projectFetcher = async (url: string ) => {
  //   return await fetch(url).then((res) => res.json());
  // }

  // const { data: orgs, error: orgError } = useSWR(API_PATHS.GET_ORGANIZATION, orgFetcher);
  // const { data: projs, error: projError } = useSWR<Project[]>(API_PATHS.GET_PROJECTS, projectFetcher);

  // useEffect(() => {
  //   if (orgError) console.error(orgError);
  //   if (projError) console.error(projError);
    
  //   if (orgs && orgs.length > 0) {
  //     setOrgList(orgs);
  //     setCurrentOrganization(orgs[0]);
  //   }

  //   if (projs && projs?.length > 0) {
  //     setProjectList(projs);
  //   }
  // }, [user, orgs, projs, orgError, projError, setOrgList, setCurrentOrganization, setProjectList])

  // if (!orgs || !projs) return <SidebarSkeleton />;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <TeamSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        {user.role !== UserRole.STAKEHOLDER && (
          <NavMain items={data.navMain} />
        )}
        {currentProject && <NavBpmnFile projectId={currentProject.id} />}
        {/* {user.role !== UserRole.STAKEHOLDER && (
          <div className="m-4">
            <Bpmn />
          </div>
        )} */}
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

// function SidebarSkeleton() {
//   return (
//     <div className="w-64 h-screen animate-pulse bg-gray-100 dark:bg-gray-800">
//       <div className="h-16 bg-gray-200 dark:bg-gray-700 mb-4" />
//       <div className="px-4 space-y-3">
//       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//       </div>
//     </div>
//   );
// }