// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('atmosphere_auth_token');

	// If no token and not on login/forgot-password/verify → redirect to login
	if (
		!token &&
		!req.nextUrl.pathname.startsWith('/login') &&
		!req.nextUrl.pathname.startsWith('/forgot-password') &&
		!req.nextUrl.pathname.startsWith('/verify/')
	) {
		const loginUrl = new URL('/login', req.url);
		return NextResponse.redirect(loginUrl);
	}

	// If token exists and user is on login/forgot-password/verify → redirect to home
	if (
		token &&
		(req.nextUrl.pathname.startsWith('/login') ||
			req.nextUrl.pathname.startsWith('/forgot-password') ||
			req.nextUrl.pathname.startsWith('/verify/'))
	) {
		const homeUrl = new URL('/', req.url);
		return NextResponse.redirect(homeUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/images|images|favicon.ico|api).*)'],
};
