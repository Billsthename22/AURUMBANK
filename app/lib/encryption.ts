import crypto from 'crypto';
import dotenv from 'dotenv';

// Load .env variables so scripts like insertTestCard can see them
dotenv.config();

const ALGORITHM = 'aes-256-cbc';
// Clean the key to prevent hidden newline/space issues
const KEY_STRING = (process.env.ENCRYPTION_KEY || "").trim();

if (KEY_STRING.length !== 32) {
  // This error helps you debug exactly what the script is seeing
  throw new Error(`Vault Error: ENCRYPTION_KEY is ${KEY_STRING.length} chars. Needs 32.`);
}

const KEY = Buffer.from(KEY_STRING, 'utf8');
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return "";
  
  // Safety: If the text doesn't have a colon, it's not encrypted.
  // This prevents the app from crashing on old database rows.
  if (!text.includes(':')) return text;

  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error("Decryption failed. Data may be corrupted or key is wrong.");
    return "DECRYPTION_ERROR";
  }
}