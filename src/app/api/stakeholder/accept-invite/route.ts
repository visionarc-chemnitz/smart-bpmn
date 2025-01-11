import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { invitationToken } = await req.json();

  if (!invitationToken)
    return NextResponse.json({ error: 'Token is required'});

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT'});
  }

  // Decode the token
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT_SECRET is not defined' });
  }
  const decoded = jwt.verify(invitationToken, JWT_SECRET);

  const { email, role, bpmnId, exp } = decoded as { email: string, role: string, bpmnId: string, exp: number };

  // Check if the invitation exists in the database
  const invitation = await prisma.invitation.findUnique({ where: { token: invitationToken } });

  if (!invitation) {
    return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
  }

  if (invitation.status === InvitationStatus.ACCEPTED) {
    return NextResponse.json({ error: 'Invitation has already been accepted' }, { status: 400 });
  }

  if (Date.now() > exp * 1000) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Check if the user already exists
  let user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user) {
    // If user exists, ensure they have the correct role
    if (user.role !== role) {
      await prisma.user.update({
        where: { email: email },
        data: { role: role as Role },
      });
    }
  } else {
    // Create the new user
    user = await prisma.user.create({
      data: {
        email: email,
        role: role as Role,
      },
    });
  }
  // Check if the bpmn stakeholder record already exists
  const bpmnStakeholder = await prisma.stakeholderBpmn.findFirst({
    where: {
      bpmnId: invitation.bpmnId,
      userId: user.id,
    },
  })

  if (!bpmnStakeholder && user) {
    // Create the new record
    await prisma.stakeholderBpmn.create({
      data: {
        bpmnId: bpmnId,
        userId: user.id,
      },
    });
  }

  // Accept the invitation
  await prisma.invitation.update({
    data: {
      status: 'ACCEPTED',
    },
    where: { token: invitationToken }
  })

  return NextResponse.json({ success: true, email: email });
}