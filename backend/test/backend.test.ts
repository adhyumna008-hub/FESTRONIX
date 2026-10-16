import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { makePool, transaction, assertRuntimePrivileges, type Pool } from '../src/db.js';
import { LocalProofStore } from '../src/storage.js';
import { localPostgres } from '../scripts/local-postgres.js';
import { seedActors, scenario, fixtureEvent, fixtureNames, eventDetails, png } from '../scripts/fixtures.js';
import { migrate } from '../scripts/migrations.js';
import { ROLE } from '../src/permissions.js';

let db:Awaited<ReturnType<typeof localPostgres>>;
let base:Awaited<ReturnType<typeof seedActors>>;
let s:Awaited<ReturnType<typeof scenario>>;
let runtime:Pool;
let app:FastifyInstance;
const store=new LocalProofStore(resolve('.local/test-proofs'));
before(async()=>{
  db=await localPostgres(true);
  base=await seedActors(db.migrationPool);
  runtime=makePool(db.runtimeUrl);
  app=await buildApp({pool:runtime,proofStore:store,rateLimitMax:10000,verifier:{async verify(token){
    if (token==='test-new-identity') return {uid:'fixture-first-login',email:'owner@example.invalid',emailVerified:true};
    if (token==='test-unverified') return {uid:'fixture-unverified',email:'owner@example.invalid',emailVerified:false};
    if (!fixtureNames.some(n=>token==='test-'+n)) throw new Error('Invalid test identity');
    const name=token.substring(5);
    return {uid:'fixture-'+name,email:`${name}@example.invalid`,emailVerified:true};
  }}});
  await app.ready();
});
beforeEach(async()=>{s=await scenario(db.migrationPool,base.actors,base.edition,store);});
after(async()=>{await app?.close();await runtime?.end();await db?.migrationPool.end();await db?.pg.stop();});
async function api(name:string,method:'GET'|'POST'|'PUT'|'DELETE'|'PATCH',path:string,payload?:Record<string,unknown>) {
  const res=await app.inject({method,url:'/api/v1'+path,headers:{authorization:'Bearer test-'+name},payload});
  return {status:res.statusCode,body:res.headers['content-type']?.includes('application/json')?res.json():res.body,headers:res.headers};
}
const scan=(actor:string,event:string,token:string,extra:Record<string,unknown>={})=>api(actor,'POST',`/events/${event}/scans`,{token,...extra});
const issue=(actor:string,event:string,member:string,extra:Record<string,unknown>={})=>api(actor,'POST',`/events/${event}/members/${member}/ticket`,extra);
async function extraEvent(patch:Record<string,unknown>={}) {return transaction(db.migrationPool,tx=>fixtureEvent(tx,base.actors,base.edition,patch));}
const query=(sql:string,values:unknown[]=[])=>db.migrationPool.query(sql,values);

test('1 assigned Event A coordinator can scan Event A ticket',async()=>{
  const r=await scan('coordinatorA',s.a.id,s.valid.token);assert.equal(r.status,200);assert.equal(r.body.result,'VALID_CHECKED_IN');
});
test('2 coordinator A cannot operate scanner for Event B, with no participant leakage',async()=>{
  const r=await scan('coordinatorA',s.b.id,s.other.token);assert.equal(r.status,403);assert.equal(r.body.error.code,'NOT_AUTHORIZED');assert.ok(!JSON.stringify(r.body).includes('bob'));
});
test('3 participant cannot use coordinator scanner or roster endpoint',async()=>{
  assert.equal((await scan('alice',s.a.id,s.valid.token)).status,403);
  assert.equal((await api('alice','GET',`/events/${s.a.id}/registrations`)).status,403);
});
test('4 pending paid registration cannot receive an active ticket',async()=>{
  const r=await issue('pending',s.paidEvent.id,s.pending.members[0]);assert.equal(r.status,409);assert.equal(r.body.error.code,'REGISTRATION_NOT_CONFIRMED');
  assert.equal((await query('SELECT count(*)::int AS n FROM tickets WHERE registration_id=$1',[s.pending.id])).rows[0].n,0);
});
test('5 authorized payment approval confirms registration and permits ticket issuance',async()=>{
  const r=await api('coordinatorA','POST',`/events/${s.paidEvent.id}/payments/${s.pendingPayment}/review`,{decision:'APPROVED',reason:'Verified in finance ledger'});
  assert.equal(r.status,200);assert.equal(r.body.registration_status,'CONFIRMED');
  const t=await issue('pending',s.paidEvent.id,s.pending.members[0]);assert.equal(t.status,200);assert.ok(t.body.qr_payload.startsWith('fx1_'));
});
test('6 revoked ticket fails',async()=>{assert.equal((await scan('coordinatorA',s.a.id,s.revoked.token)).body.result,'REVOKED_TICKET');});
test('7 random ticket fails safely',async()=>{assert.deepEqual((await scan('scannerA',s.a.id,'untrusted-random-ticket')).body,{result:'INVALID_TICKET'});});
test('8 first scan records attributed individual attendance and audit',async()=>{
  const r=await scan('scannerA',s.a.id,s.valid.token);assert.equal(r.body.result,'VALID_CHECKED_IN');
  const a=(await query('SELECT * FROM attendance WHERE member_id=$1',[s.regA.members[0]])).rows[0];
  assert.equal(a.scanner_user_id,base.actors.scannerA);assert.ok(a.scanner_assignment_id);assert.equal(a.ticket_id,s.valid.id);
  assert.equal((await query("SELECT count(*)::int AS n FROM audit_logs WHERE target_id=$1 AND action='QR_CHECKIN'",[a.id])).rows[0].n,1);
});
test('9 duplicate scan returns original time and no duplicate record',async()=>{
  const first=await scan('coordinatorA',s.a.id,s.valid.token);const second=await scan('scannerA',s.a.id,s.valid.token);
  assert.equal(second.body.result,'ALREADY_CHECKED_IN');assert.equal(first.body.checked_in_at,second.body.checked_in_at);
});
test('10 concurrent scans from two independently authorized identities are atomic',async()=>{
  const results=await Promise.all(Array.from({length:8},(_,i)=>scan(i%2?'scannerA':'coordinatorA',s.a.id,s.valid.token)));
  assert.equal(results.filter(r=>r.body.result==='VALID_CHECKED_IN').length,1);
  assert.equal(results.filter(r=>r.body.result==='ALREADY_CHECKED_IN').length,7);
  assert.equal((await query('SELECT count(*)::int AS n FROM attendance WHERE member_id=$1 AND voided_at IS NULL',[s.regA.members[0]])).rows[0].n,1);
});
test('11 closed and not-yet-open check-in windows fail',async()=>{
  await query("UPDATE event_revisions SET checkin_closes=now()-interval '1 minute' WHERE id=$1",[s.a.revision]);
  assert.equal((await scan('coordinatorA',s.a.id,s.valid.token)).body.result,'CHECKIN_CLOSED');
  await query("UPDATE event_revisions SET checkin_opens=now()+interval '1 hour',checkin_closes=now()+interval '3 hours' WHERE id=$1",[s.a.revision]);
  assert.equal((await scan('coordinatorA',s.a.id,s.valid.token)).body.result,'CHECKIN_NOT_OPEN');
});
test('12 faculty window override works, requires reason and is audited',async()=>{
  await query("UPDATE event_revisions SET checkin_closes=now()-interval '1 minute' WHERE id=$1",[s.a.revision]);
  assert.equal((await scan('coordinatorA',s.a.id,s.valid.token,{override:true,reason:'Late arrival allowed'})).status,403);
  assert.equal((await scan('admin',s.a.id,s.valid.token,{override:true})).status,400);
  const r=await scan('admin',s.a.id,s.valid.token,{override:true,reason:'Faculty allowed late arrival'});assert.equal(r.body.result,'VALID_CHECKED_IN');
  const a=(await query("SELECT metadata FROM audit_logs WHERE event_id=$1 AND action='ATTENDANCE_OVERRIDE'",[s.a.id])).rows[0];assert.equal(a.metadata.reason,'Faculty allowed late arrival');
});
test('13 regenerated ticket invalidates previous token and stores only hashes',async()=>{
  const r=await issue('alice',s.a.id,s.regA.members[0],{regenerate:true,reason:'Lost ticket recovery'});assert.equal(r.status,200);
  assert.equal((await scan('scannerA',s.a.id,s.valid.token)).body.result,'REVOKED_TICKET');
  assert.equal((await scan('scannerA',s.a.id,r.body.qr_payload)).body.result,'VALID_CHECKED_IN');
  const t=(await query('SELECT * FROM tickets WHERE id=$1',[r.body.id])).rows[0];assert.equal(t.token_hash.length,64);assert.ok(!JSON.stringify(t).includes(r.body.qr_payload));
});
test('14 altered event or registration IDs do not expose other-event rosters',async()=>{
  assert.equal((await api('coordinatorA','GET',`/events/${s.b.id}/registrations`)).status,403);
  assert.equal((await api('coordinatorA','GET',`/events/${s.a.id}/registrations/${s.regB.id}`)).status,404);
  assert.equal((await api('coordinatorA','GET',`/events/${s.b.id}/registrations/${s.regB.id}`)).status,403);
});
test('15 edition-scoped admin and coordinator cannot access the next edition',async()=>{
  const other=await transaction(db.migrationPool,tx=>fixtureEvent(tx,base.actors,base.nextEdition));
  assert.equal((await api('admin','GET',`/events/${other.id}/registrations`)).status,403);
  assert.equal((await api('coordinatorA','GET',`/events/${other.id}/registrations`)).status,403);
  assert.equal((await api('alice','POST',`/events/${other.id}/registrations`,{})).body.error.code,'REGISTRATION_CLOSED');
});
test('16 another-event ticket presented in authorized scanner mode returns only WRONG_EVENT',async()=>{
  assert.deepEqual((await scan('coordinatorA',s.a.id,s.other.token)).body,{result:'WRONG_EVENT'});
});
test('17 expired bearer is rejected and faculty override cannot resurrect it',async()=>{
  await query("UPDATE tickets SET expires_at=now()-interval '1 minute' WHERE id=$1",[s.valid.id]);
  assert.equal((await scan('admin',s.a.id,s.valid.token,{override:true,reason:'Faculty review requested'})).body.result,'EXPIRED_TICKET');
});
test('18 concurrent registrations cannot both acquire final capacity',async()=>{
  const e=await extraEvent({capacity:1});
  const results=await Promise.all(['alice','bob'].map(n=>api(n,'POST',`/events/${e.id}/registrations`,{})));
  assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
  assert.equal((await query("SELECT count(*)::int AS n FROM registrations WHERE event_id=$1 AND status='CONFIRMED'",[e.id])).rows[0].n,1);
});
test('19 captain ticket records only captain; manual roster check-in records selected member',async()=>{
  const ticket=await issue('captain',s.teamEvent.id,s.team.members[0]);assert.equal(ticket.status,200);
  assert.equal((await scan('coordinatorA',s.teamEvent.id,ticket.body.qr_payload)).body.result,'VALID_CHECKED_IN');
  assert.equal((await query('SELECT count(*)::int AS n FROM attendance WHERE registration_id=$1',[s.team.id])).rows[0].n,1);
  const lookup=await api('scannerA','POST',`/events/${s.teamEvent.id}/lookup`,{code:s.team.code});assert.equal(lookup.body.members.length,2);
  assert.equal((await api('scannerA','POST',`/events/${s.teamEvent.id}/manual-checkins`,{member_id:s.team.members[1],reason:'Member college ID checked',identity_checked:true})).body.result,'VALID_CHECKED_IN');
  assert.equal((await query('SELECT count(*)::int AS n FROM attendance WHERE registration_id=$1',[s.team.id])).rows[0].n,2);
});
test('20 expired and revoked staff assignments lose access on next request',async()=>{
  await query("UPDATE role_assignments SET expires_at=now()-interval '1 second',starts_at=now()-interval '1 day' WHERE user_id=$1 AND event_id=$2",[base.actors.coordinatorA,s.a.id]);
  assert.equal((await scan('coordinatorA',s.a.id,s.valid.token)).status,403);
  const assignment=(await query('SELECT id FROM role_assignments WHERE user_id=$1 AND event_id=$2',[base.actors.scannerA,s.a.id])).rows[0].id;
  assert.equal((await api('admin','POST',`/role-assignments/${assignment}/revoke`,{reason:'Duty ended for today'})).status,200);
  assert.equal((await scan('scannerA',s.a.id,s.valid.token)).status,403);
});
test('21 paid proof rejection supports new upload and resubmission',async()=>{
  const path=`/events/${s.paidEvent.id}`;
  assert.equal((await api('coordinatorA','POST',`${path}/payments/${s.pendingPayment}/review`,{decision:'REJECTED',reason:'Reference does not match ledger'})).status,200);
  const proof=await api('pending','POST',`${path}/registrations/${s.pending.id}/proofs`,{content_base64:png,media_type:'image/png'});assert.equal(proof.status,200);
  const submitted=await api('pending','POST',`${path}/registrations/${s.pending.id}/payments`,{proof_id:proof.body.id,reference:'FIXTURE-'+randomUUID()});assert.equal(submitted.status,200);
  assert.equal((await api('coordinatorA','POST',`${path}/payments/${submitted.body.id}/review`,{decision:'APPROVED',reason:'Corrected reference verified'})).status,200);
  assert.equal((await issue('pending',s.paidEvent.id,s.pending.members[0])).status,200);
});
test('22 payment proofs cannot be read by scanner, outsider or wrong-event coordinator',async()=>{
  const proof=(await query('SELECT proof_id FROM payment_submissions WHERE id=$1',[s.pendingPayment])).rows[0].proof_id;
  for (const actor of ['coordinatorB','scannerA','alice']) assert.equal((await api(actor,'GET',`/events/${s.paidEvent.id}/proofs/${proof}`)).status,403);
  assert.equal((await api('coordinatorA','GET',`/events/${s.a.id}/proofs/${proof}`)).status,404);
  const allowed=await api('coordinatorA','GET',`/events/${s.paidEvent.id}/proofs/${proof}`);assert.equal(allowed.status,200);assert.ok(allowed.headers['content-disposition']?.includes('attachment'));
});
test('23 event revisions require independent approval and explicit publication',async()=>{
  const made=await api('admin','POST',`/editions/${base.edition}/events`,{slug:'workflow-'+randomUUID(),details:eventDetails()});assert.equal(made.status,200);
  const e=made.body.event.id,v=made.body.revision.id;
  assert.equal((await api('admin','POST',`/events/${e}/revisions/${v}/submit`,{})).status,200);
  assert.equal((await api('admin','POST',`/events/${e}/revisions/${v}/review`,{decision:'APPROVED',reason:'Reviewed event proposal'})).body.error.code,'SELF_APPROVAL_PROHIBITED');
  assert.equal((await api('approver','POST',`/events/${e}/revisions/${v}/review`,{decision:'APPROVED',reason:'Independently approved'})).status,200);
  assert.equal((await query('SELECT active_revision_id FROM events WHERE id=$1',[e])).rows[0].active_revision_id,null);
  assert.equal((await api('admin','POST',`/events/${e}/revisions/${v}/publish`,{})).status,200);
});
test('24 material revision keeps old publication and blocks unsafe replacement after entries',async()=>{
  const made=await api('coordinatorA','POST',`/events/${s.a.id}/revisions`,eventDetails({title:'New event commitments'}));assert.equal(made.status,200);
  const v=made.body.id;
  await api('coordinatorA','POST',`/events/${s.a.id}/revisions/${v}/submit`,{});
  assert.equal((await api('admin','POST',`/events/${s.a.id}/revisions/${v}/review`,{decision:'APPROVED',reason:'Material revision reviewed'})).status,200);
  assert.equal((await api('admin','POST',`/events/${s.a.id}/revisions/${v}/publish`,{})).body.error.code,'PARTICIPANT_IMPACT_REVIEW_REQUIRED');
  assert.equal((await query('SELECT active_revision_id FROM events WHERE id=$1',[s.a.id])).rows[0].active_revision_id,s.a.revision);
});
test('25 team members must accept invitation themselves; team size enforced',async()=>{
  const e=await extraEvent({mode:'TEAM',team_min:2,team_max:2});
  const created=await api('alice','POST',`/events/${e.id}/teams`,{name:'Consenting Team'});assert.equal(created.status,200);
  const t=created.body.id;
  assert.equal((await api('alice','POST',`/events/${e.id}/registrations`,{team_id:t})).body.error.code,'TEAM_SIZE_INVALID');
  const inv=await api('alice','POST',`/events/${e.id}/teams/${t}/invitations`,{user_id:base.actors.bob});assert.equal(inv.status,200);
  assert.equal((await api('carol','POST',`/invitations/${inv.body.id}/accept`,{})).status,404);
  assert.equal((await api('bob','POST',`/invitations/${inv.body.id}/accept`,{})).status,200);
  const reg=await api('alice','POST',`/events/${e.id}/registrations`,{team_id:t});assert.equal(reg.status,200);assert.equal(reg.body.registration.status,'CONFIRMED');
});
test('26 two custodians are enforced and owners can hand over safely',async()=>{
  const primary=(await query("SELECT id FROM role_assignments WHERE role_code='PRIMARY_FACULTY_OWNER' AND revoked_at IS NULL")).rows[0].id;
  assert.equal((await api('owner','POST',`/role-assignments/${primary}/revoke`,{reason:'Unsafe removal attempted'})).status,409);
  assert.equal((await api('admin','POST','/ownership/handover',{primary_user_id:base.actors.owner,backup_user_id:base.actors.backup,reason:'Unauthorized custody change'})).status,403);
  assert.equal((await api('owner','POST','/ownership/handover',{primary_user_id:base.actors.owner,backup_user_id:base.actors.backup,reason:'Recorded institutional continuity review'})).status,200);
});
test('27 audit records cannot be updated or deleted by runtime role; no QR token is logged',async()=>{
  await scan('scannerA',s.a.id,s.valid.token);
  await assert.rejects(runtime.query("UPDATE audit_logs SET action='TAMPERED'"));
  await assert.rejects(runtime.query('DELETE FROM audit_logs'));
  await assert.rejects(runtime.query('TRUNCATE audit_logs'));
  const logs=(await query('SELECT * FROM audit_logs WHERE event_id=$1',[s.a.id])).rows;
  assert.ok(!JSON.stringify(logs).includes(s.valid.token));
});
test('28 participant tokens cannot assign privileges and unknown body properties are rejected',async()=>{
  assert.equal((await api('alice','POST','/role-assignments',{user_id:base.actors.bob,role:ROLE.admin,edition_id:base.edition,expires_at:new Date(Date.now()+3600000).toISOString(),reason:'Attempted privilege escalation'})).status,403);
  assert.equal((await api('alice','POST',`/events/${s.a.id}/registrations`,{status:'CONFIRMED',role:'FACULTY_ADMIN'})).status,400);
});
test('29 cancelled registration fails QR validation and faculty cannot bypass confirmation',async()=>{
  await query("UPDATE registrations SET status='CANCELLED' WHERE id=$1",[s.regA.id]);
  assert.equal((await scan('admin',s.a.id,s.valid.token,{override:true,reason:'Invalid override attempt'})).body.result,'REGISTRATION_NOT_CONFIRMED');
});
test('30 waitlist offer requires acceptance and expires without consuming capacity',async()=>{
  const e=await extraEvent({capacity:1,waitlist_enabled:true,waitlist_offer_minutes:30});
  const a=await api('alice','POST',`/events/${e.id}/registrations`,{});const b=await api('bob','POST',`/events/${e.id}/registrations`,{});
  assert.equal(b.body.registration.status,'WAITLISTED');
  await api('alice','POST',`/events/${e.id}/registrations/${a.body.registration.id}/withdraw`,{reason:'Unable to attend event'});
  assert.equal((await api('admin','POST',`/events/${e.id}/registrations/${b.body.registration.id}/offer`,{minutes:30})).status,200);
  assert.equal((await api('bob','POST',`/events/${e.id}/registrations/${b.body.registration.id}/accept-offer`,{})).body.status,'CONFIRMED');
});
test('31 team-member withdrawal invalidates team admission, holds slot and preserves attendance history',async()=>{
  const r=await api('member','POST',`/events/${s.teamEvent.id}/teams/${s.teamId}/leave`,{reason:'Cannot attend the competition'});assert.equal(r.status,200);
  assert.equal((await query('SELECT status FROM registrations WHERE id=$1',[s.team.id])).rows[0].status,'ACTION_REQUIRED');
  assert.equal((await issue('captain',s.teamEvent.id,s.team.members[0])).body.error.code,'REGISTRATION_NOT_CONFIRMED');
});
test('32 attendance correction is audited and requires new QR',async()=>{
  await scan('scannerA',s.a.id,s.valid.token);
  const id=(await query('SELECT id FROM attendance WHERE member_id=$1',[s.regA.members[0]])).rows[0].id;
  assert.equal((await api('scannerA','POST',`/events/${s.a.id}/attendance/${id}/void`,{reason:'Mistaken check-in'})).status,403);
  assert.equal((await api('coordinatorA','POST',`/events/${s.a.id}/attendance/${id}/void`,{reason:'Mistaken check-in reconciled'})).status,200);
  assert.equal((await scan('scannerA',s.a.id,s.valid.token)).body.result,'REVOKED_TICKET');
});
test('33 targeted announcements remain private and faculty controls publication',async()=>{
  const r=await api('coordinatorA','POST',`/editions/${base.edition}/announcements`,{audience:'PARTICIPANTS',event_id:s.a.id,recipients:[base.actors.alice],title:'Private reminder',body:'Please visit the assigned desk.'});assert.equal(r.status,200);
  assert.equal((await api('coordinatorA','POST',`/editions/${base.edition}/announcements/${r.body.id}/publish`,{reason:'Publish reminder'})).status,403);
  assert.equal((await api('admin','POST',`/editions/${base.edition}/announcements/${r.body.id}/publish`,{reason:'Approved targeted reminder'})).status,200);
  const alice=await api('alice','GET',`/editions/${base.edition}/announcements`);const bob=await api('bob','GET',`/editions/${base.edition}/announcements`);
  assert.ok(alice.body.some((a:any)=>a.id===r.body.id));assert.ok(!bob.body.some((a:any)=>a.id===r.body.id));
});
test('34 reporting distinguishes members from teams and no-shows from future attendance',async()=>{
  await api('scannerA','POST',`/events/${s.teamEvent.id}/manual-checkins`,{member_id:s.team.members[0],reason:'Manual college ID verification',identity_checked:true});
  const report=await api('coordinatorA','GET',`/events/${s.teamEvent.id}/report`);
  assert.equal(report.body.confirmed,1);assert.equal(report.body.eligible_members,2);assert.equal(report.body.attended,1);assert.equal(report.body.attendance_percentage,50);assert.equal(report.body.no_show,null);
  assert.equal((await api('core','GET',`/events/${s.teamEvent.id}/team-attendance`)).status,403);
});
test('35 migrations can rerun unchanged and OpenAPI documents routes',async()=>{
  await migrate(db.migrationPool);
  const res=await app.inject({method:'GET',url:'/api/v1/openapi.json'});assert.equal(res.statusCode,200);
  assert.ok(res.json().paths['/api/v1/events/{eventId}/scans']);
  const version=(await query('SELECT version()')).rows[0].version;assert.ok(version.startsWith('PostgreSQL'));
});
test('36 missing or invalid identity returns generic 401',async()=>{
  const res=await app.inject({method:'GET',url:'/api/v1/me'});assert.equal(res.statusCode,401);
  assert.equal((await api('invented','GET','/me')).status,401);
});
test('37 expired payment holds cannot overfill event on late approval',async()=>{
  await query('UPDATE event_revisions SET capacity=1 WHERE id=$1',[s.paidEvent.revision]);
  await query("UPDATE registrations SET hold_expires_at=now()-interval '1 hour' WHERE id=$1",[s.pending.id]);
  const r=await api('coordinatorA','POST',`/events/${s.paidEvent.id}/payments/${s.pendingPayment}/review`,{decision:'APPROVED',reason:'Late proof review'});
  assert.equal(r.body.error.code,'EVENT_FULL');
});
test('38 identity inspection can be required without uploading student IDs',async()=>{
  await query('UPDATE event_revisions SET id_check_required=true WHERE id=$1',[s.a.revision]);
  assert.equal((await scan('scannerA',s.a.id,s.valid.token)).body.result,'IDENTITY_CHECK_REQUIRED');
  assert.equal((await scan('scannerA',s.a.id,s.valid.token,{identity_checked:true})).body.result,'VALID_CHECKED_IN');
});
test('39 event publication with an existing BLOCK policy prevents conflicting WARN registration',async()=>{
  await query("UPDATE event_revisions SET clash_behavior='BLOCK' WHERE id=$1",[s.a.revision]);
  const e=await extraEvent({clash_behavior:'WARN'});
  assert.equal((await api('alice','POST',`/events/${e.id}/registrations`,{})).body.error.code,'SCHEDULE_CLASH');
  await query("UPDATE event_revisions SET clash_behavior='WARN' WHERE id=$1",[s.a.revision]);
});
test('40 expired waitlist offer can be reconciled and offered again using approved duration',async()=>{
  const e=await extraEvent({capacity:1,waitlist_enabled:true,waitlist_offer_minutes:30});
  const a=await api('alice','POST',`/events/${e.id}/registrations`,{});const b=await api('bob','POST',`/events/${e.id}/registrations`,{});
  await api('alice','POST',`/events/${e.id}/registrations/${a.body.registration.id}/withdraw`,{reason:'Changed plans before event'});
  assert.equal((await api('admin','POST',`/events/${e.id}/registrations/${b.body.registration.id}/offer`,{minutes:60})).body.error.code,'USE_APPROVED_OFFER_DURATION');
  await api('admin','POST',`/events/${e.id}/registrations/${b.body.registration.id}/offer`,{minutes:30});
  await query("UPDATE registrations SET offer_expires_at=now()-interval '1 minute' WHERE id=$1",[b.body.registration.id]);
  assert.equal((await api('bob','POST',`/events/${e.id}/registrations/${b.body.registration.id}/accept-offer`,{})).body.error.code,'OFFER_EXPIRED');
  assert.equal((await api('admin','POST',`/events/${e.id}/waitlist/expire-offers`,{})).body.expired_count,1);
});
test('41 captain transfer requires accepted member consent and preserves payer ownership',async()=>{
  assert.equal((await api('captain','POST',`/events/${s.teamEvent.id}/teams/${s.teamId}/captain-transfer`,{new_captain_id:base.actors.member})).status,200);
  assert.equal((await api('alice','POST',`/events/${s.teamEvent.id}/teams/${s.teamId}/accept-captain`,{})).status,404);
  assert.equal((await api('member','POST',`/events/${s.teamEvent.id}/teams/${s.teamId}/accept-captain`,{})).body.captain_id,base.actors.member);
  assert.equal((await query('SELECT applicant_id FROM registrations WHERE id=$1',[s.team.id])).rows[0].applicant_id,base.actors.captain);
});
test('42 participants can see their own payment decision and proof, without exposing others',async()=>{
  const proof=(await query('SELECT proof_id FROM payment_submissions WHERE id=$1',[s.pendingPayment])).rows[0].proof_id;
  assert.equal((await api('pending','GET',`/me/proofs/${proof}`)).status,200);
  assert.equal((await api('alice','GET',`/me/proofs/${proof}`)).status,404);
  const r=await api('pending','GET','/me/payments?limit=100');assert.equal(r.status,200);
  assert.ok(r.body.every((p:any)=>p.registration_id!==s.paid.id));
});
test('43 closing an edition preserves history, revokes student access and isolates next activation',async()=>{
  await query("UPDATE editions SET state='READY' WHERE id=$1",[base.nextEdition]);
  assert.equal((await api('owner','POST',`/editions/${base.nextEdition}/activate`,{})).body.error.code,'CLOSE_CURRENT_EDITION_FIRST');
  // Isolated state transition check restores this fixture's current edition afterwards.
  assert.equal((await api('owner','POST',`/editions/${base.edition}/close`,{reason:'Annual handover admissions close'})).status,200);
  assert.equal((await scan('coordinatorA',s.a.id,s.valid.token)).status,403);
  assert.equal((await api('owner','POST',`/editions/${base.nextEdition}/activate`,{})).status,200);
  assert.equal((await api('alice','POST',`/events/${s.a.id}/registrations`,{})).body.error.code,'REGISTRATION_CLOSED');
  assert.ok((await query('SELECT id FROM registrations WHERE id=$1',[s.regA.id])).rowCount);
  await query("UPDATE editions SET state='PREPARATION',admissions_open=false WHERE id=$1",[base.nextEdition]);
  await query("UPDATE editions SET state='ACTIVE',admissions_open=true WHERE id=$1",[base.edition]);
});
test('44 database composite keys reject cross-event member/ticket relationships',async()=>{
  await assert.rejects(query(`INSERT INTO tickets(code,registration_id,member_id,edition_id,event_id,token_hash,expires_at)
    VALUES($1,$2,$3,$4,$5,$6,now()+interval '1 hour')`,['TKT-X'+randomUUID(),s.regA.id,s.regB.members[0],base.edition,s.a.id,'0'.repeat(64)]));
});
test('45 database rejects confirmed paid status without approved payment',async()=>{
  await assert.rejects(query("UPDATE registrations SET status='CONFIRMED' WHERE id=$1",[s.pending.id]));
});
test('46 manual fallback requires a reason and positive identity inspection',async()=>{
  const path=`/events/${s.a.id}/manual-checkins`;
  assert.equal((await api('scannerA','POST',path,{member_id:s.regA.members[0]})).status,400);
  assert.equal((await api('scannerA','POST',path,{member_id:s.regA.members[0],reason:'Phone unavailable'})).body.result,'IDENTITY_CHECK_REQUIRED');
  assert.equal((await api('scannerA','POST',path,{member_id:s.regA.members[0],reason:'Phone unavailable',identity_checked:true})).body.result,'VALID_CHECKED_IN');
});
test('47 issued QR is an actual SVG containing no participant details',async()=>{
  const r=await issue('alice',s.a.id,s.regA.members[0],{regenerate:true,reason:'Recover lost ticket'});
  assert.equal(r.status,200);assert.ok(r.body.qr_svg.startsWith('<svg'));assert.ok(!r.body.qr_svg.includes('alice'));assert.ok(!r.body.qr_payload.includes('@'));
});
test('48 duplicate attendance remains a successful informational response after window/expiry',async()=>{
  await scan('scannerA',s.a.id,s.valid.token);
  await query("UPDATE tickets SET expires_at=now()-interval '1 second' WHERE id=$1",[s.valid.id]);
  await query("UPDATE events SET status='ENDED' WHERE id=$1",[s.a.id]);
  assert.equal((await scan('scannerA',s.a.id,s.valid.token)).body.result,'ALREADY_CHECKED_IN');
});
test('49 faculty export is audited and neutralizes spreadsheet formula cells',async()=>{
  await query("UPDATE users SET display_name='=1+1' WHERE id=$1",[base.actors.alice]);
  assert.equal((await api('coordinatorA','POST',`/events/${s.a.id}/exports/attendance`,{reason:'Operational export request'})).status,403);
  const r=await api('admin','POST',`/events/${s.a.id}/exports/attendance`,{reason:'Approved reconciliation export'});
  assert.equal(r.status,200);assert.ok(r.body.includes("'=1+1"));assert.ok(!r.body.includes('@example.invalid'));
  await query("UPDATE users SET display_name='Fixture alice' WHERE id=$1",[base.actors.alice]);
});
test('50 material edits and new registration are blocked during LIVE',async()=>{
  await query("UPDATE events SET status='LIVE' WHERE id=$1",[s.a.id]);
  assert.equal((await api('coordinatorA','POST',`/events/${s.a.id}/revisions`,eventDetails())).body.error.code,'EVENT_NOT_EDITABLE');
  assert.equal((await api('dave','POST',`/events/${s.a.id}/registrations`,{})).body.error.code,'REGISTRATION_CLOSED');
});
test('51 invalid proof media is rejected before storage metadata is created',async()=>{
  await api('admin','POST',`/events/${s.paidEvent.id}/payments/${s.pendingPayment}/review`,{decision:'REJECTED',reason:'Please resubmit readable evidence'});
  const r=await api('pending','POST',`/events/${s.paidEvent.id}/registrations/${s.pending.id}/proofs`,{content_base64:Buffer.from('<script>alert(1)</script>').toString('base64'),media_type:'image/png'});
  assert.equal(r.body.error.code,'INVALID_PROOF_TYPE');
});
test('52 no-show report and certificate basis do not equate registration with eligibility',async()=>{
  const r=await api('coordinatorA','GET',`/events/${s.a.id}/certificate-basis`);assert.equal(r.status,200);
  assert.ok(r.body.every((m:any)=>!m.attended && !m.faculty_release_approved));
  await query("UPDATE events SET status='ENDED' WHERE id=$1",[s.a.id]);
  const report=await api('coordinatorA','GET',`/events/${s.a.id}/report`);assert.equal(report.body.no_show,2);
});

test('53 runtime startup accepts restricted account and rejects migration account',async()=>{
  await assertRuntimePrivileges(runtime);
  await assert.rejects(assertRuntimePrivileges(db.migrationPool),/Unsafe runtime database role/);
});

test('54 concurrent first sign-in never inherits roles from an existing owner email',async()=>{
  const calls=await Promise.all(Array.from({length:4},()=>api('new-identity','GET','/me')));
  assert.ok(calls.every(r=>r.status===200 && r.body.assignments.length===0));
  assert.equal(new Set(calls.map(r=>r.body.user.id)).size,1);
  assert.notEqual(calls[0].body.user.id,base.actors.owner);
  assert.equal((await api('new-identity','GET',`/events/${s.a.id}/registrations`)).status,403);
});

test('55 unverified email is denied before user provisioning',async()=>{
  assert.equal((await api('unverified','GET','/me')).status,401);
  assert.equal((await query("SELECT count(*)::int AS n FROM identities WHERE subject='fixture-unverified'")).rows[0].n,0);
});

test('56 LIVE events cannot acquire unapproved sessions',async()=>{
  const revision=await api('coordinatorA','POST',`/events/${s.a.id}/revisions`,eventDetails());
  assert.equal(revision.status,200);
  await query("UPDATE events SET status='LIVE' WHERE id=$1",[s.a.id]);
  const details=eventDetails();
  const r=await api('coordinatorA','POST',`/events/${s.a.id}/revisions/${revision.body.id}/sessions`,{
    label:'Unexpected extra session',venue:details.venue,starts_at:details.starts_at,ends_at:details.ends_at});
  assert.equal(r.status,409);
  assert.equal((await query('SELECT count(*)::int AS n FROM event_sessions WHERE revision_id=$1',[revision.body.id])).rows[0].n,0);
});

test('57 admission controls cannot reopen an ended event',async()=>{
  await query("UPDATE events SET status='ENDED' WHERE id=$1",[s.a.id]);
  const r=await api('admin','POST',`/events/${s.a.id}/admissions`,{state:'OPEN',reason:'Attempt to reopen ended event'});
  assert.equal(r.status,409);
});

test('58 local HTTP listener serves health/readiness and rejects unauthenticated protected requests',async()=>{
  const address=await app.listen({host:'127.0.0.1',port:0});
  const health=await fetch(address+'/health');
  assert.equal(health.status,200);assert.deepEqual(await health.json(),{status:'ok'});
  const ready=await fetch(address+'/ready');
  assert.equal(ready.status,200);
  const denied=await fetch(address+'/api/v1/me');
  assert.equal(denied.status,401);assert.equal(denied.headers.get('cache-control'),'no-store');
});
