import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from '@/app/lib/db'; // Ensure this path is correct

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    // 2. Check if admin already exists using raw SQL
    const existingUser = await pool.query(
      'SELECT id FROM admins WHERE email = $1', 
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "IDENTITY_EXISTS" }, { status: 400 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create Admin using raw SQL
    // Note: Ensure your table name is 'admins' (plural) or 'admin' (singular)
    await pool.query(
      'INSERT INTO admins (email, password) VALUES ($1, $2)',
      [email.toLowerCase(), hashedPassword]
    );

    return NextResponse.json({ message: "ADMIN_CREATED" }, { status: 201 });
  } catch (err) {
    console.error("DB_ERROR:", err);
    return NextResponse.json({ error: "INTERNAL_DATABASE_FAILURE" }, { status: 500 });
  }
}