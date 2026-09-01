import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BlockedUser } from '@/models/BlockedUser';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ blocked: false });
  await connectDB();
  const blocked = await BlockedUser.exists({ email: email.toLowerCase() });
  return NextResponse.json({ blocked: !!blocked });
}
