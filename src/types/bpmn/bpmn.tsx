export interface Bpmn {
    id: string;
    fileName: string;
    url?: string;
    createdBy: string;
    isShared: boolean;
    isFavorite: boolean;
    currentVersionId?: string;
    createdAt: string;
}