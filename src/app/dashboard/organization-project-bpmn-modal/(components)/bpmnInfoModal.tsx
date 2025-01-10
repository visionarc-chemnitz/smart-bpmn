import React, { useEffect } from 'react';
import { useUser } from '@/providers/user-provider';
import { useModalManager } from '@/hooks/useModalManager';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ModalLayout } from '../modalLayout';


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
    isFavorite,
    setIsFavorite,
    isShared,
    setIsShared,
    projects,
    fetchProjects,
    handleBpmnFileSubmit,
  } = useModalManager();
  const user = useUser();

  useEffect(() => {
    if (user && user.id) {
      fetchProjects();
    }
    setFileName(initialData.fileName);
    setProjectId(initialData.projectId);
    setIsFavorite(initialData.isFavorite);
    setIsShared(initialData.isShared);
  }, [user, initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleBpmnFileSubmit(e, { fileName, projectId, createdBy: user.id, isFavorite, isShared });
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
            <option value="" disabled>
              Select Project
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            {isFavorite ? (
              <FaStar className="text-yellow-500 cursor-pointer" onClick={() => setIsFavorite(false)} />
            ) : (
              <FaRegStar className="text-gray-400 cursor-pointer" onClick={() => setIsFavorite(true)} />
            )}
            <span className="ml-2">Favorite</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="form-checkbox rounded text-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2">Shared</span>
          </label>
        </div>

        <RainbowButton type="submit" className="w-full">
          Save
        </RainbowButton>
      </form>
    </ModalLayout>
  );
};