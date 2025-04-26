// Middleware for route protection without Clerk dependency
// This is a temporary solution until Clerk is properly integrated
import { NextResponse } from 'next/server';

export default function middleware(request) {
  // Middleware function that allows all routes to be accessed
  // Will be replaced with Clerk's authMiddleware once properly installed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};