export interface Project {
  id: string;
  name: string;
}

export interface Bpmn {
  id: string;
  fileName: string;
  projectId?: string;
  versions?: BpmnVersion[];
}

export interface BpmnVersion {
    id: string;
    xml: string;
    bpmnId?: string;
    updatedBy?: string;
    versionNumber: string;
  }

  export interface BpmnFileWithProjectAndVersion {
    id: string;
    fileName: string;
    BpmnVersion: {
      id: string;
      versionNumber: string;
      xml: string;
    }[];
    project: {
      id: string;
      name: string;
    };
  }