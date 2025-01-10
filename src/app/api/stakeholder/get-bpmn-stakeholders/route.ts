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
        const stakeholders = await prisma.user.findMany({
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

        if (!stakeholders) {
            return NextResponse.json({ error: 'No stakeholders' }, { status: 404 });
        }

        return NextResponse.json({ stakeholders });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
