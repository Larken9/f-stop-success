import { NextRequest, NextResponse } from 'next/server';
import { client, courseQueries } from '@/app/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      );
    }

    const progressQuery = courseQueries.getUserProgress(userId, courseId);
    const progressData = await client.fetch(progressQuery);

    return NextResponse.json(progressData || null);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
