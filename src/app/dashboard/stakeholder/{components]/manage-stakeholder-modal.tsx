import { RainbowButton } from '@/components/ui/rainbow-button';
import React, { useState } from 'react';
import { useModalManager } from '@/hooks/useModalManager';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MdOutlineMailOutline } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

interface ManageStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const bpmnStakeholders = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
];

const pendingStakeholders = [
  { id: 1, name: "", email: "john.doe@example.com" }
];

const ManageStakeholderModal: React.FC<ManageStakeholderModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    const handleInviteClick = () => {
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          return;
        }
        // Handle the invite logic here
    };

    const handleEmailFocus = () => {
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
        <div className="w-[600px] max-h-[650px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center text-center">
            <img
                alt="empty"
                loading="lazy"
                width={150}
                height={150}
                decoding="async"
                data-nimg="1"
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
                placeholder="Enter email address"
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
                    <AvatarImage src='' alt={stakeholder.name.charAt(0)} />
                    <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{stakeholder.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                    <span className="truncate text-sm font-medium">{stakeholder.name}</span>
                    <span className="truncate text-sm">{stakeholder.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                    <TiDeleteOutline
                        className="text-gray-500 cursor-pointer hover:text-red-500"
                        title="Revoke Access"
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
                    <AvatarImage src='' alt={stakeholder.name.charAt(0)} />
                    <AvatarFallback className="rounded-lg text-gray-600 dark:text-gray-200">{stakeholder.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-left text-sm leading-tight flex-grow">
                    <span className="truncate text-sm font-medium">{stakeholder.name}</span>
                    <span className="truncate text-sm">{stakeholder.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                    <MdOutlineMailOutline
                        className="text-gray-500 cursor-pointer hover:text-blue-500"
                        title="Resend Invitation"
                    />
                    <TiDeleteOutline
                        className="text-gray-500 cursor-pointer hover:text-red-500"
                        title="Revoke Access"
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