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
import { ProjectModal } from "@/app/dashboard/organization-project-bpmn-modal/(components)/projectModal";
import { PlusCircle, ChevronDown, Info } from "lucide-react";
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { FaShareAlt } from "react-icons/fa";
import { LiaShareAltSolid } from "react-icons/lia";
import { PiShareNetworkThin } from "react-icons/pi";
import { MdIosShare } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { UserRole } from "@/types/user/user";
import { useOrganizationWorkspaceContext } from "@/providers/organization-workspace-provider";
import { Project } from "@/types/project/project";
import { ManageUsersModal } from "../shared/manage-users-modal";

interface BreadcrumbsHeaderProps {
  href: string;
  current: string;
  parent: string;
  onShareClick: () => void;
}



export default function BreadcrumbsHeader({ href, current, parent  }: BreadcrumbsHeaderProps) {
  const { toggleButton } = useToggleButton();
  // const [selectedProject, setSelectedProject] = useState<string>("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // New info modal state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasOrganization, setHasOrganization] = useState<boolean>(false);
  const user = useUser();
  const { currentOrganization, currentProject, currentBpmn, setCurrentProject, projectList, setProjectList } = useOrganizationWorkspaceContext();
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
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [currentOrganization]);

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

  const handleProjectModalSubmit = async (e: React.FormEvent<HTMLFormElement>, data: { projectName: string; organizationId: string }) => {
    try {
      setIsProjectModalOpen(false);
      const response = await fetch(`${API_PATHS.GET_PROJECTS}?organizationId=${currentOrganization?.id}`);
      const data = await response.json();
      const projects = data.projects;
      if (projects.length > 0) {
        setProjectList(projects); 
        setCurrentProject(projects[projects.length - 1]);
      }
     
    } catch (error) {
      console.error("Error updating projects:", error);
    }
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
        <label htmlFor="project-select" className="mr-2">Project:</label>
        <div className="relative">
          <button
            onClick={() => (hasOrganization ? setIsDropdownOpen(!isDropdownOpen) : setIsInfoModalOpen(true))}
            className="block w-full min-w-[200px] border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-between"
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
                    ➕ Create
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
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleProjectModalClose}
        onSubmit={handleProjectModalSubmit}
      />
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
          <div className="w-[400px] p-6 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Info className="text-blue-500 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">No Organization Found</h2>
            </div>
            <p className="mb-4 text-gray-700 dark:text-gray-300">You need to create an organization first to continue with projects.</p>
            <button
              onClick={handleInfoModalClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
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