"use client";

import BreadcrumbsHeader from './(components)/breadcrumbs-header'
import NewTeam from './(components)/new-team';
import { TeamFileList } from './(components)/teamFileList';
import TeamSpacePage from './(components)/teamSpace';

export default function DashBoardPage() {
  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Playground' parent='/' />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div> */}
        <div />
        <TeamSpacePage />
        <TeamFileList />
        <NewTeam />
      </div>
    </>
  )
}
