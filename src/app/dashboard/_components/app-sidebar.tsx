"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  Bot,
  ImagePlusIcon,
  GitCompare,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
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
import { usePathname } from "next/navigation";
// import { useWorkspaceContext } from "@/providers/workspace-provider";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  orgs: Organization[];
  projs: Project[];
}

export function AppSidebar({orgs, projs, ...props }: AppSidebarProps ) {
  const user = useUser();
  
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {setCurrentOrganization, setOrgList} = useOrganizationStore();
  const {currentProject, setProjectList} = useWorkspaceStore();
  const path = usePathname()

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
        isActive: path === "/dashboard/chat" || "/dashboard/image2bpmn" || "/dashboard/diff-checker" ? true : false,
        items: [
          {
            title: "Chat",
            isActive: path === "/dashboard/chat"? true : false,
            icon: Bot,
            url: "/dashboard/chat",
          },
          {
            title: "Image2BPMN",
            icon : ImagePlusIcon,
            isActive: path === "/dashboard/image2bpmn"? true : false,
            url: "/dashboard/image2bpmn",
          },
          {
            title: "Diff Checker",
            icon: GitCompare,
            isActive: path === "/dashboard/diff-checker"? true : false,
            url: "/dashboard/diff-checker",
          },
        ],
      },
    ],
  };

  const updateStores = useCallback((orgs: Organization[], projs: Project[]) => {
    setIsLoading(true);
    if (orgs && orgs.length > 0) {
      setOrgList(orgs);
      setCurrentOrganization(orgs[0]);
    }

    if (projs && projs?.length > 0) {
      setProjectList(projs);
    }
    setIsLoading(false);
  }, [setOrgList, setCurrentOrganization, setProjectList]);

  useEffect(() => {
    startTransition(() => {
      updateStores(orgs, projs);
    });
  }, [user, orgs, projs, updateStores]);

  if (isLoading) {
    return (
      // sidebar skeleton
      <div className="w-64 h-screen animate-pulse bg-gray-100 dark:bg-gray-900">
        <div className="h-16 bg-gray-200 dark:bg-gray-800 mb-4" />
        <div className="px-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <TeamSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        {user.role !== UserRole.STAKEHOLDER && (
          <NavMain items={data.navMain} />
        )}
        {currentProject && <NavBpmnFile/>}
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