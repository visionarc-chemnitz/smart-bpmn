import React, { useEffect } from 'react';
import { useUser } from "@/providers/user-provider";
import { useModalManager } from '@/hooks/useModalManager';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import Font Awesome star icons

interface BpmnFileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, data: {
    fileName: string;
    projectId: string;
    createdBy: string;
    isFavorite: boolean;
    isShared: boolean;
  }) => void;
  initialData: {
    fileName: string;
    projectId: string;
    createdBy: string;
    isFavorite: boolean;
    isShared: boolean;
  };
}

export default function BpmnFileInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BpmnFileInfoModalProps) {
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
  }, [user]);

  useEffect(() => {
    setFileName(initialData?.fileName || '');
    setProjectId(initialData?.projectId || '');
    setIsFavorite(initialData?.isFavorite || false);
    setIsShared(initialData?.isShared || false);
  }, [initialData]);

  // If the modal is not open, return null to avoid rendering
  if (!isOpen) return null;

  // Handle form submission, passing both event and form data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect the form data
    const formData = {
      fileName,
      projectId,
      createdBy: user.id, // Default to user email if empty
      isFavorite,
      isShared,
    };

    console.log('Submitting Form with Data:', formData);

    // Call the parent `onSubmit` handler, passing both event and form data
    onSubmit(e, formData);
    handleBpmnFileSubmit(e, formData); // Use the hook's submit handler
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
      <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">BPMN File Info</h2>
        <form
          className="space-y-4"
          onSubmit={handleSubmit} // Handle the form submit using handleSubmit function
        >
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File Name</label>
          <input
            type="text"
            id="fileName"
            placeholder="File Name"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
          <select
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
          >
            <option value="" disabled>Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <label htmlFor="isFavorite" className="flex items-center">
              {/* Star icon toggle for "Favorite" */}
              {/* Clicking the star icon will now toggle the favorite state */}
              {isFavorite ? (
                <FaStar
                  className="text-yellow-500 cursor-pointer"
                  size={24}
                  onClick={() => setIsFavorite(false)} // Toggling to false when clicked
                />
              ) : (
                <FaRegStar
                  className="text-gray-400 cursor-pointer"
                  size={24}
                  onClick={() => setIsFavorite(true)} // Toggling to true when clicked
                />
              )}
              <span className="ml-2">Favorite</span>
            </label>
            <label htmlFor="isShared" className="flex items-center">
              <input
                type="checkbox"
                id="isShared"
                className="form-checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
              <span className="ml-2">Shared</span>
            </label>
          </div>

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