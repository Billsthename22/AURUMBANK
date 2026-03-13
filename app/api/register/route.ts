import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();
    const fullName = `${firstName} ${lastName}`;

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert into PostgreSQL
    // Note: We use the column names from your database setup
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)',
      [fullName, email, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Registration Error:', error);
    
    // Check for duplicate email (Postgres error code 23505)
    if (error.code === '23505') {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Institutional Server Error" }, { status: 500 });
  }
}