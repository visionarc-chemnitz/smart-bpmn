"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BPMNFilesByOrg, BpmnXML } from "@/types/bpmn/bpmn";
import Link from "next/link";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { getBpmnFilesbyOrg } from "../../_actions/dashboard";
import { Button } from "@/components/ui/button";
import { useOrganizationStore } from "@/store/organization-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function StakeHolderTable() {
  const [bpmnFiles, setBpmnFiles] = useState<BPMNFilesByOrg>(
    new Map<string, BpmnXML[]>()
  );
  const { currentOrganization } = useOrganizationStore();
  const { setCurrentBpmnXml } = useWorkspaceStore();
  const [isPending, startTransition] = useTransition();
  const [currentFiles, setCurrentFiles] = useState<BpmnXML[]>([]);

  const fetchFiles = useCallback(async () => {
    try {
      startTransition(async () => {
        const files = await getBpmnFilesbyOrg();
        console.log("BPMN files in table:", files);
        setBpmnFiles(files);
        // Update currentFiles if org exists
        if (currentOrganization?.id && files.has(currentOrganization.id)) {
          setCurrentFiles(files.get(currentOrganization.id) ?? []);
        }
      });
    } catch (error) {
      console.error("Error fetching BPMN files:", error);
    }
  }, [currentOrganization?.id]);

  // Update currentFiles when organization changes
  useEffect(() => {
    if (currentOrganization?.id && bpmnFiles.has(currentOrganization.id)) {
      setCurrentFiles(bpmnFiles.get(currentOrganization.id) ?? []);
    } else {
      setCurrentFiles([]);
    }
  }, [currentOrganization?.id, bpmnFiles]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFiles.map((bpmn) => (
            <TableRow key={bpmn.id}>
              <TableCell>{bpmn.fileName}</TableCell>
              <TableCell>{bpmn.projectName}</TableCell>
              <TableCell>
                {new Date(bpmn.createdAt ?? Date.now()).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/${bpmn.id}`}>
                  <Button
                    variant="default"
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black"
                    onClick={() => setCurrentBpmnXml(bpmn)}
                  >
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
