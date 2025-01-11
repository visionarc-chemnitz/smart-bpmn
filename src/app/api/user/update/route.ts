import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function PATCH(req: NextRequest) {
  const { user } = await req.json();

  if (!user) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  
  try {
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { name: user.name },
      });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}
