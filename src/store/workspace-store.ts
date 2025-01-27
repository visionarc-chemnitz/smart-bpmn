import { create } from 'zustand';
import { Project } from '@/types/project/project';
import { Bpmn, BpmnXML } from '@/types/bpmn/bpmn';

interface WorkspaceState {
  currentProject: Project | null;
  currentBpmn: Bpmn | null;
  currentBpmnXML: BpmnXML | null;
  projectList: Project[];
  selectionChanged: boolean;
  setCurrentProject: (project: Project | null) => void;
  setCurrentBpmn: (bpmn: Bpmn | null) => void;
  setCurrentBpmnXml: (bpmn: BpmnXML | null) => void;
  setProjectList: (projects: Project[]) => void;
  setSelectionChanged: (changed: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentProject: null,
  currentBpmn: null,
  currentBpmnXML: null,
  projectList: [],
  selectionChanged: false,
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentBpmn: (bpmn) => set({ currentBpmn: bpmn }),
  setCurrentBpmnXml: (bpmn) => set({ currentBpmnXML: bpmn }),
  setProjectList: (projects) => set({ projectList: projects }),
  setSelectionChanged: (changed) => set({ selectionChanged: changed }),
}));