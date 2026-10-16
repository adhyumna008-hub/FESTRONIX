import { randomBytes, createHash } from 'node:crypto';
import QRCode from 'qrcode';
import { ApiError, Tx, audit, must } from './db.js';
import { ADMINS, EDITORS, SCANNERS, grant, requireGrant, scopedEvent } from './permissions.js';
import { lockedEvent, code } from './registrations.js';

export const tokenHash=(token: string)=>createHash('sha256').update(token).digest('hex');
export async function issueTicket(tx: Tx,actor: string,eventId: string,memberId: string,regenerate: boolean,reason: string) {
  const {e,ed,v}=await lockedEvent(tx,eventId);
  const m=must(await tx.one(`SELECT m.*,r.status AS registration_status FROM registration_members m JOIN registrations r ON r.id=m.registration_id
    WHERE m.id=$1 AND m.event_id=$2`,[memberId,eventId]));
  if (m.user_id!==actor) await requireGrant(tx,actor,EDITORS,e.edition_id,eventId);
  if (m.withdrawn_at || m.registration_status!=='CONFIRMED') throw new ApiError(409,'REGISTRATION_NOT_CONFIRMED');
  if (!['PUBLISHED','LIVE'].includes(e.status) || !['ACTIVE','CLOSED'].includes(ed.state) || Date.now()>=+v.checkin_closes) throw new ApiError(409,'TICKETING_CLOSED');
  if (await tx.one('SELECT id FROM attendance WHERE member_id=$1 AND voided_at IS NULL',[m.id])) throw new ApiError(409,'ALREADY_CHECKED_IN');
  const old=await tx.one("SELECT id FROM tickets WHERE member_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[m.id]);
  if (old && !regenerate) throw new ApiError(409,'TICKET_EXISTS_REGENERATE_TO_RECOVER');
  if (regenerate) await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=now(),revoked_reason=$2 WHERE member_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[m.id,reason]);
  const token='fx1_'+randomBytes(32).toString('base64url');
  const t=(await tx.one(`INSERT INTO tickets(code,registration_id,member_id,edition_id,event_id,token_hash,expires_at)
    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,code,status,expires_at`,[code('TKT'),m.registration_id,m.id,e.edition_id,eventId,tokenHash(token),v.checkin_closes]))!;
  await audit(tx,actor,regenerate?'TICKET_REGENERATED':'TICKET_ISSUED','ticket',t.id,e.edition_id,eventId,{reason,member_id:m.id});
  const qr_svg=await QRCode.toString(token,{type:'svg',errorCorrectionLevel:'M',margin:4});
  return {...t,qr_payload:token,qr_svg}; // Only response containing secret; no retrieval endpoint.
}
export async function revokeTicket(tx: Tx,actor: string,eventId: string,ticketId: string,reason: string) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  const t=must(await tx.one('SELECT * FROM tickets WHERE id=$1 AND event_id=$2',[ticketId,eventId]));
  await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=coalesce(revoked_at,now()),revoked_reason=$2 WHERE id=$1",[t.id,reason]);
  await audit(tx,actor,'TICKET_REVOKED','ticket',t.id,event.edition_id,eventId,{reason});
  return {status:'REVOKED'};
}
export interface CheckinOptions { override: boolean; reason?: string; identity_checked: boolean; device_label?: string }
export async function scan(tx: Tx,actor: string,eventId: string,token: string,options: CheckinOptions) {
  const {event,g}=await scopedEvent(tx,actor,eventId,SCANNERS);
  // No token lookup until assigned-event authorization succeeds. No PII in wrong-event response.
  const t=await tx.one('SELECT * FROM tickets WHERE token_hash=$1',[tokenHash(token)]);
  if (!t) return {result:'INVALID_TICKET'};
  if (t.event_id!==eventId || t.edition_id!==event.edition_id) return {result:'WRONG_EVENT'};
  if (t.status==='REVOKED') return {result:'REVOKED_TICKET'};
  const present=await tx.one('SELECT id FROM attendance WHERE member_id=$1 AND voided_at IS NULL',[t.member_id]);
  if (!present && (t.status==='EXPIRED' || +t.expires_at<=Date.now())) return {result:'EXPIRED_TICKET'};
  return checkin(tx,actor,event,g.id,t.member_id,t.id,'QR',options);
}
export async function checkin(tx: Tx,actor: string,event: Record<string,any>,assignmentId: string,memberId: string,ticketId: string|null,method: 'QR'|'MANUAL',options: CheckinOptions) {
  const m=must(await tx.one(`SELECT m.*,r.status AS registration_status,r.code AS registration_code,u.display_name
    FROM registration_members m JOIN registrations r ON r.id=m.registration_id JOIN users u ON u.id=m.user_id
    WHERE m.id=$1 AND m.event_id=$2`,[memberId,event.id]));
  if (m.withdrawn_at || m.registration_status!=='CONFIRMED') return {result:'REGISTRATION_NOT_CONFIRMED'};
  const previous=await tx.one('SELECT checked_in_at FROM attendance WHERE member_id=$1 AND voided_at IS NULL',[m.id]);
  if (previous) return {result:'ALREADY_CHECKED_IN',checked_in_at:previous.checked_in_at,member_id:m.id};
  const ed=must(await tx.one('SELECT state FROM editions WHERE id=$1',[event.edition_id]));
  if (!['PUBLISHED','LIVE'].includes(event.status) || !['ACTIVE','CLOSED'].includes(ed.state)) return {result:'CHECKIN_CLOSED'};
  const v=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1',[event.active_revision_id]));
  const now=Date.now();
  if (options.override) {
    await requireGrant(tx,actor,ADMINS,event.edition_id,event.id);
    if (!options.reason || options.reason.trim().length<5) throw new ApiError(400,'OVERRIDE_REASON_REQUIRED');
  } else {
    if (now<+v.checkin_opens) return {result:'CHECKIN_NOT_OPEN'};
    if (now>=+v.checkin_closes) return {result:'CHECKIN_CLOSED'};
  }
  if (v.id_check_required && !options.identity_checked) return {result:'IDENTITY_CHECK_REQUIRED'};
  if (method==='MANUAL' && !options.reason) throw new ApiError(400,'MANUAL_REASON_REQUIRED');
  if (method==='MANUAL' && !options.identity_checked) return {result:'IDENTITY_CHECK_REQUIRED'};
  const attendance=await tx.one(`INSERT INTO attendance(edition_id,event_id,registration_id,member_id,ticket_id,scanner_user_id,scanner_assignment_id,method,device_label)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(member_id) WHERE voided_at IS NULL DO NOTHING RETURNING id,checked_in_at`,
    [event.edition_id,event.id,m.registration_id,m.id,ticketId,actor,assignmentId,method,options.device_label??null]);
  if (!attendance) {
    const a=must(await tx.one('SELECT checked_in_at FROM attendance WHERE member_id=$1 AND voided_at IS NULL',[m.id]));
    return {result:'ALREADY_CHECKED_IN',checked_in_at:a.checked_in_at,member_id:m.id};
  }
  await tx.rows("UPDATE tickets SET status='CHECKED_IN' WHERE member_id=$1 AND status='ACTIVE'",[m.id]);
  await audit(tx,actor,options.override?'ATTENDANCE_OVERRIDE':method==='QR'?'QR_CHECKIN':'MANUAL_CHECKIN','attendance',attendance.id,event.edition_id,event.id,
    {method,member_id:m.id,assignment_id:assignmentId,reason:options.reason??null,identity_checked:options.identity_checked});
  return {result:'VALID_CHECKED_IN',checked_in_at:attendance.checked_in_at,member_id:m.id,display_name:m.display_name,registration_code:m.registration_code};
}
export async function manualCheckin(tx: Tx,actor: string,eventId: string,memberId: string,options: CheckinOptions) {
  const {event,g}=await scopedEvent(tx,actor,eventId,SCANNERS);
  return checkin(tx,actor,event,g.id,memberId,null,'MANUAL',options);
}
export async function voidAttendance(tx: Tx,actor: string,eventId: string,attendanceId: string,reason: string) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  const a=must(await tx.one('SELECT * FROM attendance WHERE id=$1 AND event_id=$2',[attendanceId,eventId]));
  if (['COMPLETED','ARCHIVED'].includes(event.status)) await requireGrant(tx,actor,ADMINS,event.edition_id,eventId);
  await tx.rows('UPDATE attendance SET voided_at=coalesce(voided_at,now()),voided_by=$2,void_reason=$3 WHERE id=$1',[a.id,actor,reason]);
  // Corrections never resurrect old QR tokens; new issuance is explicit.
  await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=now(),revoked_reason='Attendance correction requires new ticket' WHERE member_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[a.member_id]);
  await audit(tx,actor,'ATTENDANCE_VOIDED','attendance',a.id,event.edition_id,eventId,{reason});
  return {voided:true};
}
