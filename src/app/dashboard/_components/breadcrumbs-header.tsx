"use client";

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToggleButton } from "@/hooks/use-toggle-button";
import { useUser } from "@/providers/user-provider";
import { ProjectModal } from "@/app/dashboard/_components/modals/projectModal";
import {ChevronDown, Info, Plus } from "lucide-react";
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { IoShareSocialOutline } from "react-icons/io5";
import { UserRole } from "@/types/user/user";
// import { useOrganizationContext } from "@/providers/organization-provider";

import { Project } from "@/types/project/project";
import { ManageUsersModal } from "./modals/manage-users-modal";
import { toastService } from "@/app/_services/toast.service";
import { ProjectSelector } from "./project-selector";
import { useOrganizationStore } from "@/store/organization-store";
import { useWorkspaceStore } from "@/store/workspace-store";
// import { useWorkspaceContext } from "@/providers/workspace-provider";


interface BreadcrumbsHeaderProps {
  href: string;
  current: string;
  parent: string;
}


export default function BreadcrumbsHeader({ href, current, parent  }: BreadcrumbsHeaderProps) {
  const { toggleButton } = useToggleButton();
  const {  currentProject, currentBpmn, setCurrentProject, projectList, setProjectList } = useWorkspaceStore();
  const { currentOrganization } = useOrganizationStore();
  // const [selectedProject, setSelectedProject] = useState<string>("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // New info modal state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hasOrganization, setHasOrganization] = useState<boolean>(!!currentOrganization);
  const user = useUser();
  
  const [isManageStakeholderModalOpen, setIsManageStakeholderModalOpen] = useState(false);

  const onShareClick = () => {
    setIsManageStakeholderModalOpen(true);
  };
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          if (currentOrganization) {
            const projectsResponse = await fetch(`${API_PATHS.GET_PROJECTS}?organizationId=${currentOrganization.id}`);

            // const orgData = await orgResponse.json();
            if (!projectsResponse) {
              throw new Error("Failed to fetch projects");
            }
            const projectsData = await projectsResponse.json();
            if (currentOrganization) {
              setHasOrganization(true);
            }

            // Set the selected project and project list in context
            if (projectsData.projects.length > 0) {
              const firstProject = projectsData.projects[0];
              setCurrentProject(firstProject);
              setProjectList(projectsData.projects);
            }
          }
          
        } catch (error) {
          toastService.showDestructive("Error fetching projects.");
        }
      };

      fetchData();
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (currentProject) {
      setIsDropdownOpen(false);
    }
  }, [currentProject]);

  const openCreateProjectModal = () => {
    setIsProjectModalOpen(true);
  }

  const handleProjectChange = (project: Project) => {
    if (!hasOrganization) {
      setIsInfoModalOpen(true);
    }
    setCurrentProject(project);
    setIsDropdownOpen(false);
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
  };

  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {parent && current && href && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>{parent}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{current}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex-1" />
        {user.role !== UserRole.STAKEHOLDER && (currentBpmn !== null) && (
          <RainbowButton type="submit" className="ml-5 mr-2 py-0 text-sm h-8 px-3" onClick={onShareClick}>
            Share
            <IoShareSocialOutline className="ml-1" />
          </RainbowButton>
        )}
        <div className="relative flex items-center gap-2">
        {/* <ProjectSelector /> */}
        <label htmlFor="project-select" className="mr-2">Project:</label>
        <div className="relative">
          <button
            onClick={() => (hasOrganization ? setIsDropdownOpen(!isDropdownOpen) : setIsInfoModalOpen(true))}
            className="w-full min-w-[200px] border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-between"
          >
            {currentProject?.name || "Select Project"}
            <ChevronDown className="ml-2" />
          </button>
          {isDropdownOpen && hasOrganization && (
            <div className="absolute mt-1 w-full min-w-[200px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
              <ul className="py-1">
                {user.role !== UserRole.STAKEHOLDER && (
                  <li
                    onClick={() => openCreateProjectModal()}
                    className="cursor-pointer px-4 py-2 text-green-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span> <Plus /> Create </span>
                  </li>
                )}
                {projectList.map((project) => (
                  <li
                    key={project.id}
                    onClick={() => handleProjectChange(project)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {project.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 px-4">
        {toggleButton()}
      </div>
      {/* <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleProjectModalClose}
      /> */}
      <ManageUsersModal
        isOpen={isManageStakeholderModalOpen}
        onClose={() => setIsManageStakeholderModalOpen(false)}
        type="stakeholder" 
        title="Manage who can view this BPMN" 
        subTitle="Your BPMN is live! Choose who can view it." 
      />
    </header>
  );
}