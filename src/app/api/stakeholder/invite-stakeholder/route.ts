import { NextRequest, NextResponse } from 'next/server';
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { InvitationStatus, Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { email, bpmnId } = await req.json();

  if (!bpmnId || !email) {
    return NextResponse.json({ error: 'Email and BPMN id is required' }, { status: 400 });
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

  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net", 
    port: 587, 
    secure: false, 
    auth: {
      user: "apikey", 
      pass: process.env.SENDGRID_API_KEY, 
    },
  });

  // Check if existing stakeholder
  const user = await prisma.user.findUnique({
    where: { email, role: Role.STAKEHOLDER},
  });

  const authLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`;

  if (user) {
    await transporter.sendMail({
      from: `"VisionArc" <${process.env.RESEND_FROM}>`,
      to: email, 
      subject: "New BPMN file shared with you", 
      html: `
      <p>You've been shared a new BPMN file. Please login to view</p>
      <a href="${authLink}">${authLink}</a>
    `,
    });
    return NextResponse.json({ message: 'File shared successfully' }, { status: 200 });
  }
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?invitationToken=${token}`;



  try {
     // Store invitation in the database
     const invitation = await prisma.invitation.create({
        data: {
            email: email,
            token: token, 
            bpmnId: bpmnId,
            expiresAt: expiresAt,
            status: InvitationStatus.PENDING,
        },
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
    return NextResponse.json({ message: 'Invitation email sent successfully' }, { status: 200 });
    } catch (error) {
    return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
  }
}