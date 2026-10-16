import { writeFile } from 'node:fs/promises';
import { buildApp } from '../src/app.js';
import { makePool } from '../src/db.js';
// Schema-only export: the pool is never connected and identity is never accepted.
const pool=makePool('postgresql://unused@127.0.0.1:1/schema_export');
const unavailable=async():Promise<never>=>{throw new Error('Schema export has no runtime dependencies');};
const app=await buildApp({pool,verifier:{verify:unavailable},proofStore:{put:unavailable,read:unavailable,remove:unavailable}});
try {await app.ready();await writeFile('openapi.json',JSON.stringify(app.swagger(),null,2)+'\n');console.log('OpenAPI exported to backend/openapi.json.');}
finally {await app.close();await pool.end();}
