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

import { RainbowButton } from "@/components/ui/rainbow-button"

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
  const [teamSize, setTeamSize] = React.useState("")
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
          <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Create New Organization</h2>
            <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
              Fill out the details to create a new organization.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Team Name Input */}
              <input
                type="text"
                placeholder="Organization Name"
                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                name="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />

              {/* Team Size Input */}
              <input
                type="number"
                placeholder="Team Size"
                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                name="teamSize"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />

              {/* Team Member Emails */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter team member email"
                  className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <RainbowButton
                  type="button"
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
                  onClick={handleAddEmail}
                >
                  +
                </RainbowButton>
              </div>

              {/* Display Added Emails */}
              {teamMemberEmails.length > 0 && (
                <div className="mt-2">
                  <h6 className="font-semibold dark:text-gray-300">Added Emails:</h6>
                  <ul className="space-y-2">
                    {teamMemberEmails.map((email) => (
                      <li key={email} className="flex items-center justify-between text-sm dark:text-gray-200">
                        <span>{email}</span>
                        <RainbowButton
                          type="button"
                          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
                          onClick={() => handleRemoveEmail(email)}
                        >
                          -
                        </RainbowButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <RainbowButton
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black shadow-lg"
              >
                Create Organization
              </RainbowButton>
            </form>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setIsModalOpen(false)} // Close the modal
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </SidebarMenu>
  )
}