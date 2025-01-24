import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { getUserData, saveBpmnVersion } from '@/app/_services/user/user.service';

export async function POST(req: NextRequest) {
  const session = await getUserData()
  const userId = session?.id

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { bpmnId, xml, versionNumber } = await req.json();


  if (!bpmnId || !xml || !versionNumber) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const file = await saveBpmnVersion(bpmnId, xml, versionNumber, userId);

    return NextResponse.json(file, { status: 201 });
    
  } catch (error) {
    console.error('Error saving BPMN file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}