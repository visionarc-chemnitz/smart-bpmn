import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';
import emailService from '@/app/services/email/email-service';

export async function POST(req: NextRequest) {
  const { email, bpmnId } = await req.json();

  if (!bpmnId || !email) {
    return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
  }

  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Check if existing stakeholder
  const user = await prisma.user.findUnique({
    where: { email, role: Role.STAKEHOLDER},
  });

  if (user) {
    await prisma.stakeholderBpmn.create({
      data: {
        bpmnId: bpmnId,
        userId: user.id,
      },
    });

    await emailService.sendEmail({
      to: email,
      subject: "New BPMN file shared with you",
      emailHeaderContent: "BPMN file shared with you",
      emailContent: "You've been shared a new BPMN file. Please login to view",
      buttonText: "LOGIN NOW",
      buttonLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
    });
    return NextResponse.json({ message: 'File shared successfully' }, { status: 200 });
  }

  // Generate an invitation token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token = jwt.sign(
    {
      email,
      role: Role.STAKEHOLDER,
      bpmnId: bpmnId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
    },
    jwtSecret
  );
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?invitationToken=${token}`;

  try {
     // Store invitation in the database
     await prisma.invitation.create({
        data: {
            email: email,
            token: token, 
            bpmnId: bpmnId,
            expiresAt: expiresAt,
            status: InvitationStatus.PENDING,
        },
      });

    await emailService.sendEmail({
      to: email,
      subject: "You're Invited!",
      emailHeaderContent: "You're Invited",
      emailContent: `You've been invited to join our smart BPMN platform. Click the button below to get started.`,
      buttonText: "ACCEPT INVITE",
      buttonLink: inviteLink,
    });
  
    return NextResponse.json({ message: 'Invitation email sent successfully'  }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}