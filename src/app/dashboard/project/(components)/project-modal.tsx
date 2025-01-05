import React, { useEffect, useState } from 'react';
import { useUser } from "@/providers/user-provider";

interface Organization {
  id: string;
  name: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: { projectName: string; organizationId: string }) => void;
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const user = useUser();

  useEffect(() => {
    if (user && user.email) {
      const fetchOrganizations = async () => {
        try {
          const response = await fetch(`/api/get-organizations?email=${user.email}`);
          const data = await response.json();
          setOrganizations(data.organizations);
        } catch (error) {
          console.error("Error fetching organizations:", error);
        }
      };

      fetchOrganizations();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestBody = {
      projectName,
      organizationId,
      ownerName: user.name,
      ownerEmail: user.email,
    };

    try {
      const response = await fetch('/api/add-project-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        window.alert('Failed to create project.');
        throw new Error('Error creating project');
      }

      const data = await response.json();
      console.log('Project created:', data);
      window.alert('Project created successfully!');
      onSubmit(e, { projectName, organizationId });
      setProjectName('');
      setOrganizationId('');
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating project:', error);
      window.alert('An error occurred while saving the data.');
    }
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
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>Select Organization</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}