'use client';
import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";

const NewTeam = () => {
  // Add state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleAddEmail = () => {
    if (emailInput.trim() !== "" && !teamMemberEmails.includes(emailInput.trim())) {
      setTeamMemberEmails([...teamMemberEmails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setTeamMemberEmails(teamMemberEmails.filter((e) => e !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Team Data:", { organizationName, teamSize, teamMemberEmails });
    // Implement your form submission logic here
  };

  return (
    <>
      <div className="flex-1 min-h-[calc(100vh-80px)] p-6">
        <div className="h-full flex flex-col items-center justify-center">
          <img
            alt="empty"
            loading="lazy"
            width={200}
            height={200}
            decoding="async"
            data-nimg="1"
            src="/assets/img/team/clipboard.png"
            style={{ color: 'transparent' }}
          />
          
          <h2 className="text-2xl font-semibold mt-6">
            Welcome to VisionArc
          </h2>
          
          <p className="text-muted-foreground text-sm mt-2">
            Create an organization to get started
          </p>
          
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
              type="button"
            >
              Create Organization
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-all duration-300">
          <div className="w-[400px] p-6 bg-white border rounded-lg shadow-lg transform transition-all duration-300 scale-100 hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">Create New Organization</h2>
            <p className="text-sm text-gray-600 mt-2 mb-4 dark:text-gray-300">
              Fill out the details to create a new organization.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Team Name Input */}
              <input
                type="text"
                placeholder="Organization Name"
                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                name="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />

              {/* Team Size Input */}
              <input
                type="number"
                placeholder="Team Size"
                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-300 shadow-md"
                name="teamSize"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
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
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
                  onClick={handleAddEmail}
                >
                  +
                </RainbowButton>
              </div>

              {/* Display Added Emails */}
              {teamMemberEmails.length > 0 && (
                <div className="mt-2">
                  <h6 className="font-semibold dark:text-gray-300">Added Emails:</h6>
                  <ul className="space-y-2">
                    {teamMemberEmails.map((email) => (
                      <li key={email} className="flex items-center justify-between text-sm dark:text-gray-200">
                        <span>{email}</span>
                        <RainbowButton
                          type="button"
                          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-black"
                          onClick={() => handleRemoveEmail(email)}
                        >
                          -
                        </RainbowButton>
                      </li>
                    ))}
                  </ul>
                </div>
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
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewTeam;