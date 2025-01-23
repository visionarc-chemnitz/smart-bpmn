"use client";

import { useOrganizationStore } from "@/store/organization-store";
import { useEffect, useState } from "react";

export const OrgSwitcher = () => {
  const { currentOrganization } = useOrganizationStore();
  const getInitials = (name: string) => {
    const initials = name.split(" ").map(word => word[0]).join("");
    return initials.toUpperCase();
  };
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded text-white">
            ?
          </div>
          <span className="truncate font-semibold text-gray-800 dark:text-white">
            No Organization
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded text-white">
          {getInitials(currentOrganization.name)}
        </div>
        <span className="truncate font-semibold text-gray-800 dark:text-white">
          {currentOrganization.name}
        </span>
      </div>
    </div>
  );
};
