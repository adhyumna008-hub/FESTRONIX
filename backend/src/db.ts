import pg, { type PoolClient, type QueryResultRow } from 'pg';
import { readFileSync } from 'node:fs';

export function makePool(url: string, ssl = false) {
  return new pg.Pool({ connectionString: url, max: 12, connectionTimeoutMillis: 5000,
    ssl: ssl ? { rejectUnauthorized: true, ca: process.env.PGSSLROOTCERT ? readFileSync(process.env.PGSSLROOTCERT, 'utf8') : undefined } : undefined });
}
export type Pool = pg.Pool;
export async function assertRuntimePrivileges(pool: Pool) {
  const result = await pool.query<{ unsafe: boolean }>(`SELECT (
    EXISTS (SELECT 1 FROM pg_roles r WHERE pg_has_role(current_user,r.oid,'MEMBER')
      AND (r.rolsuper OR r.rolcreaterole OR r.rolcreatedb OR r.rolreplication OR r.rolbypassrls))
    OR has_schema_privilege(current_user,'public','CREATE')
    OR EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname='public' AND pg_has_role(current_user,c.relowner,'MEMBER'))
    OR has_table_privilege(current_user,'audit_logs','UPDATE,DELETE,TRUNCATE')
    OR has_table_privilege(current_user,'schema_migrations','INSERT,UPDATE,DELETE,TRUNCATE')
    OR has_table_privilege(current_user,'roles','INSERT,UPDATE,DELETE,TRUNCATE')
  ) AS unsafe`);
  if (result.rows[0]?.unsafe !== false) {
    throw new Error('Unsafe runtime database role. Use the restricted application account; never use the migration or database-owner account.');
  }
}
export class Tx {
  readonly rollbackTasks: (() => Promise<void>)[] = [];
  constructor(readonly client: PoolClient) {}
  async rows<T extends QueryResultRow = Record<string, any>>(sql: string, values: unknown[] = []): Promise<T[]> {
    return (await this.client.query<T>(sql, values)).rows;
  }
  async one<T extends QueryResultRow = Record<string, any>>(sql: string, values: unknown[] = []): Promise<T | undefined> {
    return (await this.rows<T>(sql, values))[0];
  }
}
// Assignment changes and annual transitions take exclusive lock; requests hold shared
// lock until commit. Revocation cannot race a protected write that already checked scope.
export async function transaction<T>(pool: Pool, fn: (tx: Tx) => Promise<T>, exclusive = false): Promise<T> {
  const client = await pool.connect();
  const tx = new Tx(client);
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL lock_timeout = '8s'; SET LOCAL statement_timeout = '15s'");
    await client.query(exclusive ? 'SELECT pg_advisory_xact_lock(730027)' : 'SELECT pg_advisory_xact_lock_shared(730027)');
    const result = await fn(tx);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    await Promise.allSettled(tx.rollbackTasks.map(fn => fn()));
    throw error;
  } finally { client.release(); }
}
export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string, message: string = code) { super(message); }
}
export function must<T>(value: T | null | undefined | false, code = 'NOT_FOUND', status = 404): T {
  if (!value) throw new ApiError(status, code);
  return value;
}
export async function audit(tx: Tx, actor: string | null, action: string, type: string, id: string,
  edition: string | null = null, event: string | null = null, metadata: Record<string, unknown> = {}) {
  // Call sites supply an explicit safe allowlist; never pass a request/body/token here.
  await tx.rows(`INSERT INTO audit_logs(actor_id,action,target_type,target_id,edition_id,event_id,metadata)
    VALUES($1,$2,$3,$4,$5,$6,$7)`, [actor, action, type, id, edition, event, JSON.stringify(metadata)]);
}
