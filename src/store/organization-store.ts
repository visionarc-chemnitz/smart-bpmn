import { create } from 'zustand';
import { Organization } from '@/types/organization/organization';
import { Project } from '@/types/project/project';

interface OrganizationState {
  currentOrganization: Organization | null;
  orgList: Organization[];
  setCurrentOrganization: (org: Organization | null) => void;
  setOrgList: (orgs: Organization[]) => void;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  currentOrganization: null,
  orgList: [],
  initialized: false,
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setOrgList: (orgs) => set({ orgList: orgs }),
  setInitialized: (value) => set({ initialized: value }),
}));
