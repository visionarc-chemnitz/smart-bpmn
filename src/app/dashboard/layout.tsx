import { AppSidebar } from "./(components)/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { auth } from "@/auth";
import { UserProvider } from "@/providers/user-provider";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const user = await getUserData();
  return (
    <div className="h-screen w-full">
      <UserProvider user={user}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </div>
  );
};
export async function getUserData() {
  const session = await auth(); // Fetch user session
  const user = session?.user;

  return {
    name: user?.name ?? "Guest",
    email: user?.email ?? "",
    avatar: user?.image ?? "",
  };
}
export default DashboardLayout;
