import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Bpmn } from '@/types/bpmn/bpmn'
import { get } from 'http'
import Link from 'next/link'
import React from 'react'
import { getBpmnFiles } from '../../_actions/dashboard'

interface StakeHolderTableProps {
  projId: string
}

export default async function StakeHolderTable({projId}:StakeHolderTableProps) {

  const bpmnFiles: Bpmn =  await getBpmnFiles(projId)

  return (
    <>
        {/* <Table className='mt-4'>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bpmnFiles.map((bpmn) => (
                <TableRow key={bpmn.id}>
                    <TableCell>{bpmn.fileName}</TableCell>
                    <TableCell>
                    <Link href={`/dashboard/stakeholder-bpmn/${bpmn.currentVersionId}`}>
                    <RainbowButton
                      type="button"
                      className="ml-5 mr-2 py-0 text-sm h-8 px-3"
                      onClick={() => setCurrentBpmn(bpmn)}
                    >
                      View
                    </RainbowButton>
                  </Link>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table> */}
    </>
  )
}