import { RainbowButton } from '@/components/ui/rainbow-button';
import React, { useState } from 'react';
//import { useUser } from "@/providers/user-provider";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectName: string, organizationName: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectName, organizationName);
    setProjectName('');
    setOrganizationName('');
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
      <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter project name"
            />

            <select
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled selected hidden>Select Organization</option>
              <option value="org1">Organization 1</option>
              <option value="org2">Organization 2</option>
              <option value="org3">Organization 3</option>
            </select>

          <div className="flex justify-end">
            <RainbowButton
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black shadow-lg"
          >
            Create Project
          </RainbowButton>
          </div>
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
};

export default ProjectModal;