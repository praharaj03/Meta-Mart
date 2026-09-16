import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Complaint } from '@/models/Complaint';

export async function POST(req: NextRequest) {
  try {
    const { name, email, userId, subject, message } = await req.json();
    if (![name, email, subject, message].every(value => typeof value === 'string' && value.trim())) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    await connectDB();
    const complaint = await Complaint.create({ name, email, userId: userId || 'guest', subject, message });
    return NextResponse.json({ id: complaint._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to save your message. Please try again.' }, { status: 500 });
  }
}
