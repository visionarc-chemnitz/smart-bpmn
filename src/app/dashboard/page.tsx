'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useUser } from "@/providers/user-provider";
import { API_PATHS } from '../api/api-path/apiPath';
import { UserRole } from '@/types/user/user';
import { toast } from "sonner"
import { useOrganizationStore } from '@/store/organization-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { Loader } from 'lucide-react';
import { OrgModal } from './_components/modals/org-modal';
import DahboardContent from './_components/pages/dashbaord-content';
import { RenameModal } from './_components/modals/rename-modal';
import { useRouter } from 'next/navigation';


export default function DashBoardPage() {
  const user = useUser();
  const {currentOrganization} = useOrganizationStore();
  const {currentProject} = useWorkspaceStore();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();


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
          // TODO: update the user state instead of refreshing the page
          router.refresh()
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
      {user &&
        (!user.name ? (
          <RenameModal />
        ) : user.role !== UserRole.STAKEHOLDER && !currentOrganization ? (
          <OrgModal />
        ) : (
          <DahboardContent />
        ))}
    </>
  );
}