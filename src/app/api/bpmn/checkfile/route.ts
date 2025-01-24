import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { checkFile, getUserData, saveBpmnVersion } from '@/app/_services/user/user.service';

export async function POST(req: NextRequest) {
  const session = await getUserData()
  const userId = session?.id

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { fileId } = await req.json();


  if (!fileId ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const file = await checkFile(fileId, userId);

    return NextResponse.json(file, { status: 200 });

  } catch (error) {
    console.error('Error fetching BPMN file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}