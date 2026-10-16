import EmbeddedPostgres from 'embedded-postgres';
import { createServer } from 'node:net';
import { mkdir, access } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { randomBytes } from 'node:crypto';
import { makePool } from '../src/db.js';
import { migrate, grantRuntime } from './migrations.js';

export async function availablePort() {
  const server=createServer();
  await new Promise<void>((res,rej)=>{server.once('error',rej);server.listen(0,'127.0.0.1',res);});
  const port=(server.address() as {port:number}).port;
  await new Promise<void>((res,rej)=>server.close(error=>error?rej(error):res()));return port;
}
export async function localPostgres(test=false) {
  const base=resolve('.local');
  const dir=resolve(base,test?'test-postgres':'dev-postgres');
  if (!dir.startsWith(base+sep)) throw new Error('Database path must stay within backend/.local');
  await mkdir(base,{recursive:true});
  const port=test?await availablePort():55432;
  const password='local_only_change_me';
  const pg=new EmbeddedPostgres({databaseDir:dir,user:'postgres',password,port,persistent:true,authMethod:'scram-sha-256',
    postgresFlags:['-h','127.0.0.1','-c','max_connections=40'],onLog:()=>{},onError:()=>{}});
  try {await access(resolve(dir,'PG_VERSION'));} catch {await pg.initialise();}
  await pg.start();
  const database=test?'fx_test_'+randomBytes(5).toString('hex'):'festronix_dev';
  const admin=makePool(`postgresql://postgres:${password}@127.0.0.1:${port}/postgres`);
  try {
    if (!(await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[database])).rowCount) await pg.createDatabase(database);
    if (!(await admin.query("SELECT 1 FROM pg_roles WHERE rolname='festronix_app'")).rowCount) await admin.query("CREATE ROLE festronix_app LOGIN PASSWORD 'local_only_change_me' NOSUPERUSER NOCREATEDB NOCREATEROLE");
  } finally {await admin.end();}
  const migrationUrl=`postgresql://postgres:${password}@127.0.0.1:${port}/${database}`;
  const runtimeUrl=`postgresql://festronix_app:${password}@127.0.0.1:${port}/${database}`;
  const migrationPool=makePool(migrationUrl);
  try {await migrate(migrationPool);await grantRuntime(migrationPool,'festronix_app');}
  catch(error) {await migrationPool.end();await pg.stop();throw error;}
  return {pg,migrationPool,migrationUrl,runtimeUrl,port,database};
}
