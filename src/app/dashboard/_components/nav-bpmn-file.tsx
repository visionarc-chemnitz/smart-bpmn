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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FileText, ChevronRight, Loader } from "lucide-react";
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { useUser } from "@/providers/user-provider";
import { UserRole } from "@/types/user/user";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Bpmn } from "@/types/bpmn/bpmn";
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface NavBpmnFileProps {
    projectId: string;
}

export function NavBpmnFile({ projectId }: NavBpmnFileProps) {
    const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
    const user = useUser();
    const bpmnFileListLabel = user.role === UserRole.STAKEHOLDER ? 'Shared with you' : 'History';
    const { currentProject, currentBpmn, setCurrentBpmn, selectionChanged } = useWorkspaceStore();
    const router = useRouter(); 

    const fetchBpmnFiles = useCallback(async () => {
      try {
        const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${currentProject?.id}`);
        const data = await response.json();
        setBpmnFiles(data.bpmnFiles || []);
      } catch (error) {
        toast.error("Error fetching BPMN files");
      }
    }, [currentProject?.id]);

    useEffect(() => {
      fetchBpmnFiles();
    }, [fetchBpmnFiles, selectionChanged]);


    return (
        <SidebarGroup>
            <SidebarGroupLabel>{bpmnFileListLabel}</SidebarGroupLabel>
            <SidebarMenu>
                {bpmnFiles.length === 0 ? (
                    <SidebarMenuItem className="flex items-center p-2 rounded-md">
                        <FileText className="text-gray-500 mr-2" />
                        <span className="text-gray-500">No files available</span>
                    </SidebarMenuItem>
                ) : (
                    <Collapsible defaultOpen className="group/collapsible">
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
                                    {bpmnFiles.map((file) => (
                                        <SidebarMenuSubItem
                                            key={file.id}
                                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${
                                                currentBpmn?.id === file.id && window.location.pathname === `/dashboard/chat/${file.id}` ? "bg-blue-100 dark:bg-blue-800" : ""
                                            }`}
                                            // TODO : update the route here tonavigate the user to the file selected.
                                            onClick={() => {
                                              setCurrentBpmn(file)
                                              // router.prefetch(`/dashboard/chat/${file.id}`)
                                              router.push(`/dashboard/chat/${file.id}`)
                                            }}
                                        >
                                            <SidebarMenuSubButton asChild>
                                                <a
                                                    href={file.url}
                                                    className="flex-1 text-blue-500 hover:no-underline cursor-pointer"
                                                    aria-current={currentBpmn?.id === file.id && window.location.pathname === `/dashboard/chat/${file.id}` ? "true" : "false"}
                                                    
                                                >
                                                    {file.fileName}
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}