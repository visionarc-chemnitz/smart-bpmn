"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useState } from "react";
import { ManageUsersModal } from "./modals/manage-users-modal";
import { AiOutlineTeam } from "react-icons/ai";

export function Settings() {
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  
  const openManageMembersModal = () => setIsManageMembersModalOpen(true);
  const closeManageMembersModal = () => setIsManageMembersModalOpen(false);

  return (
    <div>
      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuButton onClick={openManageMembersModal} className="flex items-center">
            <AiOutlineTeam />
            <span>Members</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarGroup>

      <ManageUsersModal 
        isOpen={isManageMembersModalOpen} 
        onClose={closeManageMembersModal} 
        type="member" 
        title="Manage team members" 
        subTitle="Add new or remove existing members on this organization" 
      />
    </div>
  )
}
