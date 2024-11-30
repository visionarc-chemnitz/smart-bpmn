import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';

export interface BpmnViewerProps {
  diagramXML: string;
  containerId: string;
  onError?: (err: Error) => void;
  onImport?: () => void;
  height?: string | number;
  width?: string | number;
}

export interface BpmnViewerHookResult {
  viewer: BpmnViewer | null;
  importXML: (xml: string) => Promise<{ warnings: Array<any> }> | undefined;
  exportSVG: () => Promise<{ svg: string }> | undefined;
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
}