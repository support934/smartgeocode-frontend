import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }

  // Normalize email to lowercase and trim
  email = email.toLowerCase().trim();

  const backendUrl = process.env.BACKEND_URL || 'https://smartgeocode-backend.up.railway.app';

  try {
    const res = await fetch(`${backendUrl}/api/me?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Me proxy error:', err);
    return NextResponse.json({ message: 'Failed to fetch user data' }, { status: 500 });
  }
}