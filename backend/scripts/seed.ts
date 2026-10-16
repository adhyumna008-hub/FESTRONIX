import { writeFile, mkdir } from 'node:fs/promises';
import { makePool } from '../src/db.js';
import { LocalProofStore } from '../src/storage.js';
import { seedActors, scenario } from './fixtures.js';
const url=process.env.MIGRATION_DATABASE_URL;
if (!url || process.env.NODE_ENV==='production' || !['127.0.0.1','localhost','[::1]'].includes(new URL(url).hostname)) throw new Error('Development seed requires a local database and non-production mode');
if (!new URL(url).pathname.endsWith('/festronix_dev')) throw new Error('Seed is restricted to the dedicated festronix_dev database');
const pool=makePool(url);
try {
  if ((await pool.query('SELECT 1 FROM users LIMIT 1')).rowCount) throw new Error('Seed requires an empty development database. It never resets existing data.');
  const base=await seedActors(pool);
  const data=await scenario(pool,base.actors,base.edition,new LocalProofStore('.local/proofs'));
  await mkdir('.local',{recursive:true});
  await writeFile('.local/seed-fixture.json',JSON.stringify({...base,...data},null,2),{mode:0o600});
  console.log('Fictional seed created. Test-only ticket payloads saved to ignored .local/seed-fixture.json; never use these identities or credentials in production.');
} finally {await pool.end();}
