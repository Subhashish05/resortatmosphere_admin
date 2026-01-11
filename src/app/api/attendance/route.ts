import { NextResponse } from 'next/server';
import { db } from '@/lib/mysqldb';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Attendance extends RowDataPacket {
    id: number;
    full_name: string;
    mobile: string;
    role: string;
    salary: number;
    days_present: number;
    days_absent: number;
    isPaid: boolean;
}

export async function GET() {
    try {
        const [rows] = await db.query<Attendance[]>('SELECT * FROM attendance');
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, isPaid } = body;

        // 1. Validation: Ensure ID is provided
        if (id === undefined) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        // 2. Execute Update
        // Note: Using ResultSetHeader to type the response of a non-SELECT query
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE attendance SET isPaid = ? WHERE id = ?',
            [isPaid, id]
        );

        // 3. Check if any row was actually updated
        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, error: 'Staff record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Payment status updated' });

    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}