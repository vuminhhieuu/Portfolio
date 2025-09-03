import { NextRequest, NextResponse } from 'next/server';

// Placeholder: integrate EmailJS/SMTP/Resend here later
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    // TODO: send email via provider; for now just echo
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
} 