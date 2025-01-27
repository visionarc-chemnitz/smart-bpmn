export interface Bpmn {
    id: string;
    fileName: string;
    url?: string;
    createdBy: string;
    isShared: boolean;
    isFavorite: boolean;
    currentVersionId?: string;
    createdAt?: string;
}

export type BPMNFilesByOrg = Map<string, BpmnXML[]>;

export interface BpmnXML {
    id: string;
    fileName: string;
    isShared: boolean;
    isFavorite: boolean;
    projectId: string;
    projectName: string;
    currentVersionId: string;
    xml: string;
    createdAt?: string;
}