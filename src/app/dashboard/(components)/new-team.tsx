'use client';

import { useState } from 'react';
import { useModalManager } from "@/hooks/useModalManager";
import { OrganizationModal } from "@/app/dashboard/organization-project-bpmn-modal/(components)/organizationModal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import TeamSpacePage from './teamSpace';

const NewTeam = () => {
  const [showTeamSpace, setShowTeamSpace] = useState(false);

  const {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    handleOrganizationSubmit,
  } = useModalManager();

  if (showTeamSpace) {
    return <TeamSpacePage />;
  }

  return (
    <>
      <div className="flex-1">
        <div className="h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl p-10">
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

          <div className="mt-6 flex flex-col space-y-4">
            <RainbowButton
              onClick={openModal}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
              type="button"
            >
              Create Organization
            </RainbowButton>

            <p className="text-muted-foreground text-sm mt-2">
              Don't want to create an organization? Explore our features!
            </p>

            <button
              onClick={() => setShowTeamSpace(true)}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
              type="button"
            >
              <span className="text-2xl animate-bounce text-white">★</span>
              <span className="ml-2 text-md text-white font-semibold">Explore our feature</span>
            </button>
          </div>
        </div>
      </div>

      <OrganizationModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default NewTeam;