import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import OrganizationModal from "@/hooks/organization-modal";

export function TeamSwitcher({
  organizations,
}: {
  organizations: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeOrganization, setActiveOrganization] = React.useState(organizations[0])

  // State to manage the team name, team size, and email list
  const [organizationName, setOrganizationName] = React.useState("")
  const [teamSize, setTeamSize] = React.useState<number | null>(null)
  const [teamMemberEmails, setTeamMemberEmails] = React.useState<string[]>([])
  const [emailInput, setEmailInput] = React.useState("")

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleAddEmail = () => {
    if (emailInput.trim() !== "" && !teamMemberEmails.includes(emailInput.trim())) {
      setTeamMemberEmails([...teamMemberEmails, emailInput.trim()])
      setEmailInput("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setTeamMemberEmails(teamMemberEmails.filter((e) => e !== email))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New Team Data:", { organizationName, teamSize, teamMemberEmails })
    // Implement further action, like making an API call or redirecting after form submission
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all ease-in-out duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground dark:bg-sidebar-primary-dark dark:text-sidebar-primary-foreground-dark shadow-lg">
                <activeOrganization.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
                <span className="truncate font-semibold text-gray-800 dark:text-white">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs text-gray-600 dark:text-gray-400">{activeOrganization.plan}</span>
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
                <div className="flex size-6 items-center justify-center rounded-sm border dark:border-gray-700">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                onClick={() => setIsModalOpen(true)} // Open the modal
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

  
      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        organizationName={organizationName}
        setOrganizationName={setOrganizationName}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        teamMemberEmails={teamMemberEmails}
        handleAddEmail={handleAddEmail}
        handleRemoveEmail={handleRemoveEmail}
      />
    </SidebarMenu>
  )
}