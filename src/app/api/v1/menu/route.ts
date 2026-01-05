import { NextResponse } from 'next/server';
import { db } from '@/lib/mysqldb';
import { RowDataPacket } from 'mysql2';

interface Menu extends RowDataPacket {
	id: number;
	name: string;
    category: string;
    img: string;
    isVeg: boolean;
    price: number;
}

// ---- GET: fetch user by id ----
export async function GET() {
	try {
		const [rows] = await db.query<Menu[]>('SELECT * FROM menu');

		return NextResponse.json({ success: true, data: rows });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
	}
}