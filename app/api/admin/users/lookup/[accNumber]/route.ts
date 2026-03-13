import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { accNumber: string } }
) {
  try {
    const { accNumber } = params;

    const result = await pool.query(
      "SELECT full_name FROM users WHERE acc_number = $1 LIMIT 1",
      [accNumber]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    return NextResponse.json({ name: result.rows[0].full_name });
  } catch (error) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}