import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
  const { bpmnId, xml } = await req.json();

  if (!bpmnId || !xml ) {
    return NextResponse.json({ error: 'BPMN id and XML is required' }, { status: 400 });
  }

  try {
    const bpmnVersion = await prisma.bpmnVersion.create({
      data: {
        xml,
        bpmnId
      },
    });
    if (bpmnVersion) {
      await prisma.bpmn.update({
        where: {
          id: bpmnId
        },
        data: {
          currentVersionId: bpmnVersion.id
        }
      })
    }

    return NextResponse.json(bpmnVersion, { status: 201 });
  } catch (error) {
    console.error('Error creating bpmn version:', error);
    return NextResponse.json({ error: 'Error creating bpmn version' }, { status: 500 });
  }
}
