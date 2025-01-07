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
          const response = await fetch(`/api/organization/check-organization?userId=${user.id}`);
          const data = await response.json();

          setHasOrganization(data.hasOrganization);
        } catch (error) {
          console.error("Error checking organization:", error);
        } finally {
          setLoading(false);
        }
      };

      checkUserOrganization();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div>Loading...</div> 
    );
  }

  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Playground' parent='/' />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {hasOrganization ? (
          <TeamSpacePage />
        ) : (
          <NewTeam />
        )}
      </div>
    </>
  );
}