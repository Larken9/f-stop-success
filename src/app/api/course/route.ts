import { NextResponse } from 'next/server';
import { client, courseQueries } from '@/app/lib/sanity';

export async function GET() {
  try {
    // Fetch the F-Stop to Success course with modules and lessons
    const courseQuery = courseQueries.getFStopCourse();
    const courseData = await client.fetch(courseQuery);

    if (!courseData) {
      return NextResponse.json(
        { error: 'F-Stop to Success course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Error fetching course data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
