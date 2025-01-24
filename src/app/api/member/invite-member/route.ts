import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';
import emailService from '@/app/_services/email/email-service';

export async function POST(req: NextRequest) {
  const { email, organizationId } = await req.json();

  if (!organizationId || !email) {
    return NextResponse.json({ error: 'Email and organization id is required' }, { status: 400 });
  }

  // Generate an invitation token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token = jwt.sign(
    {
      email,
      role: Role.MEMBER,
      organizationId: organizationId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
    },
    jwtSecret
  );
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Check if existing stakeholder
  const user = await prisma.user.findUnique({
    where: { email, role: Role.MEMBER},
  });

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (user || !organization) {
    return NextResponse.json({ error: 'Cannot invite user.' }, { status: 500 });
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?invitationToken=${token}`;
  try {
    await prisma.invitation.create({
        data: {
            email: email,
            token: token, 
            organizationId: organizationId,
            expiresAt: expiresAt,
            status: InvitationStatus.PENDING,
        },
      });
  
    await emailService.sendEmail({
        to: email,
        subject: "Welcome to VisionArc!",
        emailHeaderContent: "You've been invited",
        emailContent: `You've been invited to join the ${organization.name} platform. Click the button below to get started.`,
        buttonText: "ACCEPT INVITE",
        buttonLink: inviteLink,
      });
    return NextResponse.json({ message: 'Invitation email sent successfully' }, { status: 200 });
    } catch (error) {
      console.log(error);
    return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}