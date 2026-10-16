import { ApiError, Tx, audit, must } from './db.js';
import { ADMINS, APPROVERS, EDITORS, OWNERS, ROLE, requireGrant, scopedEvent } from './permissions.js';
import { type EventInput, eventColumns, validateEvent } from './schemas.js';

export async function createRevision(tx: Tx, actor: string, eventId: string, input: EventInput) {
  try { validateEvent(input); } catch { throw new ApiError(400,'INVALID_EVENT_POLICY'); }
  const { event } = await scopedEvent(tx,actor,eventId,EDITORS);
  if (!['DRAFT','CHANGES_REQUESTED','REJECTED','APPROVED','PUBLISHED'].includes(event.status)) throw new ApiError(409,'EVENT_NOT_EDITABLE');
  if (await tx.one("SELECT id FROM event_revisions WHERE event_id=$1 AND state='IN_REVIEW'",[eventId])) throw new ApiError(409,'REVIEW_IN_PROGRESS');
  // Retain every superseded draft and approval; only an explicit publish changes public facts.
  await tx.rows("UPDATE event_revisions SET state='SUPERSEDED' WHERE event_id=$1 AND state IN ('DRAFT','CHANGES_REQUESTED','APPROVED')",[eventId]);
  const values = eventColumns.map(k => input[k as keyof EventInput]);
  const row = (await tx.one(`INSERT INTO event_revisions(event_id,version,author_id,${eventColumns.join(',')})
    VALUES($1,(SELECT coalesce(max(version),0)+1 FROM event_revisions WHERE event_id=$1),$2,${values.map((_,i)=>'$'+(i+3)).join(',')}) RETURNING *`,[eventId,actor,...values]))!;
  if (!event.active_revision_id) await tx.rows("UPDATE events SET status='DRAFT' WHERE id=$1",[eventId]);
  await audit(tx,actor,'EVENT_REVISION_CREATED','event_revision',row.id,event.edition_id,eventId,{version:row.version});
  return row;
}
export async function submitRevision(tx: Tx, actor: string, eventId: string, revisionId: string) {
  const { event }=await scopedEvent(tx,actor,eventId,EDITORS);
  const revision=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1 AND event_id=$2',[revisionId,eventId]));
  if (!['DRAFT','CHANGES_REQUESTED'].includes(revision.state) || !['DRAFT','CHANGES_REQUESTED','PUBLISHED','APPROVED','REJECTED'].includes(event.status)) throw new ApiError(409,'INVALID_TRANSITION');
  await tx.rows("UPDATE event_revisions SET state='IN_REVIEW' WHERE id=$1",[revisionId]);
  if (!event.active_revision_id) await tx.rows("UPDATE events SET status='IN_REVIEW' WHERE id=$1",[eventId]);
  await audit(tx,actor,'EVENT_SUBMITTED','event_revision',revisionId,event.edition_id,eventId);
  return {status:'IN_REVIEW'};
}
export async function reviewRevision(tx: Tx, actor: string, eventId: string, revisionId: string, decision: string, reason: string) {
  const {event}=await scopedEvent(tx,actor,eventId,APPROVERS);
  const v=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1 AND event_id=$2',[revisionId,eventId]));
  if (v.author_id===actor) throw new ApiError(403,'SELF_APPROVAL_PROHIBITED');
  if (v.state!=='IN_REVIEW' || ['LIVE','ENDED','COMPLETED','CANCELLED','ARCHIVED'].includes(event.status)) throw new ApiError(409,'INVALID_TRANSITION');
  await tx.rows('UPDATE event_revisions SET state=$2,reviewer_id=$3,review_reason=$4,reviewed_at=now() WHERE id=$1',[revisionId,decision,actor,reason]);
  if (!event.active_revision_id) await tx.rows('UPDATE events SET status=$2 WHERE id=$1',[eventId,decision]);
  await audit(tx,actor,'EVENT_REVIEWED','event_revision',revisionId,event.edition_id,eventId,{decision,reason});
  return {status:decision};
}
export async function publishRevision(tx: Tx, actor: string, eventId: string, revisionId: string) {
  const {event}=await scopedEvent(tx,actor,eventId,ADMINS);
  const v=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1 AND event_id=$2',[revisionId,eventId]));
  if (v.state!=='APPROVED' || !['APPROVED','PUBLISHED'].includes(event.status)) throw new ApiError(409,'INVALID_TRANSITION');
  const edition=must(await tx.one('SELECT * FROM editions WHERE id=$1',[event.edition_id]));
  if (['CLOSED','ARCHIVED','CANCELLED'].includes(edition.state)) throw new ApiError(409,'EDITION_CLOSED');
  // Participant impact/reconfirmation/refund workflow is not built. Fail closed when
  // any entries exist, rather than silently changing the terms they accepted.
  if (event.active_revision_id && await tx.one('SELECT id FROM registrations WHERE event_id=$1 LIMIT 1',[eventId])) {
    throw new ApiError(409,'PARTICIPANT_IMPACT_REVIEW_REQUIRED','Publication after registration requires the later notice/reconfirmation workflow.');
  }
  if (event.active_revision_id) await tx.rows("UPDATE event_revisions SET state='SUPERSEDED' WHERE id=$1",[event.active_revision_id]);
  await tx.rows("UPDATE event_revisions SET state='PUBLISHED',published_at=now() WHERE id=$1",[revisionId]);
  await tx.rows("UPDATE events SET active_revision_id=$2,status='PUBLISHED' WHERE id=$1",[eventId,revisionId]);
  await audit(tx,actor,'EVENT_PUBLISHED','event_revision',revisionId,event.edition_id,eventId);
  return {status:'PUBLISHED'};
}
export async function changeEventState(tx: Tx, actor: string, eventId: string, next: string, reason: string) {
  const {event}=await scopedEvent(tx,actor,eventId,EDITORS);
  const transitions: Record<string,string[]>= {PUBLISHED:['LIVE','CANCELLED'],LIVE:['ENDED','CANCELLED'],ENDED:['COMPLETED'],COMPLETED:['ARCHIVED'],CANCELLED:['ARCHIVED'],REJECTED:['DRAFT']};
  if (!transitions[event.status]?.includes(next)) throw new ApiError(409,'INVALID_TRANSITION');
  if (!['LIVE','ENDED'].includes(next)) await requireGrant(tx,actor,ADMINS,event.edition_id,eventId);
  if (next==='LIVE') {
    const v=must(await tx.one('SELECT starts_at,ends_at FROM event_revisions WHERE id=$1',[event.active_revision_id]));
    if (Date.now()<+v.starts_at || Date.now()>+v.ends_at) throw new ApiError(409,'OUTSIDE_EVENT_WINDOW');
  }
  await tx.rows("UPDATE events SET status=$2,registration_state='CLOSED' WHERE id=$1",[eventId,next]);
  if (['CANCELLED','ARCHIVED'].includes(next)) {
    await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=now(),revoked_reason=$2 WHERE event_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[eventId,reason]);
  }
  await audit(tx,actor,'EVENT_STATE_CHANGED','event',eventId,event.edition_id,eventId,{from:event.status,to:next,reason});
  return {status:next};
}
export async function activateEdition(tx: Tx, actor: string, editionId: string) {
  await requireGrant(tx,actor,OWNERS);
  const ed=must(await tx.one('SELECT * FROM editions WHERE id=$1 FOR UPDATE',[editionId]));
  if (ed.state!=='READY') throw new ApiError(409,'EDITION_NOT_READY');
  if (await tx.one("SELECT id FROM editions WHERE state='ACTIVE' AND id<>$1",[editionId])) throw new ApiError(409,'CLOSE_CURRENT_EDITION_FIRST');
  await tx.rows("UPDATE editions SET state='ACTIVE',admissions_open=true WHERE id=$1",[editionId]);
  await audit(tx,actor,'EDITION_ACTIVATED','edition',editionId,editionId);
  return {state:'ACTIVE'};
}
export async function closeEdition(tx: Tx, actor: string, editionId: string, reason: string) {
  await requireGrant(tx,actor,OWNERS);
  const ed=must(await tx.one('SELECT * FROM editions WHERE id=$1 FOR UPDATE',[editionId]));
  if (ed.state!=='ACTIVE') throw new ApiError(409,'INVALID_TRANSITION');
  await tx.rows("UPDATE editions SET state='CLOSED',admissions_open=false WHERE id=$1",[editionId]);
  await tx.rows(`UPDATE role_assignments SET revoked_at=now() WHERE edition_id=$1 AND revoked_at IS NULL
    AND role_code=ANY($2::text[])`,[editionId,[ROLE.coordinator,ROLE.scanner,ROLE.core]]);
  await audit(tx,actor,'EDITION_CLOSED_STUDENT_ACCESS_REVOKED','edition',editionId,editionId,null,{reason});
  return {state:'CLOSED'};
}
