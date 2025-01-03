import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useOrganizationModal } from "@/hooks/use-organization-modal";
import OrganizationModal from "@/app/dashboard/organization/(components)/organization-modal";

export function TeamSwitcher({
  organizations,
}: {
  organizations: {
    name: string;
    projects?: { name: string; url: string; icon: React.ElementType }[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeOrganization, setActiveOrganization] = React.useState(organizations[0] || { name: "No Organization", projects: [] });

  // Use the useOrganizationModal hook
  const {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    handleSubmit,
    ownerName,
    setOwnerName,
    ownerEmail,
    setOwnerEmail,
  } = useOrganizationModal();

  React.useEffect(() => {
    if (organizations.length > 0) {
      setActiveOrganization(organizations[0]);
    }
  }, [organizations]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all ease-in-out duration-200"
              >
                <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
                  <span className="truncate font-semibold text-gray-800 dark:text-white">
                    {activeOrganization?.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto text-gray-500 dark:text-gray-400 transition-all duration-200" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white dark:bg-gray-800 shadow-xl"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveOrganization(team)}
                  className="gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 ease-in-out"
                >
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="gap-2 p-2">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                  onClick={openModal} // Open the modal using the hook
                >
                  <Plus className="size-4 text-gray-500 dark:text-gray-300 transition-colors duration-200" />
                  <div className="font-medium text-muted-foreground dark:text-muted-foreground-dark">
                    Add Your Organization
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Projects Menu */}

      {/* Organization Modal */}
      <OrganizationModal
        isOpen={isOpen}
        onClose={closeModal}
        handleSubmit={handleSubmit}
        organizationName={organizationName}
        setOrganizationName={setOrganizationName}
        ownerName={ownerName}
        setOwnerName={setOwnerName}
        ownerEmail={ownerEmail}
        setOwnerEmail={setOwnerEmail}
      />
    </>
  );
}