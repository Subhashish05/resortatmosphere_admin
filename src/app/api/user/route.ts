import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mysqldb';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
	id: number;
	name: string;
	email: string;
	password?: string;
	phone?: string;
}

// ---- GET: fetch user by id ----
export async function GET(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get('id');
	if (!userId) {
		return NextResponse.json({ success: false, error: 'Missing user ID' }, { status: 400 });
	}

	try {
		const [rows] = await db.query<User[]>('SELECT id, name, email, password FROM users WHERE id = ? LIMIT 1', [
			Number(userId),
		]);

		const user = rows[0];
		if (!user) {
			return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: user });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
	}
}

// ---- PATCH: update user ----
export async function PATCH(req: NextRequest) {
	try {
		const { id, name, email, password } = await req.json();

		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);

			await db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [
				name,
				email,
				hashedPassword,
				id,
			]);
		} else {
			await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
