"use client";

import React, { memo } from "react";
import { useState, Suspense } from "react";
import { ChevronsUpDown, Plus, GalleryVerticalEnd } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useModalManager } from "@/hooks/useModalManager";
import { OrganizationModal } from '@/app/dashboard/_components/modals/organizationModal';
// import { useOrganizationContext } from "@/providers/organization-provider";
import { Organization } from "@/types/organization/organization";
import { OrgSwitcher } from "@/app/dashboard/_components/switcher/org-switcher";
import { useOrganizationStore } from "@/store/organization-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { getInitials } from "@/lib/utils"


export const TeamSwitcher = memo(function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const {currentOrganization, setCurrentOrganization, orgList} = useOrganizationStore()
  // console.log('currentOrganization in team-switcher', currentOrganization);
  const {} = useWorkspaceStore()

  // Modal state management
  const {
    isOpen,
    openModal,
    closeModal,
  } = useModalManager();

  // const { currentOrganization, setCurrentOrganization, orgList } = useOrganizationContext();
  // console.log('currentOrganization in team-switcher', currentOrganization);

  // Fallback logo if undefined
  // const defaultLogo = GalleryVerticalEnd;

  const handleOrgCLick = (organization: Organization) => () => {
    setCurrentOrganization(organization);
  }


  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                {/* <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
                  <div className="flex items-center gap-2">
                      <div className="h-8 w-8 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded text-white">
                        {currentOrganization ? getInitials(currentOrganization.name) : 'O'}
                      </div>
                    {(
                      <span className="truncate font-semibold text-gray-800 dark:text-white">
                        {currentOrganization?.name || "No Organization"}
                      </span>
                    )}
                  </div>
                </div> */}
                <OrgSwitcher />
                <ChevronsUpDown className="ml-auto text-gray-500 dark:text-gray-400 transition-all duration-200" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white dark:bg-gray-800 shadow-xl"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel>Organizations</DropdownMenuLabel>
              { orgList && orgList.length > 0 ? (
                  orgList.map((organization) => (
                    <DropdownMenuItem
                      key={organization.id}
                      onClick={handleOrgCLick(organization)}
                      className="gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      {organization.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem asChild>
                    <div
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      onClick={openModal}
                    >
                      <Plus className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-gray-300">
                        Add Your Organization
                      </span>
                    </div>
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Organization Modal */}
      <OrganizationModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
});
