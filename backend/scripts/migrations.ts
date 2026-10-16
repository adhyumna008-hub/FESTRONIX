import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import type { Pool } from '../src/db.js';

export async function migrate(pool: Pool, directory=resolve('migrations')) {
  const client=await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(730028)');
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())');
    for (const name of (await readdir(directory)).filter(n=>/^\d+.*\.sql$/.test(n)).sort()) {
      const sql=await readFile(resolve(directory,name),'utf8');
      const hash=createHash('sha256').update(sql).digest('hex');
      const existing=(await client.query('SELECT sha256 FROM schema_migrations WHERE name=$1',[name])).rows[0];
      if (existing) { if (existing.sha256!==hash) throw new Error(`Applied migration changed: ${name}`);continue; }
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations(name,sha256) VALUES($1,$2)',[name,hash]);
        await client.query('COMMIT');
      } catch(error) {await client.query('ROLLBACK');throw error;}
    }
  } finally {await client.query('SELECT pg_advisory_unlock(730028)');client.release();}
}
// Input identifiers must be local administrator-chosen identifiers, never request data.
export async function grantRuntime(pool: Pool,role: string) {
  if (!/^[a-z][a-z0-9_]{1,60}$/.test(role)) throw new Error('Invalid database role');
  await pool.query(`REVOKE CREATE ON SCHEMA public FROM PUBLIC;
    GRANT USAGE ON SCHEMA public TO "${role}";
    GRANT SELECT,INSERT,UPDATE ON ALL TABLES IN SCHEMA public TO "${role}";
    GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO "${role}";
    REVOKE INSERT,UPDATE ON schema_migrations,roles FROM "${role}";
    REVOKE UPDATE ON audit_logs FROM "${role}";`);
}
