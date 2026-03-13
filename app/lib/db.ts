import pkg from 'pg';
const { Pool } = pkg;

const globalForDb = global as unknown as { pool: pkg.Pool };

// Helper to determine if we actually need SSL
const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

export const pool = globalForDb.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only use SSL if we aren't local AND we are in production
  ssl: (!isLocal && process.env.NODE_ENV === 'production') 
    ? { rejectUnauthorized: false } 
    : false,
});

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;