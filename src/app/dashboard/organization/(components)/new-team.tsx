'use client';
import { useState } from "react";
import { useToggleButton } from "@/hooks/use-toggle-button";
import OrganizationModal from "@/hooks/organization-modal";

const NewTeam = () => {
  // Add state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const { toggleButton, logoSrc } = useToggleButton()

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
    console.log("New Team Data:", { organizationName, teamMemberEmails });
    // Implement your form submission logic here
  };

  return (
    
    <>
      <div className="absolute top-4 right-4">
        {toggleButton()}
      </div>
      
      <div className="flex-1 min-h-[calc(100vh-80px)] p-6">
        <div className="h-full flex flex-col items-center justify-center">
          <img
            alt="empty"
            loading="lazy"
            width={150}
            height={150}
            decoding="async"
            data-nimg="1"
            src="/assets/img/organization/organization.png"
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
      
      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        organizationName={organizationName}
        setOrganizationName={setOrganizationName}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        teamMemberEmails={teamMemberEmails}
        handleAddEmail={handleAddEmail}
        handleRemoveEmail={handleRemoveEmail}
      />
    </>
  );
};

export default NewTeam;