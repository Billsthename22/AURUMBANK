import { pool } from "@/app/lib/db";

// Generate a random 10-digit number
function generateRandomAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Check if a number already exists
async function isUnique(accNo: string): Promise<boolean> {
  const res = await pool.query("SELECT id FROM accounts WHERE acc_number = $1", [accNo]);
  return res.rowCount === 0;
}

// Generate a unique number
async function generateUniqueNumber(): Promise<string> {
  let accNo: string;
  let unique = false;

  while (!unique) {
    accNo = generateRandomAccountNumber();
    unique = await isUnique(accNo);
  }

  return accNo!;
}

// Fill missing account numbers
async function fillMissingAccountNumbers() {
  const accounts = await pool.query("SELECT id, acc_number FROM accounts");

  for (const acc of accounts.rows) {
    if (!acc.acc_number) {
      const accNo = await generateUniqueNumber();
      await pool.query("UPDATE accounts SET acc_number = $1 WHERE id = $2", [accNo, acc.id]);
      console.log(`Assigned account number ${accNo} to account ${acc.id}`);
    }
  }

  console.log("✅ All missing account numbers have been assigned.");
  process.exit(0);
}

fillMissingAccountNumbers().catch((err) => {
  console.error("Error filling account numbers:", err);
  process.exit(1);
});