import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/mysqldb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

interface Auth extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password }: LoginRequestBody = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query MySQL for the user
    const [rows] = await db.query<Auth[]>(
      'SELECT * FROM auth WHERE email = ? LIMIT 1',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ success: false, error: 'Account is not verified' }, { status: 403 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 403 });
    }

    // Generate JWT (exclude sensitive info)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login Successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set('tool_auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
