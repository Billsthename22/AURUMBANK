import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ accnumber: string }> }
) {
  try {
    // ✅ unwrap async params
    const { accnumber } = await params;

    if (!accnumber) {
      return NextResponse.json(
        { error: "Account number is required" },
        { status: 400 }
      );
    }

    // ✅ normalize input
    const cleanAcc = accnumber.trim().toUpperCase();

    const result = await pool.query(
      "SELECT full_name FROM users WHERE TRIM(UPPER(acc_number)) = $1 LIMIT 1",
      [cleanAcc]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ name: result.rows[0].full_name });
  } catch (error) {
    console.error("LOOKUP_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}