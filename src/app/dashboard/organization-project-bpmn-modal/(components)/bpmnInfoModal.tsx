import React, { useEffect } from 'react';
import { useUser } from '@/providers/user-provider';
import { useModalManager } from '@/hooks/useModalManager';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ModalLayout } from '../modalLayout';
import { useOrganizationWorkspaceContext } from '@/providers/organization-workspace-provider';


export const BpmnFileInfoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        fileName: string;
        projectId: string;
        createdBy: string;
        isFavorite: boolean;
        isShared: boolean;
    };
}> = ({ isOpen, onClose, initialData }) => {
    const {
        fileName,
        setFileName,
        projectId,
        setProjectId,
        handleBpmnFileSubmit,
    } = useModalManager();
    const user = useUser();
    const {currentProject} = useOrganizationWorkspaceContext();

    useEffect(() => {
        if (user && user.id) {
            // fetchProjects();
        }
        setFileName(initialData.fileName);
        if (currentProject && currentProject.id) {
            setProjectId(currentProject.id);
        }
    }, [user, initialData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleBpmnFileSubmit(e, { fileName, projectId, createdBy: user.id });
        onClose();
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title="BPMN File Info">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="File Name"
                        required
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                    />
                </div>

                <div>
                    <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300"
                    >
                      
                        <option key={currentProject?.id} value={currentProject?.id}>
                            {currentProject?.name}
                        </option>
                    </select>
                </div>

                <RainbowButton type="submit" className="w-full">
                    Save
                </RainbowButton>
            </form>
        </ModalLayout>
    );
};