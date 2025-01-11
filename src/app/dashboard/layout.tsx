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
import { getUserData, updateUserName } from "../services/user/user.service";
import { API_PATHS } from "../api/api-path/apiPath";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ id: string, name: string, email: string, avatar: string }>({ id: "", name: "", email: "", avatar: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data and update state
    const fetchUserData = async () => {
      const user = await getUserData();
      const userData = {
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.image || "",
      };

      setUser(userData);
      setIsModalOpen(!userData.name); // Open modal if the user name is missing
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
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
        <UpdateNameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveName}
        />
      </UserProvider>
    </div>
  );
};

export default DashboardLayout;
