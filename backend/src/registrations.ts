import { randomBytes } from 'node:crypto';
import { ApiError, Tx, audit, must } from './db.js';
import { ADMINS, EDITORS, requireGrant, scopedEvent } from './permissions.js';

export const code = (prefix: string) => prefix+'-'+randomBytes(9).toString('hex').toUpperCase();
export async function lockedEvent(tx: Tx, eventId: string) {
  const e=must(await tx.one('SELECT * FROM events WHERE id=$1 FOR UPDATE',[eventId]));
  const v=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1',[e.active_revision_id]),'EVENT_NOT_PUBLISHED',409);
  const ed=must(await tx.one('SELECT * FROM editions WHERE id=$1',[e.edition_id]));
  return {e,v,ed};
}
export function admissions(e: Record<string,any>,v: Record<string,any>,ed: Record<string,any>) {
  const now=Date.now();
  if (ed.state!=='ACTIVE' || !ed.admissions_open || e.status!=='PUBLISHED' || e.registration_state!=='OPEN'
    || now<+v.registration_opens || now>=+v.registration_deadline) throw new ApiError(409,'REGISTRATION_CLOSED');
}
export async function occupied(tx: Tx,eventId: string,exceptId: string|null=null) {
  const result=await tx.one(`SELECT count(*)::int AS count FROM registrations WHERE event_id=$1 AND ($2::uuid IS NULL OR id<>$2)
    AND (status IN ('CONFIRMED','ACTION_REQUIRED') OR (status IN ('PENDING_PAYMENT','PAYMENT_VERIFICATION_PENDING','PAYMENT_REJECTED') AND hold_expires_at>now())
    OR (status='OFFERED' AND offer_expires_at>now()))`,[eventId,exceptId]);
  return result!.count as number;
}
export async function checkMembers(tx: Tx,eventId: string,v: Record<string,any>,members: string[],exceptRegistration?: string) {
  const users=await tx.rows('SELECT * FROM users WHERE id=ANY($1::uuid[]) ORDER BY id FOR UPDATE',[members]);
  if (users.length!==members.length) throw new ApiError(400,'INVALID_MEMBERS');
  for (const u of users) {
    if (u.disabled_at || (!u.is_student && !v.allow_non_students) || (u.is_student && (!u.institution || !v.institution_types.includes(u.institution_type)))
      || (v.allowed_colleges.length && !v.allowed_colleges.some((c:string)=>c.toLowerCase()===u.institution?.toLowerCase()))
      || (v.academic_years.length && !v.academic_years.includes(u.academic_year))
      || (v.branches.length && !v.branches.some((b:string)=>b.toLowerCase()===u.branch?.toLowerCase()))
      || (v.minimum_age!==null && (u.age_years===null || u.age_years<v.minimum_age))) throw new ApiError(409,'ELIGIBILITY_NOT_MET');
  }
  const clashes=await tx.rows(`SELECT r.id,v.clash_behavior FROM registration_members m JOIN registrations r ON r.id=m.registration_id
    JOIN events e ON e.id=r.event_id JOIN event_revisions v ON v.id=e.active_revision_id
    WHERE m.user_id=ANY($1::uuid[]) AND m.withdrawn_at IS NULL AND r.event_id<>$2
      AND r.status IN ('CONFIRMED','ACTION_REQUIRED') AND e.status NOT IN ('CANCELLED','ARCHIVED')
      AND v.starts_at<$4 AND v.ends_at>$3 AND ($5::uuid IS NULL OR r.id<>$5)`,[members,eventId,v.starts_at,v.ends_at,exceptRegistration??null]);
  if (clashes.length && (v.clash_behavior==='BLOCK' || clashes.some(c=>c.clash_behavior==='BLOCK'))) throw new ApiError(409,'SCHEDULE_CLASH');
  return clashes.length ? ['SCHEDULE_CLASH'] : [];
}
export async function register(tx: Tx,actor: string,eventId: string,teamId?: string) {
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  let members=[actor];
  if (v.mode==='TEAM') {
    if (!teamId) throw new ApiError(400,'TEAM_REQUIRED');
    const team=must(await tx.one('SELECT * FROM teams WHERE id=$1 AND event_id=$2 AND captain_id=$3',[teamId,eventId,actor]));
    members=(await tx.rows('SELECT user_id FROM team_members WHERE team_id=$1 AND left_at IS NULL',[team.id])).map(m=>m.user_id);
    if (members.length<v.team_min || members.length>v.team_max) throw new ApiError(409,'TEAM_SIZE_INVALID');
  } else if (teamId) throw new ApiError(400,'SOLO_EVENT');
  const existing=await tx.one(`SELECT r.* FROM registrations r JOIN registration_members m ON m.registration_id=r.id
    WHERE r.event_id=$1 AND m.user_id=$2 AND m.withdrawn_at IS NULL`,[eventId,actor]);
  if (existing) return {registration:registrationSummary(existing),warnings:[],reused:true};
  const warnings=await checkMembers(tx,eventId,v,members);
  const full=await occupied(tx,eventId)>=v.capacity;
  if (full && !v.waitlist_enabled) throw new ApiError(409,'EVENT_FULL');
  const status=full?'WAITLISTED':v.fee_paise>0?'PENDING_PAYMENT':'CONFIRMED';
  const r=(await tx.one(`INSERT INTO registrations(code,edition_id,event_id,revision_id,applicant_id,team_id,status,hold_expires_at,confirmed_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,CASE WHEN $7='PENDING_PAYMENT' THEN now()+($8*interval '1 minute') END,
    CASE WHEN $7='CONFIRMED' THEN now() END) RETURNING *`,[code('REG'),e.edition_id,eventId,v.id,actor,teamId??null,status,v.payment_hold_minutes]))!;
  for (const user of members) await tx.rows('INSERT INTO registration_members(registration_id,edition_id,event_id,user_id) VALUES($1,$2,$3,$4)',[r.id,e.edition_id,eventId,user]);
  await audit(tx,actor,'REGISTRATION_CREATED','registration',r.id,e.edition_id,eventId,{status});
  return {registration:registrationSummary(r),warnings,reused:false};
}
export function registrationSummary(r: Record<string,any>) {
  return {id:r.id,code:r.code,edition_id:r.edition_id,event_id:r.event_id,team_id:r.team_id,status:r.status,
    hold_expires_at:r.hold_expires_at,offer_expires_at:r.offer_expires_at,confirmed_at:r.confirmed_at,reason:r.reason};
}
export async function cancelRegistration(tx: Tx, actor: string,eventId: string,registrationId: string,reason: string,staff=false) {
  const {e,v}=await lockedEvent(tx,eventId);
  const r=must(await tx.one('SELECT * FROM registrations WHERE id=$1 AND event_id=$2',[registrationId,eventId]));
  if (staff) {
    await requireGrant(tx,actor,r.team_id && v.fee_paise>0 ? ADMINS : EDITORS,e.edition_id,eventId);
  } else {
    if (r.applicant_id!==actor) throw new ApiError(404,'NOT_FOUND');
    if (r.team_id || v.fee_paise>0 || Date.now()>=+v.registration_deadline || e.status!=='PUBLISHED') throw new ApiError(409,'STAFF_WITHDRAWAL_REVIEW_REQUIRED');
  }
  if (r.status==='CANCELLED') return {status:'CANCELLED'};
  await tx.rows("UPDATE registrations SET status='CANCELLED',reason=$2,cancelled_at=now() WHERE id=$1",[r.id,reason]);
  await tx.rows('UPDATE registration_members SET withdrawn_at=coalesce(withdrawn_at,now()) WHERE registration_id=$1',[r.id]);
  await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=now(),revoked_reason=$2 WHERE registration_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[r.id,reason]);
  await audit(tx,actor,'REGISTRATION_CANCELLED','registration',r.id,e.edition_id,eventId,{reason,financial_followup_required:v.fee_paise>0});
  return {status:'CANCELLED',financial_followup_required:v.fee_paise>0};
}
export async function offerWaitlist(tx: Tx,actor: string,eventId: string,registrationId: string,minutes: number) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  if (minutes!==v.waitlist_offer_minutes) throw new ApiError(409,'USE_APPROVED_OFFER_DURATION');
  const r=must(await tx.one("SELECT * FROM registrations WHERE id=$1 AND event_id=$2 AND status='WAITLISTED'",[registrationId,eventId]));
  if (await occupied(tx,eventId)>=v.capacity) throw new ApiError(409,'EVENT_FULL');
  const first=await tx.one("SELECT id FROM registrations WHERE event_id=$1 AND status='WAITLISTED' ORDER BY created_at,id LIMIT 1",[eventId]);
  if (first?.id!==r.id) throw new ApiError(409,'EARLIER_WAITLIST_ENTRY_EXISTS');
  await tx.rows("UPDATE registrations SET status='OFFERED',offer_expires_at=least(now()+($2*interval '1 minute'),$3) WHERE id=$1",[r.id,minutes,v.registration_deadline]);
  await audit(tx,actor,'WAITLIST_OFFERED','registration',r.id,event.edition_id,eventId,{minutes});
  return {status:'OFFERED'};
}

export async function expireOffers(tx: Tx,actor: string,eventId: string) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  const expired=await tx.rows(`UPDATE registrations SET status='WAITLISTED',offer_expires_at=NULL
    WHERE event_id=$1 AND status='OFFERED' AND offer_expires_at<=now() RETURNING id`,[eventId]);
  for (const r of expired) await audit(tx,actor,'WAITLIST_OFFER_EXPIRED','registration',r.id,event.edition_id,eventId);
  return {expired_count:expired.length};
}
export async function acceptOffer(tx: Tx,actor: string,eventId: string,registrationId: string) {
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  const r=must(await tx.one('SELECT * FROM registrations WHERE id=$1 AND event_id=$2 AND applicant_id=$3',[registrationId,eventId,actor]));
  if (r.status!=='OFFERED' || Date.now()>=+r.offer_expires_at) throw new ApiError(409,'OFFER_EXPIRED');
  const members=(await tx.rows('SELECT user_id FROM registration_members WHERE registration_id=$1 AND withdrawn_at IS NULL',[r.id])).map(m=>m.user_id);
  if (members.length<v.team_min || members.length>v.team_max) throw new ApiError(409,'TEAM_SIZE_INVALID');
  const warnings=await checkMembers(tx,eventId,v,members,r.id);
  const status=v.fee_paise>0?'PENDING_PAYMENT':'CONFIRMED';
  await tx.rows(`UPDATE registrations SET status=$2,confirmed_at=CASE WHEN $2='CONFIRMED' THEN now() END,
    hold_expires_at=CASE WHEN $2='PENDING_PAYMENT' THEN now()+($3*interval '1 minute') END WHERE id=$1`,[r.id,status,v.payment_hold_minutes]);
  await audit(tx,actor,'WAITLIST_ACCEPTED','registration',r.id,e.edition_id,eventId,{status});
  return {status,warnings};
}
