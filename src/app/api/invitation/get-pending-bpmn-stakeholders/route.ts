import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { InvitationStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bpmnId = searchParams.get('bpmnId');

    if (!bpmnId) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const invitations = await prisma.invitation.findMany({
            where: {
                bpmnId: bpmnId,
                status: InvitationStatus.PENDING
            }
        });
        return NextResponse.json({ invitations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
