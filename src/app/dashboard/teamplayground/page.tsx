"use client"

import * as React from "react"
import TeamSpacePage from "./(components)/teamSpace"
import { TeamFileList } from "./(components)/teamFileList"

const DashboardTeamPlayground: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <TeamSpacePage />
      <div className="my-8" />
      <TeamFileList />
    </div>
  )
}

export default DashboardTeamPlayground