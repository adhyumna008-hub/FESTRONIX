import { ApiError, Tx, audit, must } from './db.js';
import { lockedEvent, admissions, checkMembers } from './registrations.js';
import { ADMINS, requireGrant } from './permissions.js';

export async function createTeam(tx: Tx,actor: string,eventId: string,name: string) {
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  if (v.mode!=='TEAM') throw new ApiError(409,'NOT_TEAM_EVENT');
  await checkMembers(tx,eventId,v,[actor]);
  if (await tx.one('SELECT id FROM registration_members WHERE event_id=$1 AND user_id=$2 AND withdrawn_at IS NULL',[eventId,actor])) throw new ApiError(409,'ALREADY_REGISTERED');
  const t=(await tx.one('INSERT INTO teams(edition_id,event_id,name,captain_id) VALUES($1,$2,$3,$4) RETURNING *',[e.edition_id,eventId,name,actor]))!;
  await tx.rows('INSERT INTO team_members(team_id,event_id,edition_id,user_id) VALUES($1,$2,$3,$4)',[t.id,eventId,e.edition_id,actor]);
  await audit(tx,actor,'TEAM_CREATED','team',t.id,e.edition_id,eventId);
  return t;
}
export async function invite(tx: Tx,actor: string,eventId: string,teamId: string,userId: string) {
  const {e,v,ed}=await lockedEvent(tx,eventId); admissions(e,v,ed);
  must(await tx.one('SELECT id FROM teams WHERE id=$1 AND event_id=$2 AND captain_id=$3',[teamId,eventId,actor]));
  if (Date.now()>=+v.team_edit_deadline) throw new ApiError(409,'TEAM_EDIT_DEADLINE');
  if (await tx.one('SELECT id FROM registrations WHERE team_id=$1',[teamId])) throw new ApiError(409,'STAFF_TEAM_CHANGE_REQUIRED');
  // UUID invitation avoids a searchable email/participant directory.
  must(await tx.one('SELECT id FROM users WHERE id=$1 AND disabled_at IS NULL',[userId]));
  const invitation=(await tx.one(`INSERT INTO team_invitations(team_id,invited_user_id,invited_by,expires_at)
    VALUES($1,$2,$3,least(now()+interval '48 hours',$4)) RETURNING id,team_id,expires_at`,[teamId,userId,actor,v.team_edit_deadline]))!;
  await audit(tx,actor,'TEAM_INVITED','team',teamId,e.edition_id,eventId);
  return invitation;
}
export async function acceptInvitation(tx: Tx,actor: string,invitationId: string) {
  const invitation=must(await tx.one(`SELECT i.*,t.event_id FROM team_invitations i JOIN teams t ON t.id=i.team_id WHERE i.id=$1 AND i.invited_user_id=$2`,[invitationId,actor]));
  const {e,v,ed}=await lockedEvent(tx,invitation.event_id); admissions(e,v,ed);
  if (invitation.accepted_at) return {accepted:true};
  if (Date.now()>=+invitation.expires_at || Date.now()>=+v.team_edit_deadline) throw new ApiError(409,'INVITATION_EXPIRED');
  if (await tx.one('SELECT id FROM registrations WHERE team_id=$1',[invitation.team_id])) throw new ApiError(409,'STAFF_TEAM_CHANGE_REQUIRED');
  const size=(await tx.one('SELECT count(*)::int AS n FROM team_members WHERE team_id=$1 AND left_at IS NULL',[invitation.team_id]))!.n;
  if (size>=v.team_max) throw new ApiError(409,'TEAM_FULL');
  if (await tx.one('SELECT id FROM registration_members WHERE event_id=$1 AND user_id=$2 AND withdrawn_at IS NULL',[e.id,actor])) throw new ApiError(409,'ALREADY_REGISTERED');
  await checkMembers(tx,e.id,v,[actor]);
  await tx.rows(`INSERT INTO team_members(team_id,event_id,edition_id,user_id) VALUES($1,$2,$3,$4)
    ON CONFLICT(team_id,user_id) DO UPDATE SET left_at=NULL,accepted_at=now()`,[invitation.team_id,e.id,e.edition_id,actor]);
  await tx.rows('UPDATE team_invitations SET accepted_at=now() WHERE id=$1',[invitationId]);
  await audit(tx,actor,'TEAM_INVITATION_ACCEPTED','team',invitation.team_id,e.edition_id,e.id);
  return {accepted:true};
}
export async function leaveTeam(tx: Tx,actor: string,eventId: string,teamId: string,reason: string) {
  const {e}=await lockedEvent(tx,eventId);
  const team=must(await tx.one(`SELECT t.* FROM teams t JOIN team_members m ON m.team_id=t.id WHERE t.id=$1 AND t.event_id=$2 AND m.user_id=$3 AND m.left_at IS NULL`,[teamId,eventId,actor]));
  if (team.captain_id===actor) throw new ApiError(409,'CAPTAIN_TRANSFER_OR_CANCELLATION_REQUIRED');
  if (['ENDED','COMPLETED','CANCELLED','ARCHIVED'].includes(e.status)) throw new ApiError(409,'EVENT_CLOSED');
  // Withdrawal remains possible; competitive replacements during LIVE are not.
  await tx.rows('UPDATE team_members SET left_at=now() WHERE team_id=$1 AND user_id=$2',[teamId,actor]);
  const r=await tx.one("SELECT * FROM registrations WHERE team_id=$1 AND status NOT IN ('CANCELLED','REJECTED')",[teamId]);
  if (r) {
    await tx.rows('UPDATE registration_members SET withdrawn_at=now() WHERE registration_id=$1 AND user_id=$2',[r.id,actor]);
    // Preserve slot until faculty reconciles a confirmed team, even when remaining size is valid.
    if (['CONFIRMED','ACTION_REQUIRED'].includes(r.status)) await tx.rows("UPDATE registrations SET status='ACTION_REQUIRED',reason=$2 WHERE id=$1",[r.id,reason]);
    await tx.rows("UPDATE tickets SET status='REVOKED',revoked_at=now(),revoked_reason='Team roster requires reconciliation' WHERE registration_id=$1 AND status IN ('ACTIVE','CHECKED_IN')",[r.id]);
  }
  await audit(tx,actor,'TEAM_MEMBER_WITHDREW','team',teamId,e.edition_id,eventId,{reason});
  return {withdrawn:true,staff_reconciliation_required:!!r};
}
export async function reconcileTeam(tx: Tx,actor: string,eventId: string,teamId: string,reason: string) {
  const {e,v}=await lockedEvent(tx,eventId);
  await requireGrant(tx,actor,ADMINS,e.edition_id,eventId);
  if (e.status!=='PUBLISHED') throw new ApiError(409,'ROSTER_LOCKED');
  const r=must(await tx.one("SELECT * FROM registrations WHERE team_id=$1 AND event_id=$2 AND status='ACTION_REQUIRED'",[teamId,eventId]));
  const members=(await tx.rows('SELECT user_id FROM registration_members WHERE registration_id=$1 AND withdrawn_at IS NULL',[r.id])).map(m=>m.user_id);
  if (members.length<v.team_min || members.length>v.team_max) throw new ApiError(409,'TEAM_SIZE_INVALID');
  await checkMembers(tx,eventId,v,members,r.id);
  await tx.rows("UPDATE registrations SET status='CONFIRMED',reason=$2 WHERE id=$1",[r.id,reason]);
  await audit(tx,actor,'TEAM_RECONCILED','team',teamId,e.edition_id,eventId,{reason});
  return {status:'CONFIRMED',ticket_reissue_required:true};
}

export async function proposeCaptain(tx: Tx,actor: string,eventId: string,teamId: string,newCaptain: string) {
  const {e,v}=await lockedEvent(tx,eventId);
  if (e.status!=='PUBLISHED' || Date.now()>=+v.team_edit_deadline) throw new ApiError(409,'CAPTAIN_CHANGE_REQUIRES_FACULTY');
  must(await tx.one('SELECT id FROM teams WHERE id=$1 AND event_id=$2 AND captain_id=$3',[teamId,eventId,actor]));
  if (newCaptain===actor) throw new ApiError(400,'ALREADY_CAPTAIN');
  must(await tx.one('SELECT user_id FROM team_members WHERE team_id=$1 AND user_id=$2 AND left_at IS NULL',[teamId,newCaptain]));
  await tx.rows('UPDATE teams SET transfer_to=$2,transfer_expires_at=least(now()+interval \'24 hours\',$3) WHERE id=$1',[teamId,newCaptain,v.team_edit_deadline]);
  await audit(tx,actor,'CAPTAIN_TRANSFER_PROPOSED','team',teamId,e.edition_id,eventId,{new_captain_id:newCaptain});
  return {acceptance_required:true};
}
export async function acceptCaptain(tx: Tx,actor: string,eventId: string,teamId: string) {
  const {e,v}=await lockedEvent(tx,eventId);
  if (e.status!=='PUBLISHED' || Date.now()>=+v.team_edit_deadline) throw new ApiError(409,'CAPTAIN_CHANGE_REQUIRES_FACULTY');
  const team=must(await tx.one('SELECT * FROM teams WHERE id=$1 AND event_id=$2 AND transfer_to=$3 AND transfer_expires_at>now()',[teamId,eventId,actor]));
  must(await tx.one('SELECT user_id FROM team_members WHERE team_id=$1 AND user_id=$2 AND left_at IS NULL',[teamId,actor]));
  await tx.rows('UPDATE teams SET captain_id=$2,transfer_to=NULL,transfer_expires_at=NULL WHERE id=$1',[teamId,actor]);
  // Financial submission ownership stays with the original payer. Team leadership
  // never silently transfers access to another person's proof images.
  await audit(tx,actor,'CAPTAIN_TRANSFER_ACCEPTED','team',teamId,e.edition_id,eventId,{previous_captain_id:team.captain_id});
  return {captain_id:actor};
}
