import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/register','/api/auth/login','/api/auth/register']; // Public routes that don't require authentication
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // JWT secret for validation

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without token validation
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for the token in cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login page if no token is found
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token using jose
    await jwtVerify(token, JWT_SECRET);

    // If valid, allow the request to proceed
    return NextResponse.next();
  } catch (err) {
    console.error('Invalid token:', err);

    // Redirect to login page if token verification fails
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Specify which routes the middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Apply to all routes except static assets
  ],
};
