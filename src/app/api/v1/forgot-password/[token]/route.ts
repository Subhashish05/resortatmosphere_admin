import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest, context: any): Promise<NextResponse> {
	if (!JWT_SECRET) {
		return NextResponse.json({ message: 'Server misconfigured: JWT_SECRET missing' }, { status: 500 });
	}
	const { token } = await context.params;

	try {
		// Verify token
		let decoded: any;
		try {
			decoded = jwt.verify(token, JWT_SECRET);

		} catch (err) {
			return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
		}
		return NextResponse.json(
			{ success: true, email: decoded.email },
			{ status: 200 }
		);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
