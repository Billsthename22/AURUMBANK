import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT 
        t.id, 
        t.amount, 
        t.type, 
        t.status, 
        t.created_at, 
        t.reference,
        s.full_name as sender_name,
        r.full_name as receiver_name
      FROM transactions t
      LEFT JOIN users s ON t.sender_id = s.id
      LEFT JOIN users r ON t.receiver_id = r.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `;
    
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("AUDIT_TRAIL_FETCH_ERROR", error);
    return NextResponse.json({ error: "Failed to retrieve ledger" }, { status: 500 });
  }
}