import { db } from '@/lib/mysqldb';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2'; // Import the row type

export async function GET(request: NextRequest) {
    try {
        // Use RowDataPacket to tell TypeScript what to expect
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT COUNT(*) as total FROM orders'
        );
        
        // rows[0] will now be correctly typed
        const totalRows = rows[0]?.total ?? 0;

        return NextResponse.json(
            {
                success: true,
                data: totalRows,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch order count',
            },
            { status: 500 }
        );
    }
}