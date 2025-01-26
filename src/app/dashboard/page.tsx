'use client';

import { Suspense, useCallback, useEffect, useState, useTransition } from 'react';
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
import { Loader } from 'lucide-react';


export default function DashBoardPage() {
  const user = useUser();
  const {currentOrganization} = useOrganizationStore();
  const {currentProject, currentBpmn, setCurrentBpmn, selectionChanged} = useWorkspaceStore();
  const breadcrumbTitle = user.role === UserRole.STAKEHOLDER ? '' : 'Playground';
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const acceptInvitation = useCallback(async (invitationToken: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(API_PATHS.ACCEPT_INVITATION, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationToken }),
        });
        const data = await response.json(); 
        if (data.success) {
          toast.success("You have successfully accepted the invitation.");
        }
        console.log('Invitation data:', data);
      } catch (error) {
        toast.error("Failed to accept invitation");
      }
    });
  }, [startTransition]);
  
  useEffect(() => {
    const invitationToken = localStorage.getItem('invitationToken');
    if (invitationToken) {
      acceptInvitation(invitationToken);  
      localStorage.removeItem('invitationToken');
    }
  }, [user, acceptInvitation]);

  useEffect(() => {
    if (currentOrganization !== undefined && currentProject !== undefined) {
      setIsLoading(false);
    }
  }, [currentOrganization, currentProject]);

  if (isLoading) {
      return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

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