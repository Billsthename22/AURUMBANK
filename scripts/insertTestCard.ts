import pkg from 'pg';
const { Client } = pkg;
import { encrypt } from "../app/lib/encryption";
// We don't even need dotenv here if we hardcode the URL for this test
import path from 'path';

async function run() {
  console.log("--- AURUM SYSTEMS: CARD ISSUANCE ---");

  // WE ARE HARDCODING THE URL HERE TO BYPASS THE ENV ISSUE
  const client = new Client({
    connectionString: "postgresql://localhost:5432/aurum_db"
  });

  // !! IMPORTANT: Get your ID by running: psql aurum_db -c "SELECT id FROM users LIMIT 1;"
  const targetUserId = " 7c7f975c-371e-41f6-86d1-6b6451351597 ".trim();

  const cardNumber = "4532990122438810";
  const cvv = "412";

  try {
    await client.connect();
    console.log("✅ Connected to: aurum_db");

    console.log("🔒 Encrypting assets...");
    const encryptedNumber = encrypt(cardNumber);
    const encryptedCVV = encrypt(cvv);

    const query = `
      INSERT INTO cards (user_id, card_number, expiry_month, expiry_year, cvv) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE 
      SET card_number = EXCLUDED.card_number, cvv = EXCLUDED.cvv;
    `;
    
    await client.query(query, [targetUserId, encryptedNumber, "09", "28", encryptedCVV]);
    console.log("✅ SUCCESS: Encrypted card issued to user:", targetUserId);

  } catch (err) {
    console.error("❌ DATABASE ERROR:", err);
  } finally {
    await client.end();
    process.exit();
  }
}

run();