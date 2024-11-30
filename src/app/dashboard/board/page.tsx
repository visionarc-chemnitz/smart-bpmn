"use client";

import BreadcrumbsHeader from '../(components)/breadcrumbs-header'
import BpmnModelerComponent from './(components)/bpmn-modeler-component';

export default function BoardPage() {

  const handleError = (error: Error) => {
    console.error('BPMN Error:', error);
  };

  const handleImport = () => {
    console.log('BPMN diagram imported successfully');
  };
  
  return (
    <>
      <BreadcrumbsHeader/>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <BpmnModelerComponent
            containerId="bpmn-modeler"
            propertiesPanelId="properties-panel"
            onError={handleError}
            onImport={handleImport}
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </>
  )
}