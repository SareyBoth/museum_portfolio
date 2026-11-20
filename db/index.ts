import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  var _dbPool: Pool | undefined;
}

function getPool(): Pool {
  if (globalThis._dbPool) return globalThis._dbPool;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis._dbPool = pool;
  }

  return pool;
}

export const pool = getPool();
export const db = drizzle(pool, { schema });
