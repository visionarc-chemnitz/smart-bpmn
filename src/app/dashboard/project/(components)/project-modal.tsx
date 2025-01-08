import React, { useEffect, useState } from 'react';
import { useUser } from "@/providers/user-provider";
import { useModalManager } from '@/hooks/useModalManager';
import { RainbowButton } from '@/components/ui/rainbow-button';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: { projectName: string; organizationId: string }) => void;
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const {
    projectName,
    setProjectName,
    organization,
    fetchOrganization,
    handleProjectSubmit,
  } = useModalManager();
  const user = useUser();

  useEffect(() => {
    if (user && user.id) {
      fetchOrganization();
    }
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
      <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Create New Project</h2>
        <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
          Fill out the details to create a new project.
        </p>
        <form className="space-y-4" onSubmit={(e) => handleProjectSubmit(e)}>
          <input
            type="text"
            placeholder="Project Name"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            name="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            type="hidden"
            placeholder="Organization"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            value={organization?.name || ''}
            readOnly
          />
          <RainbowButton
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black shadow-lg"
          >
            Create Project
          </RainbowButton>
        </form>
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
}