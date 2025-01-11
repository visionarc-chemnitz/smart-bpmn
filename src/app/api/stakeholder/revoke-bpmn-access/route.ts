import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const bpmnId = searchParams.get('bpmnId');

    if (!bpmnId || !email) {
        return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return NextResponse.json({ error: 'JWT error'});
    }

    // Check if the invitation exists in the database
    const invitation = await prisma.invitation.findFirst({ where: { email: email, bpmnId: bpmnId } });

    if (!invitation) {
        return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    }

    // delete invitation
    await prisma.invitation.delete({ where: { id: invitation.id } });

    // find corresponding user
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (user) {
        console.log(user.id);
        // delete bpmn stakeholder
        const record = await prisma.stakeholderBpmn.findUnique({
            where: { userId_bpmnId: { bpmnId, userId: user.id } },
          });
        console.log("record", record);
        await prisma.stakeholderBpmn.delete({ where: { userId_bpmnId: { userId: user.id, bpmnId: bpmnId, } } });
        
        // delete user if they have no other bpmn access
        const stakeholderBpmns = await prisma.stakeholderBpmn.findMany({ where: { userId: user.id } });
        if (stakeholderBpmns.length === 0) {
            await prisma.user.delete({ where: { id: user.id } });
        }
    } 
    return NextResponse.json({ message: 'Successfully revoked access from user' }, { status: 200 });
}