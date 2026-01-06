import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const email = formData.get('email') as string | null;

    if (!file || !email) {
      return NextResponse.json({ status: 'error', message: 'Missing file or email' }, { status: 400 });
    }

    // Optional: Client-side preview filter for skipping # and blank lines
    const previewLines: string[] = [];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          previewLines.push(trimmed);
        }
      });
      console.log('Preview filtered lines (skip #/blank):', previewLines.length);
    };
    reader.readAsText(file);

    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('email', email);

    const backendUrl = process.env.BACKEND_URL || 'https://smartgeocode.io';

    const res = await fetch(`${backendUrl}/api/batch-geocode`, {
      method: 'POST',
      body: backendFormData,
    });

    const data = await res.json();
    console.log('Backend response:', data);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Batch upload proxy error:', error);
    return NextResponse.json({ status: 'error', message: 'Upload failed—check connection' }, { status: 500 });
  }
}