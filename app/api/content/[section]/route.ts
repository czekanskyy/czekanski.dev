import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Public endpoint to fetch content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const content = await getContent();
    
    if (!content || !(section in content)) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content[section]);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Protected endpoint to update content
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { section } = await params;
    const data = await request.json();
    
    // Get current content
    const content = await getContent();
    
    // Update section
    content[section] = data;
    
    // Save updated content
    await saveContent(content);
    
    return NextResponse.json({ success: true, data: content[section] });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
