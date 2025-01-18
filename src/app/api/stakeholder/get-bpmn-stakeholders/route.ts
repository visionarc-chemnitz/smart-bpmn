import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bpmnId = searchParams.get('bpmnId');
    console.log(bpmnId);

    if (!bpmnId) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
      const users = await prisma.user.findMany({
          where: {
            StakeholderBpmn: {
              some: {
                bpmnId: bpmnId,
              },
            },
          },
          include: {
            StakeholderBpmn: true,
          },
        });

      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
