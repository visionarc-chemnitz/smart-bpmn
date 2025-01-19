import { API_PATHS } from '@/app/api/api-path/apiPath';
import { toastService } from '@/app/services/toast.service';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useOrganizationWorkspaceContext } from '@/providers/organization-workspace-provider';
import { User } from '@/types/user/user';
import { AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { MdOutlineMailOutline } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';

interface Invitation {
  id?: string;
  bpmnId?: string | undefined;
  organizationId?: string | undefined;
  email: string;
}

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  title: string;
  subTitle: string;
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({ isOpen, onClose, type, title, subTitle }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = React.useState('');
  const { currentOrganization, currentBpmn }  = useOrganizationWorkspaceContext();
  const [ pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [ existingUsers, setExistingUsers] = useState<User[]>([]);
  const bpmnId = currentBpmn?.id;
  const currentOrganizationId = currentOrganization?.id;
  const isMemberModal = type === 'member';
  const listLabel = isMemberModal ? 'Members' : 'Stakeholders';
  const img = isMemberModal ? {url: '/assets/img/organization/members.png', height: 200, width: 200} : { url: '/assets/img/organization/stakeholders.png', height: 150, width: 150 };

  // API Routes for managing users
  const getMembersLink = API_PATHS.GET_MEMBERS;
  const getPendingMembersLink = API_PATHS.GET_PENDING_MEMBERS;
  const memberInviteLink = API_PATHS.INVITE_MEMBER;
  const memberResendLink = API_PATHS.RESEND_MEMBER_INVITATION;
  const memberRemoveLink = API_PATHS.REVOKE_MEMBER_ACCESS;

  // API Routes for managing stakeholders
  const stakeholderInviteLink = API_PATHS.INVITE_STAKEHOLDER;
  const stakeholderResendLink = API_PATHS.RESEND_STAKEHOLDER_INVITATION;
  const stakeholderRemoveLink = API_PATHS.REVOKE_STAKEHOLDER_BPMN_ACCESS;
  const getPendingStakeholdersLink = API_PATHS.GET_PENDING_BPMN_STAKEHOLDERS;
  const getStakeholdersLink = API_PATHS.GET_BPMN_STAKEHOLDERS;

  const isInviteDisabled = !email || !validateEmail(email);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchPendingUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
  };
  
  const handleInviteClick = async () => {
    if (!email) {
        setError('Email is required');
        return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const inviteUrl = isMemberModal ? memberInviteLink : stakeholderInviteLink;
    const requestBody = isMemberModal ? { email: email, organizationId: currentOrganizationId } : { email: email, bpmnId: bpmnId };

    // Handle the invite logic here
    const response = await fetch(inviteUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
    });
    

    const data = await response.json();
    setPendingInvitations([...pendingInvitations, {email: email}]);
    setEmail('');
    toastService.showDefault('User has been invited.');
  };

  const handleEmailFocus = () => {
      setError('');
  };

  const fetchUsers = async () => {
    const getUsersLink = isMemberModal ? getMembersLink : getStakeholdersLink;
    const requestParams = isMemberModal ? `organizationId=${currentOrganizationId}` : `bpmnId=${bpmnId}`;
    try {
      const response = await fetch(`${getUsersLink}?${requestParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch BPMN stakeholders');
      }
      const data = await response.json();
      setExistingUsers(data.users);
    } catch (error) {
      toastService.showDestructive('Error fetching users.');
    }
  };

  const fetchPendingUsers = async () => {
    const getPendingUsersLink = isMemberModal ? getPendingMembersLink : getPendingStakeholdersLink;
    const requestParams = isMemberModal ? `organizationId=${currentOrganizationId}` : `bpmnId=${bpmnId}`;
    try {
      const response = await fetch(`${getPendingUsersLink}?${requestParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pending invitations');
      }
      const data = await response.json();
      setPendingInvitations(data.invitations);
    } catch (error) {
      toastService.showDestructive('Error fetching pending invitations.');
    }
  };

  const resendInvitation = async (email: string) => {
    const resendInviteUrl = isMemberModal ? memberResendLink : stakeholderResendLink;
    const requestBody = isMemberModal ? { email: email, organizationId: currentOrganizationId } : { email: email, bpmnId: bpmnId };

    // Handle the invite logic here
    const response = await fetch(resendInviteUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
    });
      
    if (!response.ok) {
      throw new Error('Error inviting user.');
    }
    toastService.showDefault('User has been reinvited.');
  };

  const removeUser = async (email: string) => {
    revokeAccess(email);
    setExistingUsers(existingUsers.filter((user) => user.email !== email));
  }

  const removeInvitation = async (email: string) => {
    revokeAccess(email);
    setPendingInvitations(pendingInvitations.filter((invitation) => invitation.email !== email));
  }

  const revokeAccess = async (email: string) => {
    const revokeAccessUrl = isMemberModal ? memberRemoveLink : stakeholderRemoveLink;
    const requestParams = isMemberModal ? `email=${email}&organizationId=${currentOrganizationId}` : `email=${email}&bpmnId=${bpmnId}`;

    const response = await fetch(`${revokeAccessUrl}?${requestParams}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
        throw new Error('Error deleting user');
    }

    toastService.showDefault("Access has been revoked successfully.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
    <div className="w-[600px] max-h-[650px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center text-center">
        <Image
            alt="empty"
            width={img.width}
            height={img.height}
            src={img.url}
            className='opacity-85'
            style={{ color: 'transparent' }}
        />
        <h3 className="text-2xl font-semibold text-blue-500 dark:text-blue-300 mt-2">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
            {subTitle}
        </p>
        </div>

        <div className="mb-4">
        <p className="text-sm text-gray-700 mt-2 mb-2 ml-1 dark:text-gray-200 font-semibold">Invite with email</p>
        <div className="flex gap-2">
            <input
            type="text"
            id="email"
            value={email}
            placeholder="Enter email address"
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            />
            <button
            onClick={handleInviteClick}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
            Invite
            </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {existingUsers?.length > 0 && (
        <div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <p className="text-sm text-gray-700 mt-2 mb-2 ml-1 dark:text-gray-200 font-semibold">{listLabel}</p>
            {existingUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2 mb-2 px-1 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src='' alt={user?.name?.charAt(0)} />
                  <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 mr-2">
                <TiDeleteOutline
                    className="text-gray-500 cursor-pointer hover:text-red-500"
                    title="Revoke Access"
                    onClick={() => user.email && removeUser(user.email)}
                />
                </div>
            </div>
            ))}
        </div>
        )}

        {pendingInvitations?.length > 0 && (
        <div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <p className="text-sm text-gray-700 mt-2 mb-2 ml-1 dark:text-gray-200 font-semibold">Pending Invitations</p>
            {pendingInvitations.map((user) => (
            <div key={user.id} className="flex items-center gap-2 mb-2 px-1 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded">
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                <span className="truncate text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 mr-2">
                <MdOutlineMailOutline
                    className="text-gray-500 cursor-pointer hover:text-blue-500"
                    title="Resend Invitation"
                    onClick={() => resendInvitation(user.email)}
                />
                <TiDeleteOutline
                    className="text-gray-500 cursor-pointer hover:text-red-500"
                    title="Revoke Access"
                    onClick={() => removeInvitation(user.email)}
                />
                </div>
            </div>
            ))}
        </div>
        )}

        <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        onClick={onClose}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>
    </div>
    </div>
  );
};

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

