import React from 'react';
import { ModalLayout } from './modalLayout';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useModalManager } from '@/hooks/useModalManager';

export const OrganizationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { organizationName, setOrganizationName, handleOrganizationSubmit } = useModalManager();

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title="Create New Organization">
            <form className="space-y-4" onSubmit={handleOrganizationSubmit}>
                <div>
                    <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Organization Name"
                        required
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                    />
                </div>
                <RainbowButton type="submit" className="w-full">
                    Create Organization
                </RainbowButton>
            </form>
        </ModalLayout>
    );
};