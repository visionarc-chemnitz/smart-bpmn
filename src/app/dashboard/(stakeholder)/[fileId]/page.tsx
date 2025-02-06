"use client";
import React, { use, useEffect, useState } from "react";
import BreadcrumbsHeader from "@/app/dashboard/_components/breadcrumbs-header";
import BpmnCommentComponent from "../../_components/bpmn-comment-component";
import { useWorkspaceStore } from "@/store/workspace-store";

interface BpmnVersionParams {
  params: {
    fileId: string;
  };
}

export default function StakeholderBpmnVersionPage({
  params,
}: BpmnVersionParams) {
  const [loading, setLoading] = useState<boolean>(false);
  const [xml, setXml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { currentBpmnXML } = useWorkspaceStore();

  useEffect(() => {
    if (currentBpmnXML) {
      setXml(currentBpmnXML.xml);
      localStorage.setItem("bpmnXML", currentBpmnXML.xml);
    } else {
      const bpmnXML = localStorage.getItem("bpmnXML");
      if (bpmnXML) {
        setXml(bpmnXML);
      }
    }
  }, [currentBpmnXML]);

  return (
    <>
      <BreadcrumbsHeader
        href="/dashboard"
        current="Stakeholder"
        parent="Playground"
      />
      <div className="m-2 p-2">
        {xml && (
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all duration-300">
            <div className="h-[calc(100vh-24rem)] md:h-[800px]">
              <BpmnCommentComponent
                containerId="bpmn-modeler"
                diagramXML={xml}
                onError={(error: Error) => setError(error.message)}
                height="100%"
                width="100%"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
