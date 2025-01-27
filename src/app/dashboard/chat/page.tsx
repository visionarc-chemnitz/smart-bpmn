"use client";

import { useEffect, useState, useCallback, use } from "react";
import BreadcrumbsHeader from "../_components/breadcrumbs-header";
import BpmnModelerComponent from "../text2bpmn/_components/bpmn-modeler-component";
import { apiWrapper } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Bot,
  Send,
  AlertCircle,
  ClipboardList,
  Search,
  CheckCircle,
  Code2,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/providers/user-provider";
import { nanoid } from "nanoid";
import { BpmnFileInfoModal } from "../_components/modals/bpmnInfoModal";
import { useModalManager } from "@/hooks/useModalManager";
import { Bpmn } from "@/types/bpmn/bpmn";
import { useWorkspaceStore } from "@/store/workspace-store";
import { API_PATHS } from "@/app/api/api-path/apiPath";
import { toast } from "sonner";
import BpmnFilesTable from "./_components/bpmn-files-table";
import { NewFileModal } from "../_components/modals/new-file-modal";

export default function ChatFiles() {
  const { currentProject, selectionChanged } = useWorkspaceStore();
  const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchBpmnFiles = useCallback(async () => {
    try {
      const projectId = currentProject?.id;
      if (!projectId) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_PATHS.GET_BPMN_FILES}?projectId=${projectId}`
      );
      const data = await response.json();
      setBpmnFiles(data.bpmnFiles || []);
      setLoading(false);

    } catch (error) {
      setError("Error fetching BPMN files");
      setLoading(false);
      toast.error("Error fetching BPMN files");
    }
  }, [currentProject?.id]);

  useEffect(() => { 
    fetchBpmnFiles();
  }, [fetchBpmnFiles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <BreadcrumbsHeader href="/dashboard" current="Chat" parent="Playground" />
      <div className="container mx-auto p-6 h-full">
        <div className="mb-6 flex justify-end">
          { currentProject && currentProject.id && <NewFileModal currentprojId={currentProject.id}  /> }
        </div>

        <div className="rounded-md border">
          <BpmnFilesTable files={bpmnFiles}/>
        </div>

      </div>
    </>
  );
}
