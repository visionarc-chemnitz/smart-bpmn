"use client";

import { AppSidebar } from "./(components)/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { UserProvider } from "@/providers/user-provider";
import UpdateNameModal from "./(components)/update-name-modal";
import { useEffect, useState } from "react";
import { getUser, getUserData, updateUserName } from "../services/user/user.service";
import { API_PATHS } from "../api/api-path/apiPath";
import { User, UserRole } from "@/types/user/user";
import { OrganizationWorkspaceProvider } from "@/providers/organization-workspace-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  role: UserRole.MEMBER, // or any default role you prefer
  organizationId: '',
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data and update state
    const fetchUserData = async () => {
      const user = await getUserData();
      if (user?.id) {
        const userData = await getUser(user.id);
        if (userData) {
          const updatedUser: User = {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            avatar: userData.image || '',
            role: userData.role as UserRole || UserRole.MEMBER,
            organizationId: userData.organizationId || '',
          };
          setUser(updatedUser);
          setIsModalOpen(!userData.name); // Open modal if the user name is missing
          if (updatedUser.organizationId) {
            localStorage.setItem('selectedOrganizationId', updatedUser.organizationId);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSaveName = async (name: string) => {
    const res = await fetch(API_PATHS.UPDATE_USER, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { id: user.id, name } }),
    });
    if (res){
      setUser((prevUser) => ({ ...prevUser, name }));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-screen w-full">
      <UserProvider user={user}>
        <OrganizationWorkspaceProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
          <UpdateNameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveName}
          />
        </OrganizationWorkspaceProvider>
      </UserProvider>
    </div>
  );
};

export default DashboardLayout;
