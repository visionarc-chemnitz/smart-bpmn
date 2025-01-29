"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { FileText, ChevronRight, Loader } from "lucide-react";
import { API_PATHS } from "@/app/api/api-path/apiPath";
import { useUser } from "@/providers/user-provider";
import { UserRole } from "@/types/user/user";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Bpmn } from "@/types/bpmn/bpmn";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NavBpmnFile() {
  const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
  const user = useUser();
  const bpmnFileListLabel =
    user.role === UserRole.STAKEHOLDER ? "Shared with you" : "History";
  const { currentProject, currentBpmn, setCurrentBpmn, selectionChanged } =
    useWorkspaceStore();
  const [loading, setLoading] = useState<boolean>(true);
  const isDiffChecker = usePathname().includes("diff-checker");

  const fetchBpmnFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_PATHS.GET_BPMN_FILES}?projectId=${currentProject?.id}`
      );
      const data = await response.json();
      setBpmnFiles(data.bpmnFiles || []);
    } catch (error) {
      toast.error("Error fetching BPMN files");
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  useEffect(() => {
    fetchBpmnFiles();
  }, [fetchBpmnFiles, selectionChanged]);

  if (loading) {
    // skeleton loader for the bpmn files
    return (
      <SidebarGroup>
        <SidebarGroupLabel>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center p-2 rounded-md">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Add early return if on diff-checker page
  if (isDiffChecker) {
    return null;
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{bpmnFileListLabel}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <FileText className="mr-2" />
                <span className="flex-1">BPMN Files</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <ScrollArea className="h-[140px]">
                  {bpmnFiles.length === 0 ? (
                  <SidebarMenuItem className="flex items-center p-2 rounded-md">
                    <FileText className="mr-2" />
                    <span className="text-gray-500 text-sm">
                    No files available
                    </span>
                  </SidebarMenuItem>
                  ) : (
                  bpmnFiles.map((file: Bpmn) => (
                    <SidebarMenuSubItem
                    key={file.id}
                    className={`hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${
                      currentBpmn?.id === file.id &&
                      window.location.pathname ===
                      `/dashboard/chat/${file.id}`
                      ? "bg-blue-100 dark:bg-blue-800"
                      : ""
                    }`}
                    onClick={() => {
                      setCurrentBpmn(file);
                    }}
                    >
                    <SidebarMenuSubButton asChild>
                      <Link
                      href={`/dashboard/chat/${file.id}`}
                      className="flex-1 text-blue-500 hover:no-underline cursor-pointer"
                      aria-current={
                        currentBpmn?.id === file.id &&
                        window.location.pathname ===
                        `/dashboard/chat/${file.id}`
                        ? "true"
                        : "false"
                      }
                      >
                      {file.fileName}
                      </Link>
                    </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))
                  )}
                </ScrollArea>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
