import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 1. Check if token exists and is not expired
    const tokenResult = await pool.query(
      "SELECT email FROM password_resets WHERE token = $1 AND expires_at > NOW() AND used = FALSE LIMIT 1",
      [token]
    );

    if (tokenResult.rowCount === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const email = tokenResult.rows[0].email;

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update the user's password_hash in the 'users' table
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    // 4. Mark the token as used so it can't be used again
    await pool.query(
      "UPDATE password_resets SET used = TRUE WHERE token = $1",
      [token]
    );

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}