import { NextResponse } from 'next/server';

export async function POST() {
	// respond and clear the HttpOnly cookie by setting maxAge: 0
	const res = NextResponse.json({ success: true });
	res.cookies.set('atmosphere_auth_token', '', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 0,
	});
	return res;
}
