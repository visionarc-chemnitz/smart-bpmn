import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { auth } from '@/auth';
import { Bpmn } from '@prisma/client';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  if (!projectId || typeof projectId !== 'string') {
    console.error('Invalid project ID:', projectId);
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    console.log('Fetching BPMN files for project ID:', projectId);
    let bpmnFiles: Bpmn[] = [];
    if (user.role === 'ADMIN' || user.role === 'MEMBER') {
      bpmnFiles = await prisma.bpmn.findMany({
        where: {
          projectId: projectId,
        },
      });
    }

    if (user.role === 'STAKEHOLDER') {
      bpmnFiles = await prisma.bpmn.findMany({
        where: {
          projectId: projectId,
          StakeholderBpmn: {
            some: {
              userId: userId,
            },
          },
        },
      });
    }

    // if (bpmnFiles.length === 0) {
    //   console.log('No BPMN files found for project ID:', projectId);
    // } else {
    //   console.log('BPMN files found:', bpmnFiles);
    // }

    return NextResponse.json({ bpmnFiles });
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
