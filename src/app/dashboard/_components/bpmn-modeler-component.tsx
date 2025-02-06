import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useBpmnModeler } from '@/hooks/use-bpmn-modeler';
import { BpmnModelerProps } from '@/types/board/board-types';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import '@/app/style.css';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

const BpmnModelerComponent = forwardRef((props: BpmnModelerProps, ref) => {
  const { containerId, propertiesPanelId, diagramXML, onError, onImport, onChange, height, width } = props;
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const { modeler, importXML, exportXML, exportSVG, addOverlay, removeOverlay, clearOverlay } = useBpmnModeler({
    containerId,
    propertiesPanelId,
    diagramXML,
    onError,
    onImport,
    onChange,
    height,
    width,
  });

  useEffect(() => {
    if (diagramXML && modeler) {
      importXML(diagramXML);
    }
  }, [diagramXML, modeler]);

  useImperativeHandle(ref, () => ({
    exportXML,
    addOverlay,
    removeOverlay,
    clearOverlay
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xml = e.target?.result as string;
        await importXML(xml);
      };
      reader.readAsText(file);
    }
  };

  const handleExportXML = async () => {
    const xml = await exportXML();
    if (xml) {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.bpmn';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportSVG = async () => {
    const svg = await exportSVG();
    if (svg) {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Main BPMN container */}
      <div className="relative flex-1 min-w-0">
        <div 
          id={containerId} 
          className="w-full h-full"
          style={{ height: height || '100%', width: width || '100%'}}
        />
        {/* Sticky buttons container */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".bpmn,.xml"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Import BPMN
          </button>
          <button
            onClick={handleExportXML}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Export BPMN
          </button>
          <button
            onClick={handleExportSVG}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Export SVG
          </button>
        </div>
      </div>

      {/* Properties panel container with slide animation */}
      <div className="relative bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-lg">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute -left-8 sm:-left-9 top-0 p-1.5 sm:p-2 bg-white dark:bg-gray-800 
          text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
          rounded-l-lg shadow-md transition-colors duration-200 border border-gray-200 
          dark:border-gray-700"
        >
          {isPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20}  />}
        </button>
        <div 
          id={propertiesPanelId} 
          className={`transition-all duration-300 ease-in-out overflow-hidden
          ${isPanelOpen ? 'w-[280px] sm:w-[350px]' : 'w-0'}`}
          style={{
            boxShadow: isPanelOpen ? 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' : 'none'
          }}
        />
      </div>
    </div>
  );
});

BpmnModelerComponent.displayName = 'BpmnModelerComponent';

export default BpmnModelerComponent;