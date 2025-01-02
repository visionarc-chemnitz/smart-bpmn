import { useState } from 'react'

export const useOrganizationModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [organizationName, setOrganizationName] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([])

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleAddEmail = () => {
    if (emailInput.trim() !== "" && !teamMemberEmails.includes(emailInput.trim())) {
      setTeamMemberEmails([...teamMemberEmails, emailInput.trim()])
      setEmailInput("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setTeamMemberEmails(teamMemberEmails.filter((e) => e !== email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/organization-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: organizationName,
          teamMemberEmails,
        }),
      })

      if (!response.ok) {
        throw new Error("Error creating organization")
      }

      const data = await response.json()
      console.log("Organization created:", data)
      closeModal()
    } catch (error) {
      console.error("Error creating organization:", error)
    }
  }

  return {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    emailInput,
    setEmailInput,
    teamMemberEmails,
    handleAddEmail,
    handleRemoveEmail,
    handleSubmit,
  }
}