import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that do not require authentication
const PUBLIC_PATHS = ['/login', '/forgot-password', '/verify'];

export function proxy(req: NextRequest) {
    const token = req.cookies.get('atmosphere_auth_token');
    const { pathname } = req.nextUrl;

    // Check if the current path is a public path
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

    // 1. Redirect to login if unauthorized and trying to access private route
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2. Redirect to home if authorized but trying to access login/auth pages
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    // Optimized matcher to exclude internal Next.js paths and static files
    matcher: [
        '/((?!api|_next/static|_next/image|img|favicon.ico|public/).*)',
    ],
};