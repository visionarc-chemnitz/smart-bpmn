import { RainbowButton } from '@/components/ui/rainbow-button';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useModalManager } from '@/hooks/useModalManager';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MdOutlineMailOutline } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { User } from 'next-auth';
import Image from 'next/image';
import { useOrganizationWorkspaceContext } from '@/providers/organization-workspace-provider';

interface Invitation {
    id?: string;
    bpmnId: string | undefined;
    email: string;
}

interface ManageStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageStakeholderModal: React.FC<ManageStakeholderModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = React.useState('');
    const { currentBpmn }  = useOrganizationWorkspaceContext();
    const bpmnId = currentBpmn?.id;
    
    const [bpmnStakeholders, setBpmnStakeholders] = useState<User[]>([]);
    const [pendingStakeholders, setPendingStakeholders] = useState<Invitation[]>([]);

    const fetchBpmnStakeholders = async () => {
      try {
        const response = await fetch(`${API_PATHS.GET_BPMN_STAKEHOLDERS}?bpmnId=${currentBpmn?.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch BPMN stakeholders');
        }
        const data = await response.json();
        setBpmnStakeholders(data.stakeholders);
      } catch (error) {
        console.error('Error fetching BPMN stakeholders:', error);
      }
    };

    const fetchPendingBpmnStakeholders = async () => {
      try {
        const response = await fetch(`${API_PATHS.GET_PENDING_BPMN_STAKEHOLDERS}?bpmnId=${currentBpmn?.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pending BPMN stakeholders');
        }
        const data = await response.json();
        setPendingStakeholders(data.pendingStakeholders);
      } catch (error) {
        console.error('Error fetching pending BPMN stakeholders:', error);
      }
    };

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

        if (!bpmnId) {
            setError('BPMN ID is required');
            return;
        }
        const requestBody = {
            email: email,
            bpmnId: bpmnId
        };
        // Handle the invite logic here
        const response = await fetch(API_PATHS.INVITE_STAKEHOLDER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
        setPendingStakeholders([...pendingStakeholders, {email: email, bpmnId: bpmnId!}]);
        }

        const data = await response.json();
        setPendingStakeholders([...pendingStakeholders, {email: email, bpmnId: bpmnId}]);
        setEmail('');
        window.alert('User has been invited successfully!');
    };

    const handleEmailFocus = () => {
        setError('');
    };

    const resendInvitation = async (email: string, bpmnId: string) => {
        const requestBody = {
            email: email,
            bpmnId: bpmnId
        };
        // Handle the invite logic here
        const response = await fetch(API_PATHS.RESEND_STAKEHOLDER_INVITATION, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            throw new Error('Error inviting user.');
        }

        const data = await response.json();
        window.alert('User has been reinvited successfully!');
    };

    const removeStakeholder = async (email: string, bpmnId: string) => {
      revokeAccess(email, bpmnId);
      setBpmnStakeholders(bpmnStakeholders.filter((stakeholder) => stakeholder.email !== email));
    }

    const removeInvitation = async (email: string, bpmnId: string) => {
      revokeAccess(email, bpmnId);
      setPendingStakeholders(pendingStakeholders.filter((stakeholder) => stakeholder.email !== email));
    }

    const revokeAccess = async (email: string, bpmnId: string) => {
      const response = await fetch(`${API_PATHS.REVOKE_STAKEHOLDER_BPMN_ACCESS}?email=${email}&bpmnId=${bpmnId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
          throw new Error('Error deleting user');
      }

      const data = await response.json();
      window.alert(data.message);
    }

    useEffect(() => {
      if (isOpen) {
        fetchBpmnStakeholders();
        fetchPendingBpmnStakeholders();
      }
    }, [isOpen, bpmnId]);

    if (!isOpen) return null;
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
        <div className="w-[600px] max-h-[650px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center text-center">
            <Image
                alt="empty"
                width={150}
                height={150}
                src="/assets/img/stakeholders/stakeholders.png"
                className='opacity-85'
                style={{ color: 'transparent' }}
            />
            <h3 className="text-2xl font-semibold text-blue-500 dark:text-blue-300 mt-2">Manage who can view this BPMN</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
                Your BPMN is live! Choose who can view it.
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

            {bpmnStakeholders.length > 0 && (
            <div>
                <hr className="my-4 border-gray-300 dark:border-gray-600" />
                <p className="text-sm text-gray-700 mt-2 mb-2 ml-1 dark:text-gray-200 font-semibold">Stakeholders</p>
                {bpmnStakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center gap-2 mb-2 px-1 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded">
                    <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src='' alt={stakeholder?.name?.charAt(0)} />
                    <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{stakeholder?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                    <span className="truncate text-sm font-medium">{stakeholder.name}</span>
                    <span className="truncate text-sm">{stakeholder.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                    <TiDeleteOutline
                        className="text-gray-500 cursor-pointer hover:text-red-500"
                        title="Revoke Access"
                        onClick={() => stakeholder.email && bpmnId && removeStakeholder(stakeholder.email, bpmnId)}
                    />
                    </div>
                </div>
                ))}
            </div>
            )}

            {pendingStakeholders.length > 0 && (
            <div>
                <hr className="my-4 border-gray-300 dark:border-gray-600" />
                <p className="text-sm text-gray-700 mt-2 mb-2 ml-1 dark:text-gray-200 font-semibold">Pending Invitations</p>
                {pendingStakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center gap-2 mb-2 px-1 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded">
                    <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{stakeholder?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                    <span className="truncate text-sm">{stakeholder?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                    <MdOutlineMailOutline
                        className="text-gray-500 cursor-pointer hover:text-blue-500"
                        title="Resend Invitation"
                        onClick={() => bpmnId && resendInvitation(stakeholder.email, bpmnId)}
                    />
                    <TiDeleteOutline
                        className="text-gray-500 cursor-pointer hover:text-red-500"
                        title="Revoke Access"
                        onClick={() => bpmnId && removeInvitation(stakeholder.email, bpmnId)}
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

export default ManageStakeholderModal;
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
