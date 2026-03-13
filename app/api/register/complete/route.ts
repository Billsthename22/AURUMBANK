import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, email, password, verificationCode } = body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // --- PHASE 2: VERIFICATION (If code is present) ---
    if (verificationCode) {
      const userRes = await client.query(
        `SELECT id, verification_code FROM users WHERE email = $1`,
        [email]
      );

      if (userRes.rows.length === 0) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
      }

      if (userRes.rows[0].verification_code !== verificationCode) {
        return NextResponse.json({ error: "Invalid security code" }, { status: 400 });
      }

      await client.query(
        `UPDATE users SET is_verified = true, kyc_status = 'Verified' WHERE email = $1`,
        [email]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, verified: true });
    }

    // --- PHASE 1: INITIAL REGISTRATION (If no code is present) ---
    const hashedPassword = await bcrypt.hash(password, 12);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const accountNumber = "309" + Math.floor(1000000 + Math.random() * 9000000).toString();

    // Create User
    const userRes = await client.query(
      `INSERT INTO users (full_name, email, password_hash, kyc_status, verification_code, is_verified) 
       VALUES ($1, $2, $3, 'Pending Verification', $4, false) RETURNING id`,
      [`${firstName} ${lastName}`, email, hashedPassword, newCode]
    );

    // Create Account
    await client.query(
      `INSERT INTO accounts (user_id, account_type, balance, acc_number) 
       VALUES ($1, 'Private Ledger', 0.00, $2)`,
      [userRes.rows[0].id, accountNumber]
    );

    // --- DEBUGGING EMAIL DISPATCH ---
    console.log("Attempting to send email via Resend...");
    
    const { data, error } = await resend.emails.send({
      // ⚠️ IMPORTANT: Changed from custom domain to resend.dev for sandbox testing
      from: 'Aurum Bank <onboarding@resend.dev>', 
      to: email,
      subject: 'Verify Your Aurum Bank Account',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #001f3f;">Aurum Bank Institutional Access</h2>
          <p>Hello ${firstName},</p>
          <p>Your security code is: <strong style="font-size: 20px;">${newCode}</strong></p>
          <p>Account Number: ${accountNumber}</p>
        </div>
      `
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      // We throw error here so it hits the catch block and rolls back the DB
      throw new Error(`Email failed: ${error.message}`);
    }

    console.log("✅ RESEND SUCCESS:", data);

    await client.query('COMMIT');
    return NextResponse.json({ success: true, email });

  } catch (err: any) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    console.error("Route Error:", err.message);
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 500 });
  } finally {
    client.release();
  }
}