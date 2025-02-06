import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useBpmnViewer } from '@/hooks/use-bpmn-viewer';
import { BpmnViewerProps } from '@/types/board/board-types';
import { useBpmnComment } from '@/hooks/use-bpmn-comment';
import '@/app/style.css';
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { useWorkspaceStore } from '@/store/workspace-store';
import { toast } from "sonner"


const BpmnCommentComponent = forwardRef((props: BpmnViewerProps, ref) => {
  const { containerId, diagramXML, onError, onImport, height, width } = props;
  const { viewer, importXML, exportXML, addOverlay, clearOverlay } = useBpmnComment({
    containerId,
    diagramXML,
    onError,
    onImport,
    height,
    width,
  });
  
  BpmnCommentComponent.displayName = 'BpmnCommentComponent';
  const { currentBpmnXML } = useWorkspaceStore();
  // console.log(currentBpmnXML)

  useEffect(() => {
    if (diagramXML) {
      importXML(diagramXML);
    }
  }, [diagramXML, importXML]);

  useImperativeHandle(ref, () => ({
    exportXML,
    addOverlay,
    clearOverlay
  }));

  const handleSaveComments = async () => {
    const xml = await exportXML();
    const requestBody = {
      bpmnId: currentBpmnXML?.id,
      xml: xml,
    };
    if (xml) {
       const response = await fetch(API_PATHS.UPDATE_BPMN_VERSION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error Response:', errorData);
          toast.error('Error in saving comments.');
      }

      const data = await response.json();
      toast.success('All comments have been saved successfully.');
    }
  };

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

  return (
    <div className="relative w-full h-full">
      <div 
        id={containerId} 
        style={{ height, width }}
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".bpmn,.xml"
          className="hidden"
        />
        <button
            onClick={handleSaveComments}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Save Comments
          </button>
      </div>
    </div>
  );
});


export default BpmnCommentComponent;