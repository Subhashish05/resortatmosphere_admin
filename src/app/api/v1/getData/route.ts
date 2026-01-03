import { db } from '@/lib/mysqldb';
import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

interface CandleData extends RowDataPacket {
	id?: number;
	name: string;
	open: number;
	high: number;
	low: number;
	close: number;
}

// ---- GET ----
export async function GET(req: NextRequest) {
	try {
		const [rows] = await db.query<CandleData[]>(`SELECT * FROM chart 
			WHERE open IS NOT NULL 
			  AND high IS NOT NULL 
			  AND low IS NOT NULL 
			  AND close IS NOT NULL
			  ORDER BY id ASC`);

		return NextResponse.json({ success: true, data: rows }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
	}
}

// ---- PATCH ----
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, open, high, low, close, name } = body as CandleData;

		if (!id || open == null || high == null || low == null || close == null) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		const query = `
		UPDATE chart
		SET open = ?, high = ?, low = ?, close = ? , name = ?
		WHERE id = ?
  `;

		const [result] = await db.query(query, [open, high, low, close, name, id]);

		return NextResponse.json({ success: true, message: 'Data updated', result }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
	}
}

// ---- DELETE ----
export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const { id } = body as CandleData;

		if (!id) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		const query = `
		UPDATE chart
		SET open = null, high = null, low = null, close = null, name = null
		WHERE id = ?
  `;

		const [result] = await db.query(query, [ id]);

		return NextResponse.json({ success: true, message: 'Data updated', result }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
	}
}