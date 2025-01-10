import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { email, bpmnId } = await req.json();

  if (!bpmnId || !email) {
    return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT error'});
  }

  // Check if the invitation exists in the database
  const invitation = await prisma.invitation.findFirst({ where: { email: email, bpmnId: bpmnId, status: InvitationStatus.PENDING } });

  if (!invitation) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }

  if (invitation.status !== InvitationStatus.ACCEPTED) {
    return NextResponse.json({ error: 'Invitation has already been accepted' }, { status: 400 });
  }

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

  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?invitationToken=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net", 
    port: 587, 
    secure: false, 
    auth: {
      user: "apikey", 
      pass: process.env.SENDGRID_API_KEY, 
    },
  });

  try {
    // Store invitation in the database
    await prisma.invitation.update({
        data: {
            token: token, 
            expiresAt: expiresAt,
        },
        where: { id: invitation.id }
      });
  
    await transporter.sendMail({
        from: `"VisionArc" <${process.env.RESEND_FROM}>`,
        to: email, 
        subject: "You're Invited!", 
        html: `
        <p>You've been invited to join the platform. Click the link below to sign in:</p>
        <a href="${inviteLink}">${inviteLink}</a>
      `,
    });
    return NextResponse.json({ message: 'Invitation email sent successfully' });
    } catch (error) {
    return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}