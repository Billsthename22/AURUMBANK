// app/api/users/all/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    // We remove "WHERE" to get the entire ledger
    const result = await pool.query(`
      SELECT 
        id, 
        full_name, 
        email, 
        acc_number, 
        kyc_status, 
        is_verified, 
        role 
      FROM users 
      ORDER BY id DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET_ALL_USERS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to sync ledger" }, 
      { status: 500 }
    );
  }
}