import { create } from 'zustand';
import { Project } from '@/types/project/project';
import { Bpmn } from '@/types/bpmn/bpmn';

interface WorkspaceState {
  currentProject: Project | null;
  currentBpmn: Bpmn | null;
  projectList: Project[];
  selectionChanged: boolean;
  setCurrentProject: (project: Project | null) => void;
  setCurrentBpmn: (bpmn: Bpmn | null) => void;
  setProjectList: (projects: Project[]) => void;
  setSelectionChanged: (changed: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentProject: null,
  currentBpmn: null,
  projectList: [],
  selectionChanged: false,
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentBpmn: (bpmn) => set({ currentBpmn: bpmn }),
  setProjectList: (projects) => set({ projectList: projects }),
  setSelectionChanged: (changed) => set({ selectionChanged: changed }),
}));