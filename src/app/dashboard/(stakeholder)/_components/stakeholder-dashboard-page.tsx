import React from 'react'
import StakeHolderTable from './stakeholder-table'
export default function StakeHolderDashBoardPage() {
  
  return (
    <>
     <div className="container mx-auto p-6">
        <div className="rounded-md border">
          <StakeHolderTable/>
        </div>
      </div>
    </>
  )
}