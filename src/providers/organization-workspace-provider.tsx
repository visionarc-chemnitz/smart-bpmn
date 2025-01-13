import { Bpmn } from '@/types/bpmn/bpmn';
import { Organization } from '@/types/organization/organization';
import { Project } from '@/types/project/project';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface OrganizationWorkspaceContextType {
  // currentOrganizationId: string;
  // setCurrentOrganizationId: (id: string) => void;
  // currentProjectId: string;
  // setCurrentProjectId: (id: string) => void;
  // currentBpmnId: string;
  // setCurrentBpmnId: (id: string) => void;

  currentOrganization: Organization | null;
  setCurrentOrganization: (organization: Organization | null) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  currentBpmn: Bpmn | null;
  setCurrentBpmn: (bpmn: Bpmn | null) => void;
  projectList: Project[];
  setProjectList: (projects: Project[]) => void;
}

const OrganizationWorkspaceContext = createContext<OrganizationWorkspaceContextType | null>(null);

interface OrganizationWorkspaceProviderProps {
  children: ReactNode;
}

// Provider component
export const OrganizationWorkspaceProvider = ({ children }: OrganizationWorkspaceProviderProps) => {
  // const [currentOrganizationId, setCurrentOrganizationId] = useState('');
  // const [currentProjectId, setCurrentProjectId] = useState('');
  // const [currentBpmnId, setCurrentBpmnId] = useState('');

  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentBpmn, setCurrentBpmn] = useState<Bpmn | null>(null);
  const [projectList, setProjectList] = useState<Project[] | []>([]);


  const value: OrganizationWorkspaceContextType = {
    // currentOrganizationId,
    // setCurrentOrganizationId,
    // currentProjectId,
    // setCurrentProjectId,
    // currentBpmnId,
    // setCurrentBpmnId,

    currentOrganization,
    setCurrentOrganization,
    currentProject: currentProject,
    setCurrentProject,
    currentBpmn,
    setCurrentBpmn,
    projectList,
    setProjectList,
  };

  return (
    <OrganizationWorkspaceContext.Provider value={value}>
      {children}
    </OrganizationWorkspaceContext.Provider>
  );
};

// Custom hook to use the context
export const useOrganizationWorkspaceContext = (): OrganizationWorkspaceContextType => {
  const context = useContext(OrganizationWorkspaceContext);
  if (!context) {
    throw new Error(
      "useOrganizationWorkspaceContext must be used within an OrganizationWorkspaceProvider"
    );
  }
  return context;
};
