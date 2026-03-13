export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("🚀 Resend Triggered for:", email);

    // 1. Generate a fresh 6-digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Update the user with the new code in PostgreSQL
    // We also use LOWER() and TRIM() to prevent simple whitespace/casing mismatches
    const updateRes = await pool.query(
      `UPDATE users 
       SET verification_code = $1 
       WHERE LOWER(TRIM(email)) = LOWER(TRIM($2)) AND is_verified = false
       RETURNING full_name`,
      [newCode, email]
    );

    if (updateRes.rowCount === 0) {
      console.log("❌ DB Update Failed: User verified or email not found.");
      return NextResponse.json(
        { error: "Verification profile not found or already active" }, 
        { status: 404 }
      );
    }

    const fullName = updateRes.rows[0].full_name;
    const firstName = fullName.split(' ')[0];

    // 3. Dispatch Email via Resend using the NEW code
    console.log("📨 Contacting Resend Servers with code:", newCode);
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: [email],
      subject: 'New Security Code: Aurum Bank Access',
      html: `
        <div style="font-family: serif; color: #001f3f; padding: 20px; border: 1px solid #c5a059;">
          <h1 style="color: #c5a059; border-bottom: 1px solid #c5a059; padding-bottom: 10px;">Security Protocol</h1>
          <p>Hello ${firstName},</p>
          <p>Your institutional access code has been re-issued. This code replaces any previous codes issued to your account.</p>
          <div style="background: #f4f4f4; padding: 25px; border-left: 4px solid #c5a059; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Verification Code</p>
            <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #001f3f;">${newCode}</p>
          </div>
          <p style="font-size: 10px; color: #999; font-style: italic;">Note: If you did not request this code, please contact Aurum Security immediately.</p>
        </div>
      `
    });

    if (error) {
      console.error("❌ RESEND API ERROR:", error.name, error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ RESEND SUCCESS:", data?.id);
    return NextResponse.json({ success: true });
   
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("🔥 RESEND_SYSTEM_ERROR:", errorMessage);
    
    return NextResponse.json(
      { error: `Mail server error: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}