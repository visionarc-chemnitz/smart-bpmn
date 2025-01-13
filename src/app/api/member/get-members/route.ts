import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const members = await prisma.user.findMany({
            where: {
              organizationId: organizationId,
            },
          });

        return NextResponse.json({ members }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
