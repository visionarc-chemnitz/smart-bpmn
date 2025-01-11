import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId || typeof projectId !== 'string') {
    console.error('Invalid project ID:', projectId);
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  try {
    console.log('Fetching BPMN files for project ID:', projectId);
    const bpmnFiles = await prisma.bpmn.findMany({
      where: {
        projectId: projectId,
      },
    });

    if (bpmnFiles.length === 0) {
      console.log('No BPMN files found for project ID:', projectId);
    } else {
      console.log('BPMN files found:', bpmnFiles);
    }

    return NextResponse.json({ bpmnFiles });
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
