"use client"

import * as React from "react"
import { PrismaClient } from "@prisma/client"
import TeamSpacePage from "./(components)/teamSpace"
import { TeamFileList } from "./(components)/teamFileList"
import NewTeam from "./(components)/new-team"

const prisma = new PrismaClient()

const DashboardOrganizationPage = () => {
  const [organizationName, setOrganizationName] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOrganizationName = async () => {
      try {
        const organization = await prisma.organization.findFirst() // Adjust the query as needed
        setOrganizationName(organization?.name || null)
        alert("Organization Name: " + organization?.name)
      } catch (error) {
        console.error("Error fetching organization name:", error)
        setOrganizationName("")
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationName()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {organizationName ? (
        <>
          <TeamSpacePage />
          <TeamFileList />
        </>
      ) : (
        <NewTeam />
      )}
    </div>
  )
}

export default DashboardOrganizationPage
