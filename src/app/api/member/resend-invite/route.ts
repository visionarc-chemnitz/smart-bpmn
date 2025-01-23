import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';
import emailService from '@/app/_services/email/email-service';

export async function POST(req: NextRequest) {
  const { email, organizationId } = await req.json();

  if (!organizationId || !email) {
    return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
  }

  // Check if the invitation exists in the database
  const invitation = await prisma.invitation.findFirst({ where: { email: email, organizationId: organizationId, status: InvitationStatus.PENDING } });

  if (!invitation) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }

  if (invitation.status == InvitationStatus.ACCEPTED) {
    return NextResponse.json({ error: 'Invitation has already been accepted' }, { status: 400 });
  }

  const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

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

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?invitationToken=${token}`;

  try {
    // Update invitation in the database
    await prisma.invitation.update({
        data: {
            token: token, 
            expiresAt: expiresAt,
        },
        where: { id: invitation.id }
      });

    await emailService.sendEmail({
        to: email,
        subject: "You're Invited!", 
        emailHeaderContent: "You're Invited",  
        emailContent: `You've been invited to join the ${organization.name} platform. Click the button below to get started.`,
        buttonText: "ACCEPT INVITE",
        buttonLink: inviteLink,
    });
    console.log('Invitation email sent successfully');
  
    return NextResponse.json({ message: 'Invitation email sent successfully', invitation });
    } catch (error) {
    return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}