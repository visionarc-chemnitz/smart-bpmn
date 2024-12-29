"use client"

import * as React from "react"
import TeamSpacePage from "./(components)/teamSpace"
import { TeamFileList } from "./(components)/teamFileList"
import NewTeam from "./(components)/new-team"

const organizationName = ""

const DashboardOrganizationPage = () => {
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
