import React, { useEffect } from 'react';
import { ModalLayout } from '../modalLayout';
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useUser } from '@/providers/user-provider';
import { useModalManager } from '@/hooks/useModalManager';

export const ProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { projectName, setProjectName, handleProjectSubmit } = useModalManager();
    const user = useUser();

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title="Create New Project">
            <form className="space-y-4" onSubmit={handleProjectSubmit}>
                <div>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project Name"
                        required
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                    />
                </div>
                <RainbowButton type="submit" className="w-full">
                    Create Project
                </RainbowButton>
            </form>
        </ModalLayout>
    );
};