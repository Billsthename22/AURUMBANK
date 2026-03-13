import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { email, idType, idNumber, kycStatus } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "User session lost. Please restart." }, { status: 400 });
    }

    // Update the existing user record with the KYC details
    const result = await pool.query(
      `UPDATE users 
       SET id_type = $1, 
           id_number = $2, 
           kyc_status = $3 
       WHERE email = $4 
       RETURNING id`,
      [idType, idNumber, kycStatus || 'submitted', email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found in database." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Dossier synchronized with institutional records." 
    });

  } catch (error: any) {
    console.error('KYC_DATABASE_ERROR:', error);
    return NextResponse.json({ error: "Internal Security Error" }, { status: 500 });
  }
}