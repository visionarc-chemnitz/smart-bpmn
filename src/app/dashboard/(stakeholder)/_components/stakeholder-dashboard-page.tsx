import React from 'react'
import StakeHolderTable from './stakeholder-table'

interface StakeHolderDashBoardPageProps {
  projId: string,
}

export default function StakeHolderDashBoardPage({projId}:StakeHolderDashBoardPageProps) {
  
  return (
    <>
     <div className="container mx-auto p-6">
        <div className="rounded-md border">
          <StakeHolderTable projId={projId} />
        </div>
      </div>
    </>
  )
}