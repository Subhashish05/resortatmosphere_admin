import { redis } from '@/lib/redis';
import { db } from '@/lib/mysqldb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

interface OrderRow extends RowDataPacket {
	id: number;
	fullname: string;
	mobile: string;
	table_no: string;
	kot_remark: string;
	bill_remark: string;
	order_details: string | object;
	captain_name: string;
	status: string;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// 1. Get Query Parameters with Defaults
		const status = searchParams.get('status');
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '12');

		// Calculate offset (e.g., Page 2 with limit 10 starts at record 11)
		const offset = (page - 1) * limit;

		let query = 'SELECT * FROM orders';
		let countQuery = 'SELECT COUNT(*) as total FROM orders';
		const values: any[] = [];

		// 2. Apply Status Filter to both data and count queries
		if (status) {
			const whereClause = ' WHERE status = ?';
			query += whereClause;
			countQuery += whereClause;
			values.push(status);
		}

		// 3. Add Ordering and Pagination
		query += ' ORDER BY id DESC LIMIT ? OFFSET ?';

		// Execute both queries
		// Note: we spread values for count, but add limit/offset for the main query
		const [rows] = await db.query<OrderRow[]>(query, [...values, limit, offset]);
		const orders = rows.map((order: any) => ({
			...order,
			order_details:
				typeof order.order_details === 'string' ? JSON.parse(order.order_details) : order.order_details,
		}));

		const [totalResult] = await db.query(countQuery, values);
		const totalRows = (totalResult as any)[0].total;
		const totalPages = Math.ceil(totalRows / limit);

		return NextResponse.json(
			{
				success: true,
				data: {
					orders,
					currentPage: page,
					totalPages,
					totalRows,
					limit,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Database Error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch orders',
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { fullname, mobile, table_no, kot_remark, bill_remark, order_details, captain_name, status } = body;

		// Principle: Fail-Fast (Basic Validation)
		if (!fullname || !mobile || !table_no || !order_details) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const query = `
            INSERT INTO orders (fullname, mobile, table_no, kot_remark, bill_remark, order_details, captain_name, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

		const values = [
			fullname,
			mobile,
			table_no,
			kot_remark || '', // Ensure optional strings aren't null
			bill_remark || '',
			JSON.stringify(order_details), // Serialization happens here
			captain_name,
			status,
		];

		const [result] = await db.query<ResultSetHeader>(query, values);

		await redis.rpush('app_updates', { event: 'order_update', data: result.insertId });

		return NextResponse.json(
			{
				success: true,
				message: 'Order placed successfully',
				orderId: result.insertId,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Database Error:', error);
		return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const { order_details, id } = (await request.json()) as { order_details: string; id: number };
		await db.query('UPDATE orders set order_details = ? where id = ?', [JSON.stringify(order_details), id]);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error);
		const message = error instanceof Error ? error.message : 'Server error';
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
