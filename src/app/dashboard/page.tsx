'use client';

import { useEffect } from 'react';
import BreadcrumbsHeader from './_components/breadcrumbs-header';
import { useUser } from "@/providers/user-provider";
import { API_PATHS } from '../api/api-path/apiPath';
import { UserRole } from '@/types/user/user';
import { toast } from "sonner"
import NewUserDashBoardPage from './_components/pages/new-user-dashboard';
import UserDashBoardPage from './_components/pages/user-dashboard';
import { useOrganizationStore } from '@/store/organization-store';
import StakeHolderDashBoardPage from './(stakeholder)/_components/stakeholder-dashboard-page';
import { useWorkspaceStore } from '@/store/workspace-store';

export default function DashBoardPage() {
  const user = useUser();
  const {currentOrganization} = useOrganizationStore();
  const {currentProject, currentBpmn, setCurrentBpmn, selectionChanged} = useWorkspaceStore();
  const breadcrumbTitle = user.role === UserRole.STAKEHOLDER ? '' : 'Playground';
 
  useEffect(() => {
    const invitationToken = localStorage.getItem('invitationToken');
    const requestBody = {
      invitationToken,
    };

    // If invitation token is present in local storage, decode the token and give access to the user
    if (invitationToken) {
      const acceptInvitation = async () => {
        const response = await fetch(API_PATHS.ACCEPT_INVITATION, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        const data = await response.json(); 
        if (data.success) {
          toast.success("You have successfully accepted the invitation.");
        }
      };
      
      // Remove the token from local storage
      acceptInvitation();
      localStorage.removeItem('invitationToken');
    }
  }, [user]);

  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current={breadcrumbTitle} parent='/'/>
       {user.role !== UserRole.STAKEHOLDER && !currentOrganization && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <NewUserDashBoardPage />
        </div>
      )}

      {/* TODO: Work on the Dashboard for the existing users */}
      {/* Like : Projects card or some datatable etc. */}
      {user.role !== UserRole.STAKEHOLDER && (currentOrganization) && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <UserDashBoardPage />
        </div>
      )}

      {/* TODO: implement a dashboard for stakholder */}
      {user.role === UserRole.STAKEHOLDER && (currentProject && currentProject.id) && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <StakeHolderDashBoardPage projId={currentProject.id} />
        </div>
      )}

    </>
  );
}