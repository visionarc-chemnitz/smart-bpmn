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
  // const [user, setUser] = useState<User>(defaultUser);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   // Fetch user data and update state
  //   const fetchUserData = async () => {
  //     const user = await getUserData();
  //     if (user?.id) {
  //       const userData = await getUser(user.id);
  //       if (userData) {
  //         const updatedUser: User = {
  //           id: userData.id,
  //           name: userData.name || '',
  //           email: userData.email,
  //           avatar: userData.image || '',
  //           role: userData.role as UserRole || UserRole.MEMBER,
  //           organizationId: userData.organizationId || '',
  //         };
  //         setUser(updatedUser);
  //         setIsModalOpen(!userData.name); // Open modal if the user name is missing
  //         if (updatedUser.organizationId) {
  //           localStorage.setItem('selectedOrganizationId', updatedUser.organizationId);
  //         }
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // const handleSaveName = async (name: string) => {
  //   const res = await fetch(API_PATHS.UPDATE_USER, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ user: { id: user.id, name } }),
  //   });
  //   if (res){
  //     setUser((prevUser) => ({ ...prevUser, name }));
  //     setIsModalOpen(false);
  //   }
  // };

  // // // Fetch user info
  const user: User = await getUserInfo();
  
  // // // // Fetch organizations based on user role
  const orgs: Organization[] = await getUserOrganizations();  
  
  // // // // Fetch projects based on user role
  const projs: Project[] = await getOrgProjects(); 

  return (
    <div className="h-screen w-full">
      <Suspense fallback={<Loading />}>
        <UserProvider user={user}>
          {/* <OrganizationWorkspaceProvider> */}
            {/* <SidebarProvider defaultOpen={false}> */}
            <SidebarProvider>
              <AppSidebar orgs={orgs} projs={projs} />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
            {/* <UpdateNameModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveName}
            /> */}
          {/* </OrganizationWorkspaceProvider> */}
        </UserProvider>
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
