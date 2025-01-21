import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';

export interface BpmnViewerProps {
  diagramXML?: string;
  containerId: string;
  onError?: (err: Error) => void;
  onImport?: () => void;
  height?: string | number;
  width?: string | number;
}

export interface BpmnViewerHookResult {
  viewer: BpmnViewer | null;
  importXML: (xml: string) => Promise<void>;
  exportXML: () => Promise<string>; 
  exportSVG: () => Promise<{ svg: string }> | undefined;
  addOverlay: (elementId: string, html: string | HTMLElement) => void;
  clearOverlay: () => void;
}

export interface BpmnModelerProps {
  containerId: string;
  propertiesPanelId: string;
  diagramXML?: string;
  onError?: (err: Error) => void;
  onImport?: () => void;
  height?: string | number;
  width?: string | number;
}

export interface BpmnModelerHookResult {
  modeler: BpmnModeler | null;
  importXML: (xml: string) => Promise<void>;
  exportXML: () => Promise<string>;
  exportSVG: () => Promise<string>;
  addOverlay: (elementId: string, html: string | HTMLElement) => void;
  removeOverlay: (elementId: string) => void;
  clearOverlay: () => void;
}

// Types for Upload Section
export interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  selectedFile: File | null;
  isLoading: boolean;
}

export interface BpmnModelerRef {
  exportXML: () => Promise<string>;
  addOverlay: (elementId: string, html: string | HTMLElement) => void;
  removeOverlay: (elementId: string) => void;
  clearOverlay: () => void;
}

export interface BpmnViewerRef {
  importXML: (xml: string) => Promise<{ warnings: Array<any> }> | undefined;
  exportXML: () => Promise<string>; 
  exportSVG: () => Promise<{ svg: string }> | undefined;
  addOverlay: (elementId: string, html: string | HTMLElement) => void;
  clearOverlay: () => void;
}