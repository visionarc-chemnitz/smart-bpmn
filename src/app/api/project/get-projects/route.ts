import { NextRequest, NextResponse } from 'next/server';
import { getOrgProjects } from '@/app/dashboard/_actions/dashboard';  // adjust the import path as needed
export const dynamic = 'force-dynamic'; 
export async function GET(req: NextRequest) {
  try {
    const projects = await getOrgProjects();
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
