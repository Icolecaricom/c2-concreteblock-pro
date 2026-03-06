import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple admin authentication
// In production, use proper authentication like NextAuth.js

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change in production!

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Generate a simple session token
      const token = crypto.randomBytes(32).toString('hex');

      return NextResponse.json({
        success: true,
        token,
        message: 'Authentication successful'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid password'
    }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Check if admin is authenticated
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Simple validation - in production, use proper session management
  if (token && token.length === 64) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
