import { makePool, transaction, audit } from '../src/db.js';
import { ROLE } from '../src/permissions.js';

const [primaryUid,backupUid]=process.argv.slice(2);
if (!primaryUid || !backupUid || primaryUid===backupUid) throw new Error('Supply two distinct verified Firebase UIDs: npm run owners:bootstrap -- PRIMARY_UID BACKUP_UID');
if (!process.env.MIGRATION_DATABASE_URL) throw new Error('MIGRATION_DATABASE_URL is required for one-time institutional bootstrap');
const pool=makePool(process.env.MIGRATION_DATABASE_URL,process.env.DATABASE_SSL==='true');
try {
  await transaction(pool,async tx=>{
    if (await tx.one('SELECT id FROM role_assignments LIMIT 1')) throw new Error('Bootstrap only operates on an uninitialized role store; use authorized ownership handover thereafter.');
    const users=[];
    for (const uid of [primaryUid,backupUid]) {
      const u=await tx.one("SELECT u.id FROM users u JOIN identities i ON i.user_id=u.id WHERE i.provider='FIREBASE' AND i.subject=$1 AND u.disabled_at IS NULL",[uid]);
      if (!u) throw new Error('Each custodian must sign in successfully through the Firebase-backed API first.');
      users.push(u.id);
    }
    for (const [i,role] of [ROLE.primary,ROLE.backup].entries()) await tx.rows('INSERT INTO role_assignments(user_id,role_code,granted_by,reason) VALUES($1,$2,$3,$4)',[users[i],role,users[0],'Initial institutional custody bootstrap']);
    await audit(tx,users[0],'CUSTODY_BOOTSTRAPPED','platform','institution',null,null,{primary_user_id:users[0],backup_user_id:users[1]});
  },true);
  console.log('Institutional custodians assigned. No email is embedded in application logic.');
} finally {await pool.end();}
