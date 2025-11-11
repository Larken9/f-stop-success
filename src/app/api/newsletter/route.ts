import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/app/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Subscribe to Shopify
    const customer = await subscribeToNewsletter(email);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        customer: {
          id: customer.id,
          email: customer.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate email error
    if (error.message?.includes('taken') || error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
