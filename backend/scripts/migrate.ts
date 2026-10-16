import { makePool } from '../src/db.js';
import { migrate, grantRuntime } from './migrations.js';
const url=process.env.MIGRATION_DATABASE_URL;
if (!url) throw new Error('MIGRATION_DATABASE_URL is required');
const pool=makePool(url,process.env.DATABASE_SSL==='true');
try {await migrate(pool);if(process.env.RUNTIME_DATABASE_ROLE) await grantRuntime(pool,process.env.RUNTIME_DATABASE_ROLE);console.log('Migrations applied.');}
finally {await pool.end();}
