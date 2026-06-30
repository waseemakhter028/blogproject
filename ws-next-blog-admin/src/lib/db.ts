import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

function buildPool(): mysql.Pool {
  const raw = process.env.DATABASE_URL!;
  // mysql2 does not recognise ?ssl-mode=REQUIRED; strip it and enable SSL properly
  const u = new URL(raw);
  const needsSsl = u.searchParams.has("ssl-mode");
  u.searchParams.delete("ssl-mode");
  return mysql.createPool({
    uri: u.toString(),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

const db = globalForDb.db ?? buildPool();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export default db;
