import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { CLERK_ENABLED } from '@/config/clerk';

const isPublicRoute = createRouteMatcher(['/', '/shop(.*)', '/faq(.*)', '/contact(.*)', '/login(.*)', '/register(.*)']);

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export default CLERK_ENABLED ? clerkProxy : () => NextResponse.next();

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
