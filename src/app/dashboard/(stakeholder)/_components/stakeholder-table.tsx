"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bpmn } from "@/types/bpmn/bpmn";
import Link from "next/link";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { getBpmnFiles } from "../../_actions/dashboard";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Button } from "@/components/ui/button";

interface StakeHolderTableProps {
  projId: string;
}

export default function StakeHolderTable({ projId }: StakeHolderTableProps) {
  const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
  const { setCurrentBpmn, selectionChanged } = useWorkspaceStore();
  const [isPending, startTransition] = useTransition();

  const fetchFiles = useCallback(async () => {
    try {
      if (!projId) {
        return;
      }

      startTransition(async () => {
        const files = await getBpmnFiles(projId);
        console.log("BPMN files:", files);
        setBpmnFiles(files);
      });
    } catch (error) {
      console.error("Error fetching BPMN files:", error);
    }
  }, [projId, selectionChanged]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  if (isPending) {
    return (
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i} className="hover:bg-gray-50">
              <TableCell>
                <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 rounded-md" />
              </TableCell>
              <TableCell className="w-24">
                <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-9 w-16 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bpmnFiles.map((bpmn) => (
            <TableRow key={bpmn.id}>
              <TableCell>{bpmn.fileName}</TableCell>
              <TableCell>Project 1</TableCell>
              <TableCell>
                <Link href={`/dashboard/${bpmn.currentVersionId}`}>
                  <Button
                    variant="default"
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black"
                    onClick={() => setCurrentBpmn(bpmn)}
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
