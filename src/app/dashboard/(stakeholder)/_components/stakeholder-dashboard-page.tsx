import React from 'react'
import StakeHolderTable from './stakeholder-table'

interface StakeHolderDashBoardPageProps {
  projId: string
}

export default function StakeHolderDashBoardPage({projId}:StakeHolderDashBoardPageProps) {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
        <h2 className="text-xl sm:text-md md:text-md font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 animate-fade-in text-center">
          Hello Visionaries!
        </h2>
        <h3 className="text-md font-semibold">Shared BPMN files with you</h3>
        <StakeHolderTable projId={projId} />
      </div>
    </>
  )
}