import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // 1️⃣ Find user in DB (Added is_verified to the SELECT)
    const result = await pool.query(
      `SELECT id, email, full_name, password_hash, is_verified
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [normalizedEmail]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid Credentials' },
        { status: 401 }
      );
    }

    // 2️⃣ Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid Credentials' },
        { status: 401 }
      );
    }

    // 3️⃣ NEW: Check Verification Status
    // If the user hasn't entered their 6-digit code, block the login.
    if (!user.is_verified) {
      return NextResponse.json(
        { 
          error: 'Account not verified', 
          requiresVerification: true,
          email: user.email 
        },
        { status: 403 } // 403 Forbidden
      );
    }

    // 4️⃣ Create JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set in environment variables');
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    // 5️⃣ Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('aurum_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 2, 
    });

    return NextResponse.json({
      success: true,
      user: { name: user.full_name },
    });
  } catch (error) {
    console.error('LOGIN_ERROR:', error);
    return NextResponse.json(
      { error: 'Security Handshake Failed' },
      { status: 500 }
    );
  }
}