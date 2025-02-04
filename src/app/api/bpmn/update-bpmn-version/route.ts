import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { getBpmnFileVersion, getUserData, saveBpmnVersion } from '@/app/_services/user/user.service';

export async function POST(req: NextRequest) {
  const session = await getUserData()
  const userId = session?.id

  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { bpmnId, xml } = await req.json();

  if (!bpmnId || !xml ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {

    const getPreviousVersion = await getBpmnFileVersion(bpmnId, userId);

    console.log('getPreviousVersion info =', getPreviousVersion);

    if (!getPreviousVersion || !getPreviousVersion.currentVersion || !getPreviousVersion.currentVersion.versionNumber) {
      return NextResponse.json({ error: 'BPMN file not found' }, { status: 404 });
    }

    // TODO : increment the version number
    const newVersionNum = Number(getPreviousVersion?.currentVersion?.versionNumber) + 1;

    const file = await saveBpmnVersion(bpmnId, xml, String(newVersionNum), userId);

    return NextResponse.json(file, { status: 201 });

    // return NextResponse.json(bpmnFile, { status: 201 });
  } catch (error) {
    console.error('Error saving BPMN file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}