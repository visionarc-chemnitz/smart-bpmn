'use client';

import { useOrganizationModal } from "@/hooks/use-organization-modal";
import { useToggleButton } from "@/hooks/use-toggle-button";
import OrganizationModal from "@/app/dashboard/organization/(components)/organization-modal";

const NewTeam = () => {
  // Use the hook to manage the modal's state and logic
  const {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    emailInput,
    setEmailInput,
    teamMemberEmails,
    handleAddEmail,
    handleRemoveEmail,
    handleSubmit,
  } = useOrganizationModal();

  const { toggleButton, logoSrc } = useToggleButton(); // Assuming you still need this for the toggle button

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
              onClick={openModal} // Use openModal from the hook
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
              type="button"
            >
              Create Organization
            </button>
          </div>
        </div>
      </div>

      {/* Organization Modal */}
      <OrganizationModal
        isOpen={isOpen}
        onClose={closeModal} // Use closeModal from the hook
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