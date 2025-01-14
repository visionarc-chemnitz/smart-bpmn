import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const organizationId = searchParams.get('organizationId');

    try {
        if (!organizationId || !email) {
            return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
        }
    
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return NextResponse.json({ error: 'JWT error'});
        }
    
        // Check if the invitation exists in the database
        const invitation = await prisma.invitation.findFirst({ where: { email: email, organizationId: organizationId } });
    
        if (invitation) {
            await prisma.invitation.delete({ where: { id: invitation.id } });
        }
    
        // find corresponding user
        const user = await prisma.user.findFirst({ where: { email: email  } });
        if (user) {
            await prisma.user.delete({ where: { id: user.id } });
        } 
        return NextResponse.json({ message: 'Successfully revoked access from user' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
   
}