import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/mysqldb';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket{
  id: number;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  image?: string;
}

// ---- POST: Send reset link ----
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email: string };

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const [rows] = await db.query<User[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Generate verification token (1 hour expiry)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><title>Password Reset</title></head>
      <body>
        <p>Hi ${user.name},</p>
        <p>Click the button to reset your password:</p>
        <p>This link will expire in 1 hour.</p>
      </body>
      </html>
    `;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Panel" <${process.env.SMTP_EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Link',
      html,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error('Password reset request error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ---- PATCH: Reset password ----
export async function PATCH(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const [rows] = await db.query<User[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('UPDATE auth SET password = ? WHERE email = ?', [hashedPassword, email]);

    return NextResponse.json({ success: true, message: 'Password reset successful.' }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
