import { ApiError, Tx, must } from './db.js';

export const ROLE = {
  primary: 'PRIMARY_FACULTY_OWNER', backup: 'BACKUP_FACULTY_OWNER', admin: 'FACULTY_ADMIN',
  approver: 'FACULTY_APPROVER', core: 'CORE_TEAM', coordinator: 'EVENT_COORDINATOR', scanner: 'VOLUNTEER_SCANNER', participant: 'PARTICIPANT',
} as const;
export const OWNERS = [ROLE.primary, ROLE.backup];
export const ADMINS = [...OWNERS, ROLE.admin];
export const APPROVERS = [...ADMINS, ROLE.approver];
export const EDITORS = [...ADMINS, ROLE.coordinator];
export const SCANNERS = [...EDITORS, ROLE.scanner];
export type Grant = { id: string; role_code: string };
export async function grant(tx: Tx, user: string, roles: readonly string[], edition?: string, event?: string): Promise<Grant | undefined> {
  return tx.one<Grant>(`SELECT a.id,a.role_code FROM role_assignments a JOIN users u ON u.id=a.user_id
    JOIN roles r ON r.code=a.role_code LEFT JOIN editions ed ON ed.id=a.edition_id
    WHERE a.user_id=$1 AND a.role_code=ANY($2::text[]) AND a.revoked_at IS NULL AND u.disabled_at IS NULL
    AND a.starts_at<=now() AND (a.expires_at IS NULL OR a.expires_at>now())
    AND ((r.scope='GLOBAL') OR (a.edition_id=$3 AND ed.state NOT IN ('ARCHIVED','CANCELLED')
      AND (a.event_id IS NULL OR a.event_id=$4)))
    ORDER BY CASE WHEN r.scope='GLOBAL' THEN 0 WHEN r.scope='EDITION' THEN 1 ELSE 2 END LIMIT 1`,
    [user, roles, edition ?? null, event ?? null]);
}
export async function requireGrant(tx: Tx, user: string, roles: readonly string[], edition?: string, event?: string) {
  const g = await grant(tx,user,roles,edition,event);
  if (!g) throw new ApiError(403,'NOT_AUTHORIZED');
  return g;
}
export async function scopedEvent(tx: Tx, user: string, eventId: string, roles: readonly string[], lock = true) {
  // Scope checked before any event data is returned, including existence metadata.
  const assignment = await tx.one(`SELECT edition_id FROM events WHERE id=$1`, [eventId]);
  if (!assignment) throw new ApiError(403,'NOT_AUTHORIZED');
  const g = await requireGrant(tx,user,roles,assignment.edition_id,eventId);
  const event = must(await tx.one(`SELECT * FROM events WHERE id=$1 ${lock ? 'FOR UPDATE' : ''}`, [eventId]));
  return { event, g };
}
export async function participantRegistration(tx: Tx, user: string, id: string) {
  return must(await tx.one(`SELECT r.* FROM registrations r JOIN registration_members m ON m.registration_id=r.id
    WHERE r.id=$1 AND m.user_id=$2`, [id,user]));
}
