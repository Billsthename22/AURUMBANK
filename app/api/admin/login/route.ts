import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers"; // Used in step 4
import { pool } from "@/app/lib/db";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_change_this_immediately"
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Fetch Admin from Pool
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );
    const admin = result.rows[0];

    // 2. Validate Credentials
    if (!admin) return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });

    // 3. Create JWT Token
    const token = await new SignJWT({ 
        userId: admin.id, 
        email: admin.email,
        role: 'admin' 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    // 4. Set HTTP-Only Cookie using the cookies() utility
    const cookieStore = await cookies();
    
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return NextResponse.json({ 
      message: "ACCESS_GRANTED",
      status: "UPLINK_ESTABLISHED" 
    }, { status: 200 });

  } catch (err) {
    console.error("JWT_LOGIN_ERROR:", err);
    return NextResponse.json({ error: "SERVER_OFFLINE" }, { status: 500 });
  }
}