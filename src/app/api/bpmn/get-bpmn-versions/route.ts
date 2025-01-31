import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { auth } from '@/auth';
import { BpmnVersion } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bpmnId = searchParams.get('bpmnId');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  if (!bpmnId || typeof bpmnId !== 'string') {
    console.error('Invalid BPMN ID:', bpmnId);
    return NextResponse.json({ error: 'Invalid BPMN ID' }, { status: 400 });
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
    console.log('Fetching BPMN versions for BPMN ID:', bpmnId);
    let bpmnVersions: BpmnVersion[] = [];
    if (user.role === 'ADMIN' || user.role === 'MEMBER') {
      bpmnVersions = await prisma.bpmnVersion.findMany({
        where: {
          bpmnId: bpmnId,
        },
      });
    }

    return NextResponse.json({ bpmnVersions });
  } catch (error) {
    console.error('Error fetching BPMN versions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}