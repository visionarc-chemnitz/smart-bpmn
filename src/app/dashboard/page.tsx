'use client';

import { useEffect, useState } from 'react';
import BreadcrumbsHeader from './(components)/breadcrumbs-header';
import NewTeam from './(components)/new-team';
import TeamSpacePage from './(components)/teamSpace';
import { useUser } from "@/providers/user-provider";
import Bpmn from './(components)/bpmn-info';
import ManageStakeholderModal from './stakeholder/{components]/manage-stakeholder-modal';
import { useModalManager } from '@/hooks/useModalManager';
import { API_PATHS } from '../api/api-path/apiPath';

export default function DashBoardPage() {
  const user = useUser();  // Get user directly here
  const [hasOrganization, setHasOrganization] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isManageStakeholderModalOpen, setIsManageStakeholderModalOpen] = useState(false);
  const handleShareClick = () => {
    setIsManageStakeholderModalOpen(true); 
  };
 
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
        console.log(data);
      };
      
      // Remove the token from local storage
      acceptInvitation();
      localStorage.removeItem('invitationToken');
    }
    if (user && user.email) {
      const checkUserOrganization = async () => {
        try {
          const response = await fetch(`/api/organization/check-organization?userId=${user.id}`);
          const data = await response.json();

          setHasOrganization(data.hasOrganization);
        } catch (error) {
          console.error("Error checking organization:", error);
        } finally {
          setLoading(false);
        }
      };

      checkUserOrganization();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div>Loading...</div> 
    );
  }


  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Playground' parent='/' onShareClick={handleShareClick} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {hasOrganization ? (
            <TeamSpacePage />
          ) : (
            <NewTeam />
          )}
        </div>
        <ManageStakeholderModal
          isOpen={isManageStakeholderModalOpen}
          onClose={() => setIsManageStakeholderModalOpen(false)}
        />
    </>
  );
}