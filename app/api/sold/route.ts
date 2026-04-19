import { NextResponse } from 'next/server';

export async function GET() {
  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) return NextResponse.json({ soldIds: [] });

  try {
    const response = await fetch(scriptUrl, { method: 'GET', cache: 'no-store', redirect: 'follow' });
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('text/html')) {
       const html = await response.text();
       console.error('--- GOOGLE RETURNED HTML INSTEAD OF JSON ---');
       console.error('This usually means your script is not deployed for "Anyone" or the URL is wrong.');
       return NextResponse.json({ soldIds: [], error: 'HTML_RESPONSE_DETECTED' });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ soldIds: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scriptUrl = process.env.APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ status: 'error', message: 'APPS_SCRIPT_URL missing' }, { status: 500 });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    const result = await response.json();
    if (result.status === 'error') throw new Error(result.message);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
