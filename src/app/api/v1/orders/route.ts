import { db } from '@/lib/mysqldb';
import { ResultSetHeader } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

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
		const [orders] = await db.query(query, [...values, limit, offset]);
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
