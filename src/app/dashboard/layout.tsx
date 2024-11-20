"use client";

import { AppSidebar } from "./(components)/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen w-full">
       <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      {children}
      </SidebarInset>
    </SidebarProvider>

    </div>
  );
};

export default DashboardLayout;
