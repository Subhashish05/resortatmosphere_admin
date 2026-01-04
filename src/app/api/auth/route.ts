import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
	const token = req.cookies.get('atmosphere_auth_token')?.value;
	
	if (!token) {
		return NextResponse.json({ user: null }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		return NextResponse.json({ success: true, user: decoded }, { status: 200 });
	} catch (error: any) {
		if (error.name === 'TokenExpiredError') {
			return NextResponse.json({ user: null, message: 'Token expired' }, { status: 401 });
		}
		console.error('JWT verification failed:', error);
		return NextResponse.json({ user: null, message: 'Invalid token' }, { status: 500 });
	}
}
