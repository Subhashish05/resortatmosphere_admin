import { NextResponse } from 'next/server';
import { db } from '@/lib/mysqldb';
import { RowDataPacket } from 'mysql2';

interface Category extends RowDataPacket {
	id: number;
	name: string;
}

// ---- GET: fetch user by id ----
export async function GET() {
	try {
		const [rows] = await db.query<Category[]>('SELECT * FROM category');

		return NextResponse.json({ success: true, data: rows });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
	}
}