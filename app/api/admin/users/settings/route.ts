import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Helper to get User ID from the session cookie
async function getUserIdFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("aurum_session")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await pool.query(
      "SELECT full_name, email, phone, acc_number, role FROM users WHERE id = $1",
      [userId]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fullName, phone } = await req.json();

    // Use snake_case for the database columns
    await pool.query(
      "UPDATE users SET full_name = $1, phone = $2 WHERE id = $3",
      [fullName, phone, userId]
    );

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("PATCH Settings Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}