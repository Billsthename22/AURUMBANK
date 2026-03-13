import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { pool } from "@/app/lib/db";
import { decrypt } from "@/app/lib/encryption";

export async function GET() {
  try {
    const cookieStore = await cookies();
    // Verify this name matches exactly what you set during login!
    const token = cookieStore.get("aurum_session")?.value;

    if (!token) {
      console.error("No token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;

    // Added cvv to the query (assuming it exists, otherwise we mock it below)
    const result = await pool.query(
      `SELECT c.id, c.card_number, c.expiry_month, c.expiry_year, u.full_name 
       FROM cards c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No card found" }, { status: 404 });
    }

    const card = result.rows[0];
    
    // Decrypt the full card number
    const decryptedNumber = decrypt(card.card_number);
    
    // Return EXACTLY what the frontend state expects
    return NextResponse.json({
      id: card.id,
      full_name: card.full_name,
      last_four: decryptedNumber.slice(-4), 
      full_number: decryptedNumber, // Necessary for "Reveal Data"
      cvv: "123", // Mock CVV for now until you add it to the DB
      brand: "Visa",
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("API Error:", errorMessage);
    
    // If JWT fails, it's usually an expired or invalid token
    if (errorMessage.includes("JWT")) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch card", details: errorMessage }, 
      { status: 500 }
    );
  }
}