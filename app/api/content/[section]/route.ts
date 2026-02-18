import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSectionContent, saveSectionContent } from '@/lib/db';
import { auth } from '@/auth';

// GET - Public endpoint to fetch section content
export async function GET(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  try {
    const { section } = await params;
    const content = await getSectionContent(section);

    if (content === null) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Protected endpoint to update section content
export async function POST(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  try {
    // Check authentication via next-auth
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section } = await params;
    const data = await request.json();

    // Save section content
    await saveSectionContent(section, data);

    // Revalidate the home page to reflect changes immediately
    revalidatePath('/');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
