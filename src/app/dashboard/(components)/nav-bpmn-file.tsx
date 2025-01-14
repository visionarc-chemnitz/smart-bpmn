"use client";

import React, { useEffect, useState } from "react";
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
import { useOrganizationWorkspaceContext } from "@/providers/organization-workspace-provider";
import { Bpmn } from "@/types/bpmn/bpmn";
import { useModalManager } from "@/hooks/useModalManager";

interface NavBpmnFileProps {
    projectId: string;
}

export function NavBpmnFile({ projectId }: NavBpmnFileProps) {
    const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const user = useUser();
    const bpmnFileListLabel = user.role === UserRole.STAKEHOLDER ? 'Shared with you' : 'History';
    const { currentProject, currentBpmn, setCurrentBpmn, selectionChanged } = useOrganizationWorkspaceContext();

    useEffect(() => {
        const fetchBpmnFiles = async () => {
            try {
                const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${currentProject?.id}`);
                const data = await response.json();
                setBpmnFiles(data.bpmnFiles || []);
                setLoading(false);

                // Automatically select the last file (most recently created)
                if (data.bpmnFiles?.length > 0) {
                    setCurrentBpmn(data.bpmnFiles[data.bpmnFiles.length - 1]);
                } else {
                    setCurrentBpmn(null);
                }
            } catch (error) {
                setError("Error fetching BPMN files");
                setLoading(false);
            }
        };
        fetchBpmnFiles();

    }, [currentProject, selectionChanged]);

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
                                                currentBpmn?.id === file.id ? "bg-blue-100 dark:bg-blue-800" : ""
                                            }`}
                                            onClick={() => setCurrentBpmn(file)}
                                        >
                                            <SidebarMenuSubButton asChild>
                                                <a
                                                    href={file.url}
                                                    className="flex-1 text-blue-500 hover:no-underline cursor-pointer"
                                                    aria-current={currentBpmn?.id === file.id ? "true" : "false"}
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