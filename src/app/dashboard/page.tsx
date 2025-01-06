'use client';

import { useEffect, useState } from 'react';
import BreadcrumbsHeader from './(components)/breadcrumbs-header';
import NewTeam from './(components)/new-team';
import TeamSpacePage from './(components)/teamSpace';
import { useUser } from "@/providers/user-provider";
import Bpmn from './(components)/bpmn-info';

export default function DashBoardPage() {
  const user = useUser();  // Get user directly here
  const [hasOrganization, setHasOrganization] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user && user.email) {
      const checkUserOrganization = async () => {
        try {
          const response = await fetch(`/api/check-organization?userId=${user.id}`);
          const data = await response.json();

          setHasOrganization(data.hasOrganization);
        } catch (error) {
          console.error("Error checking organization:", error);
        } finally {
          setLoading(false); // Stop loading once the check is done
        }
      };

      checkUserOrganization();
    } else {
      setLoading(false); // Stop loading if user is not defined
    }
  }, [user]); // Re-run when `user` changes

  if (loading) {
    return (
      <div>Loading...</div>  // Loading indicator until the check is completed
    );
  }

  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Playground' parent='/' />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Conditionally render based on the user's organization status */}
        {hasOrganization ? (
          <TeamSpacePage />  // Render TeamSpacePage if user has an organization
        ) : (
          <NewTeam />  // Otherwise, show NewTeam to create a new organization
        )}
      </div>
    </>
  );
}