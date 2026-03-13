import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // This returns EVERY column. 
    // If your DB columns are 'first_name' and 'last_name', they will show up.
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}