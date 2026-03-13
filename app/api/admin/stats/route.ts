import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    const statsQuery = `
      SELECT 
        (SELECT SUM(balance) FROM accounts) as total_balance,
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM users WHERE kyc_status = 'Pending') as pending_kyc
    `;
    const result = await pool.query(statsQuery);
    const data = result.rows[0];

    return NextResponse.json({
      totalBalance: parseFloat(data.total_balance || 0),
      userCount: parseInt(data.user_count || 0),
      pendingKyc: parseInt(data.pending_kyc || 0)
    });
  } catch (error) {
    return NextResponse.json({ error: "Stats aggregation failed" }, { status: 500 });
  }
}