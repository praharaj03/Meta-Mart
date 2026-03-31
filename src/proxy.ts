import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)', '/checkout(.*)', '/orders(.*)']);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
