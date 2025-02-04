import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { UserProvider } from "@/providers/user-provider";
import UpdateNameModal from "./_components/update-name-modal";
import { User, UserRole } from "@/types/user/user";
import { getOrgProjects, getUserInfo, getUserOrganizations } from "@/app/dashboard/_actions/dashboard";
import { Organization } from "@/types/organization/organization";
import { Project } from "@/types/project/project";
import Loading from "../loading";
import { Suspense } from "react";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {

  // Fetch user info
  const user: User = await getUserInfo();
  
  // Fetch organizations based on user role
  const orgs: Organization[] = await getUserOrganizations();  
  
  // Fetch projects based on user role
  const projs: Project[] = await getOrgProjects(); 

  return (
    <div className="h-screen w-full">
      <Suspense fallback={<Loading />}>
        <UserProvider user={user}>
            <SidebarProvider>
              <AppSidebar orgs={orgs} projs={projs} />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </UserProvider>
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
