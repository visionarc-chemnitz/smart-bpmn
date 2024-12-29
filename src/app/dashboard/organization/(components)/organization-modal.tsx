import React from 'react';
import { RainbowButton } from '@/components/ui/rainbow-button';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  organizationName: string;
  setOrganizationName: (name: string) => void;
  emailInput: string;
  setEmailInput: (email: string) => void;
  teamMemberEmails: string[];
  handleAddEmail: () => void;
  handleRemoveEmail: (email: string) => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  handleSubmit,
  organizationName,
  setOrganizationName,
  emailInput,
  setEmailInput,
  teamMemberEmails,
  handleAddEmail,
  handleRemoveEmail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
      <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Create New Organization</h2>
        <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
          Fill out the details to create a new organization.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Organization Name Input */}
          <input
            type="text"
            placeholder="Organization Name"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />

          {/* Team Member Emails */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter team member email"
              className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <RainbowButton
              type="button"
              onClick={handleAddEmail}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
            >
              +
            </RainbowButton>
          </div>

          {/* Display Added Emails */}
          {teamMemberEmails.length > 0 && (
            <ul className="mt-2 space-y-2">
              {teamMemberEmails.map((email) => (
                <li key={email} className="flex items-center justify-between text-sm dark:text-gray-200">
                  <span>{email}</span>
                  <RainbowButton
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
                  >
                    -
                  </RainbowButton>
                </li>
              ))}
            </ul>
          )}

          {/* Submit Button */}
          <RainbowButton
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black shadow-lg"
          >
            Create Organization
          </RainbowButton>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OrganizationModal;
