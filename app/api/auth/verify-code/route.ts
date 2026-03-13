export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find user
    const res = await pool.query(
      `SELECT verification_code, is_verified
       FROM users
       WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))`,
      [email]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const user = res.rows[0];

    if (user.is_verified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 }
      );
    }

    // 2️⃣ Compare OTP
    if (user.verification_code !== code) {
      return NextResponse.json(
        { message: "Invalid code" },
        { status: 400 }
      );
    }

    // 3️⃣ Mark verified + clear OTP
    await pool.query(
      `UPDATE users
       SET is_verified = true,
           verification_code = NULL
       WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))`,
      [email]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}