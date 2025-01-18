import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
  const { fileName, projectId, createdBy, isFavorite, isShared } = await req.json();

  if (!fileName || !createdBy) {
    console.error('Missing required fields:', { fileName, createdBy });
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Check if the projectId exists
    if (projectId) {
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) {
        console.error('Project ID does not exist:', projectId);
        return NextResponse.json({ error: 'Project ID does not exist' }, { status: 400 });
      }
    }

    // Create the BPMN file
    const bpmnFile = await prisma.bpmn.create({
      data: {
        fileName,
        projectId,
        createdBy,
        isFavorite,
        isShared,
      },
    });

    console.log('BPMN file created:', bpmnFile);
    return NextResponse.json(bpmnFile, { status: 201 });
  } catch (error) {
    console.error('Error saving BPMN file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}