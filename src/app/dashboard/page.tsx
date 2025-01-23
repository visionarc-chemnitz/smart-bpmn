'use client';

import { useEffect, useState } from 'react';
import BreadcrumbsHeader from './_components/breadcrumbs-header';
import { useUser } from "@/providers/user-provider";
import ManageStakeholderModal from './_components/modals/manage-stakeholder-modal';
import { API_PATHS } from '../api/api-path/apiPath';
import { UserRole } from '@/types/user/user';
// import { useOrganizationContext } from '@/providers/organization-provider';
import { toastService } from '../_services/toast.service';
import NewUserDashBoardPage from './_components/new-user-dashboard';
import StakeholderBpmnPage from './stakeholder-bpmn/page';

export default function DashBoardPage() {
  const user = useUser();  // Get user directly here
  const [hasOrganization, setHasOrganization] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const { setCurrentOrganization } = useOrganizationContext();
  const breadcrumbTitle = user.role === UserRole.STAKEHOLDER ? 'BPMN Files' : 'Playground';
 
  useEffect(() => {
    const invitationToken = localStorage.getItem('invitationToken');
    const requestBody = {
      invitationToken,
    };

    // If invitation token is present in local storage, decode the token and give access to the user
    // if (invitationToken) {
    //   const acceptInvitation = async () => {
    //     const response = await fetch(API_PATHS.ACCEPT_INVITATION, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(requestBody),
    //     });
    //     const data = await response.json(); 
    //     if (data.success) {
    //       toastService.showDefault("You have successfully accepted the invitation.");
    //     }
    //   };
      
    //   // Remove the token from local storage
    //   acceptInvitation();
    //   localStorage.removeItem('invitationToken');
    // }
  }, [user]);

  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current={breadcrumbTitle} parent='/'/>
       {user.role !== UserRole.STAKEHOLDER && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NewUserDashBoardPage />
        </div>
        
      )}

      {user.role == UserRole.STAKEHOLDER && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <StakeholderBpmnPage />
        </div>
      )}
    </>
  );
}