import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pool } from 'pg';
import { jwtVerify } from 'jose';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('aurum_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    const userId = payload.userId;

    // UPDATED QUERY: Removed 'phone', added 'acc_number'
    const result = await pool.query(
      `SELECT id, full_name, email, role, acc_number, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    // Map the database columns to what your Frontend expects
    return NextResponse.json({
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: "Not Provided", // Placeholder since 'phone' column doesn't exist
      accNumber: user.acc_number || `AUR-${user.id.toString().slice(0, 6)}`,
      role: user.role,
      created_at: user.created_at
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Session Invalid" }, { status: 401 });
  }
}