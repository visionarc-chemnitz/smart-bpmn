"use client";

import React from 'react'

import { useUser } from '@/providers/user-provider';
import { UserRole } from '@/types/user/user';
import BreadcrumbsHeader from '../breadcrumbs-header';
import UserDashBoardPage from './user-dashboard';
import StakeHolderDashBoardPage from '../../(stakeholder)/_components/stakeholder-dashboard-page';

const DahboardContent = () => {
    const user = useUser();
    const breadcrumbTitle = user.role === UserRole.STAKEHOLDER ? '' : 'Playground';
  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current={breadcrumbTitle} parent='/'/>
      {user && user.role !== UserRole.STAKEHOLDER 
        ? 
          (<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UserDashBoardPage />
          </div>)
        :
          (<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <StakeHolderDashBoardPage />
          </div>)
      }
    </>
  )
}

export default DahboardContent