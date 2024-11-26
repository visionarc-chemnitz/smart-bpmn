declare module 'bpmn-js/lib/Modeler' {
  interface ModelerOptions {
    container: HTMLElement;
    // Add other options as needed
  }

  interface SaveXMLOptions {
    format?: boolean;
    // Add other options as needed
  }

  class BpmnModeler {
    constructor(options: ModelerOptions);
    importXML(xml: string): Promise<void>;
    saveXML(options?: SaveXMLOptions): Promise<{ xml: string }>;
    destroy(): void;
  }

  export default BpmnModeler;
} 