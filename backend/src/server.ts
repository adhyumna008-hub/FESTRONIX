import { buildApp } from './app.js';
import { firebaseVerifier } from './auth.js';
import { makePool, assertRuntimePrivileges } from './db.js';
import { LocalProofStore } from './storage.js';
import { isAbsolute } from 'node:path';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if ((process.env.AUTH_MODE??'firebase')!=='firebase') throw new Error('Server supports Firebase identity only; test verifiers are not runtime modes.');
if (process.env.NODE_ENV==='production') {
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error('Auth emulator prohibited in production');
  if (process.env.DATABASE_SSL!=='true') throw new Error('Production requires verified PostgreSQL TLS');
  if (process.env.ALLOW_PRIVATE_LOCAL_PROOFS!=='true' || !isAbsolute(process.env.PROOF_DIRECTORY??'')) {
    throw new Error('Configure a private durable proof directory and explicitly allow local storage, or supply a reviewed object-store adapter. See BACKEND_SETUP.md.');
  }
}
if ((process.env.PROOF_STORAGE??'local')!=='local') throw new Error('This foundation ships the local private adapter only. Unknown storage modes fail closed.');
const pool=makePool(process.env.DATABASE_URL,process.env.DATABASE_SSL==='true');
await assertRuntimePrivileges(pool);
const app=await buildApp({pool,verifier:firebaseVerifier(process.env.FIREBASE_PROJECT_ID??''),
  proofStore:new LocalProofStore(process.env.PROOF_DIRECTORY??'.local/proofs'),logging:true});
await app.listen({host:process.env.HOST??'127.0.0.1',port:Number(process.env.PORT??4300)});
async function shutdown() { await app.close();await pool.end(); }
process.once('SIGINT',()=>void shutdown());process.once('SIGTERM',()=>void shutdown());
