import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { auth } from '@/auth';
import { Bpmn, BpmnVersion } from '@prisma/client';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bpmnVersionId = searchParams.get('bpmnVersionId') ?? undefined;
    const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  if (!bpmnVersionId) {
    console.error('BPMN version ID not provided');
    return NextResponse.json({ error: 'BPMN version ID not provided' }, { status: 400 });
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
    console.log('Fetching bpmn version:', bpmnVersionId);
    const bpmnVersion = await prisma.bpmnVersion.findUnique({
      where: {
          id: bpmnVersionId,
      },
    });

    if (!bpmnVersion) {
      return NextResponse.json({ error: 'BPMN version not found' }, { status: 404 });
    }
    return NextResponse.json({ bpmnVersion });
  } catch (error) {
    console.error('Error fetching BPMN version:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
