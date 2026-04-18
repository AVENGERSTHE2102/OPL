import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scriptUrl = process.env.APPS_SCRIPT_URL;

    console.log('--- GS APPS SCRIPT ATTEMPT ---');
    console.log('Script URL Load Check:', scriptUrl ? 'Loaded (starts with ' + scriptUrl.substring(0, 30) + '...)' : 'MISSING');

    if (!scriptUrl) {
      return NextResponse.json({ status: 'error', message: 'APPS_SCRIPT_URL is missing in .env.local' }, { status: 500 });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apps Script Response Error:', response.status, errorText);
      throw new Error(`Apps Script responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Apps Script Success:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('FULL API ERROR:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
