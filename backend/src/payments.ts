import { ApiError, Tx, audit, must } from './db.js';
import { ADMINS, EDITORS, requireGrant, scopedEvent } from './permissions.js';
import { lockedEvent, occupied, admissions, checkMembers } from './registrations.js';
import { proofBytes, type ProofStore } from './storage.js';

export async function uploadProof(tx: Tx,store: ProofStore,actor: string,eventId: string,registrationId: string,content: string,mime: string) {
  const {e}=await lockedEvent(tx,eventId);
  const r=must(await tx.one('SELECT * FROM registrations WHERE id=$1 AND event_id=$2 AND applicant_id=$3',[registrationId,eventId,actor]));
  if (!['PENDING_PAYMENT','PAYMENT_REJECTED'].includes(r.status)) throw new ApiError(409,'PAYMENT_NOT_SUBMITTABLE');
  if (e.status!=='PUBLISHED') throw new ApiError(409,'EVENT_CLOSED');
  const count=(await tx.one('SELECT count(*)::int AS n FROM proof_objects WHERE registration_id=$1',[r.id]))!.n;
  if (count>=10) throw new ApiError(409,'PROOF_LIMIT_CONTACT_FACULTY');
  const parsed=proofBytes(content,mime);
  await store.put(parsed.key,parsed.bytes);
  tx.rollbackTasks.push(()=>store.remove(parsed.key));
  const p=(await tx.one(`INSERT INTO proof_objects(registration_id,owner_id,storage_key,media_type,byte_size,content_sha256)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING id,media_type,byte_size`,[r.id,actor,parsed.key,mime,parsed.bytes.length,parsed.hash]))!;
  await audit(tx,actor,'PAYMENT_PROOF_UPLOADED','proof',p.id,e.edition_id,eventId);
  return p;
}
export async function submitPayment(tx: Tx,actor: string,eventId: string,registrationId: string,proofId: string,reference: string) {
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  const r=must(await tx.one('SELECT * FROM registrations WHERE id=$1 AND event_id=$2 AND applicant_id=$3',[registrationId,eventId,actor]));
  if (v.fee_paise===0 || !['PENDING_PAYMENT','PAYMENT_REJECTED'].includes(r.status)) throw new ApiError(409,'PAYMENT_NOT_SUBMITTABLE');
  must(await tx.one('SELECT id FROM proof_objects WHERE id=$1 AND registration_id=$2 AND owner_id=$3',[proofId,r.id,actor]));
  if (await occupied(tx,eventId,r.id)>=v.capacity) throw new ApiError(409,'CAPACITY_RELEASED_CONTACT_FACULTY');
  const submission=(await tx.one(`INSERT INTO payment_submissions(registration_id,edition_id,event_id,proof_id,reference,submitted_by)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING id,status`,[r.id,e.edition_id,eventId,proofId,reference.trim().toUpperCase(),actor]))!;
  await tx.rows(`UPDATE registrations SET status='PAYMENT_VERIFICATION_PENDING',hold_expires_at=now()+($2*interval '1 minute') WHERE id=$1`,[r.id,v.payment_hold_minutes]);
  await audit(tx,actor,'PAYMENT_SUBMITTED','payment_submission',submission.id,e.edition_id,eventId);
  return submission;
}
export async function reviewPayment(tx: Tx,actor: string,eventId: string,paymentId: string,decision: string,reason: string,override: boolean) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  if (override) await requireGrant(tx,actor,ADMINS,event.edition_id,eventId);
  const {e,v,ed}=await lockedEvent(tx,eventId);
  if (!['PUBLISHED','LIVE'].includes(e.status) || !['ACTIVE','CLOSED'].includes(ed.state)) throw new ApiError(409,'EVENT_CLOSED');
  const p=must(await tx.one('SELECT * FROM payment_submissions WHERE id=$1 AND event_id=$2',[paymentId,eventId]));
  const r=must(await tx.one('SELECT * FROM registrations WHERE id=$1',[p.registration_id]));
  if (r.applicant_id===actor || await tx.one('SELECT id FROM registration_members WHERE registration_id=$1 AND user_id=$2',[r.id,actor])) throw new ApiError(403,'SELF_PAYMENT_REVIEW_PROHIBITED');
  if (p.status!=='PENDING' && !(override && p.status==='REJECTED')) throw new ApiError(409,'PAYMENT_ALREADY_REVIEWED');
  if (!['PAYMENT_VERIFICATION_PENDING','PAYMENT_REJECTED'].includes(r.status)) throw new ApiError(409,'REGISTRATION_NOT_REVIEWABLE');
  if (override && await tx.one("SELECT id FROM payment_submissions WHERE registration_id=$1 AND id<>$2 AND status IN ('PENDING','APPROVED')",[r.id,p.id])) throw new ApiError(409,'NEWER_PAYMENT_SUBMISSION_EXISTS');
  if (decision==='APPROVED') {
    if (await occupied(tx,eventId,r.id)>=v.capacity) throw new ApiError(409,'EVENT_FULL');
    const members=(await tx.rows('SELECT user_id FROM registration_members WHERE registration_id=$1 AND withdrawn_at IS NULL',[r.id])).map(m=>m.user_id);
    if (members.length<v.team_min || members.length>v.team_max) throw new ApiError(409,'TEAM_SIZE_INVALID');
    await checkMembers(tx,eventId,v,members,r.id);
    await tx.rows("UPDATE registrations SET status='CONFIRMED',confirmed_at=now(),reason=NULL WHERE id=$1",[r.id]);
  } else await tx.rows("UPDATE registrations SET status='PAYMENT_REJECTED',reason=$2 WHERE id=$1",[r.id,reason]);
  await tx.rows('UPDATE payment_submissions SET status=$2,reviewed_by=$3,review_reason=$4,reviewed_at=now() WHERE id=$1',[p.id,decision,actor,reason]);
  await audit(tx,actor,override?'PAYMENT_OVERRIDE':'PAYMENT_REVIEWED','payment_submission',p.id,e.edition_id,eventId,{decision,reason});
  return {payment_status:decision,registration_status:decision==='APPROVED'?'CONFIRMED':'PAYMENT_REJECTED'};
}
