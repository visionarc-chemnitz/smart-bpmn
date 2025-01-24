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
import { ProjectModal } from "@/app/dashboard/_components/modals/project-modal";
import { ChevronDown, Info, Plus } from "lucide-react";
import { API_PATHS } from "@/app/api/api-path/apiPath";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { IoShareSocialOutline } from "react-icons/io5";
import { UserRole } from "@/types/user/user";
import { Project } from "@/types/project/project";
import { ManageUsersModal } from "./modals/manage-users-modal";
import { toast } from "sonner";
import { useOrganizationStore } from "@/store/organization-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Label } from "@/components/ui/label";
import { usePathname } from 'next/navigation'

interface BreadcrumbsHeaderProps {
  href: string;
  current: string;
  subParent?: string;
  subParentHref?: string;
  parent: string;
}

export default function BreadcrumbsHeader({
  href,
  current,
  subParent,
  subParentHref,
  parent,
}: BreadcrumbsHeaderProps) {
  const { toggleButton } = useToggleButton();
  const {
    currentProject,
    currentBpmn,
    setCurrentProject,
    projectList,
    setProjectList,
  } = useWorkspaceStore();
  const { currentOrganization } = useOrganizationStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hasOrganization, setHasOrganization] = useState<boolean>(
    !!currentOrganization
  );
  const user = useUser();
  const [isManageStakeholderModalOpen, setIsManageStakeholderModalOpen] =
    useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isDropdownClick = dropdownRef.current?.contains(target);
      const isProjectModalClick = target.closest(".project-modal");
      const isDialogContent = document
        .querySelector('[role="dialog"]')
        ?.contains(target);

      if (!isDropdownClick && !isProjectModalClick && !isDialogContent) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onShareClick = () => {
    setIsManageStakeholderModalOpen(true);
  };
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          if (currentOrganization) {
            const projectsResponse = await fetch(
              `${API_PATHS.GET_PROJECTS}?organizationId=${currentOrganization.id}`
            );

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
          toast.error("Error fetching projects.");
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

  const handleProjectChange = (project: Project) => {
    setCurrentProject(project);
    setIsDropdownOpen(false);
  };

  console.log("pathname", pathname);

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
              {subParent && subParentHref ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={subParentHref}>
                      {subParent}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              ) : null}
              <BreadcrumbItem>
                <BreadcrumbPage>{current}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex-1" />
      {user.role !== UserRole.STAKEHOLDER && currentBpmn !== null && (
        <RainbowButton
          type="submit"
          className="ml-5 mr-2 py-0 text-sm h-8 px-3"
          onClick={onShareClick}
        >
            Share
            <IoShareSocialOutline className="ml-1" />
          </RainbowButton>
        )}
        <div className="relative flex items-center gap-2">
        
        {/* Project dropDown */}
        { pathname.startsWith('/dashboard/chat/') && pathname.length > '/dashboard/chat/'.length ?
          null
          :
          <>
            <Label>Project:</Label>
            <div className="relative" ref={dropdownRef}>
          <button
                onClick={() =>
                  hasOrganization && setIsDropdownOpen(!isDropdownOpen)
                }
                className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 text-sm 
                  bg-background border rounded-md shadow-sm hover:bg-accent
                  transition-colors duration-200 ease-in-out"
              >
                <span className="truncate">
            {currentProject?.name || "Select Project"}
                </span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform duration-200 
                  ${isDropdownOpen ? "rotate-180" : ""}`}
                />
          </button>
          {isDropdownOpen && hasOrganization && (
                <div
                  className="absolute mt-1 w-full min-w-[200px] bg-popover border rounded-md shadow-lg z-50
                animate-in fade-in-0 zoom-in-95"
                >
                  <div className="py-1">
                    {user.role !== UserRole.STAKEHOLDER &&
                      currentOrganization &&
                      currentOrganization.id && (
                        <div className="px-2 py-1.5">
                          <ProjectModal
                            orgId={currentOrganization?.id}
                            open={isOpen}
                            setOpen={setIsOpen}
                          />
                        </div>
                )}
                {projectList.map((project) => (
                      <button
                    key={project.id}
                    onClick={() => handleProjectChange(project)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent 
                        transition-colors duration-200 ease-in-out"
                  >
                    {project.name}
                      </button>
                ))}
                  </div>
            </div>
          )}
        </div>
          </>
        }
        
      </div>
      <div className="flex items-center gap-2 px-4">{toggleButton()}</div>
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
