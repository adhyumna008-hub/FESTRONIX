import { z } from 'zod';
export const uuid = z.uuid();
export const reason = z.string().trim().min(5).max(1000);
export const date = z.iso.datetime({ offset: true });
export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(100);
export const empty = z.strictObject({});
export const eventInput = z.strictObject({
  title: z.string().trim().min(3).max(160), description: z.string().min(10).max(10000), category: z.string().min(1).max(80), venue: z.string().min(1).max(200),
  starts_at: date, ends_at: date, registration_opens: date, registration_deadline: date, checkin_opens: date, checkin_closes: date,
  capacity: z.number().int().min(1).max(100000), waitlist_enabled: z.boolean().default(false), walkins_allowed: z.boolean().default(false),
  waitlist_offer_minutes: z.number().int().min(15).max(1440).default(120),
  mode: z.enum(['SOLO','TEAM']), team_min: z.number().int().min(1).max(100), team_max: z.number().int().min(1).max(100),
  team_edit_deadline: date, late_substitution_policy: z.string().min(1).max(1000).default('FACULTY_REVIEW'), clash_behavior: z.enum(['WARN','BLOCK']).default('WARN'),
  fee_paise: z.number().int().min(0).max(10000000).default(0), payment_instructions: z.string().min(1).max(2000).nullable().default(null),
  payment_hold_minutes: z.number().int().min(30).max(10080).default(1440), allow_non_students: z.boolean().default(false),
  institution_types: z.array(z.enum(['COLLEGE','UNIVERSITY'])).min(1).max(2).default(['COLLEGE','UNIVERSITY']),
  allowed_colleges: z.array(z.string().trim().min(1).max(160)).max(100).default([]),
  academic_years: z.array(z.number().int().min(1).max(12)).max(12).default([]), branches: z.array(z.string().trim().min(1).max(120)).max(100).default([]),
  minimum_age: z.number().int().min(10).max(100).nullable().default(null), id_check_required: z.boolean().default(false),
  rules: z.string().max(10000).default(''), certificate_policy: z.enum(['NONE','ATTENDEES','WINNERS','BOTH']).default('NONE'),
});
export type EventInput = z.infer<typeof eventInput>;
export const eventColumns = Object.keys(eventInput.shape);
export function validateEvent(v: EventInput) {
  if (Date.parse(v.ends_at)<=Date.parse(v.starts_at) || Date.parse(v.registration_deadline)<=Date.parse(v.registration_opens)
    || Date.parse(v.registration_deadline)>Date.parse(v.starts_at) || Date.parse(v.team_edit_deadline)>Date.parse(v.starts_at)
    || Date.parse(v.checkin_closes)<=Date.parse(v.checkin_opens) || Date.parse(v.checkin_closes)>Date.parse(v.ends_at)
    || v.team_min>v.team_max || (v.mode==='SOLO' && (v.team_min!==1 || v.team_max!==1)) || (v.fee_paise>0 && !v.payment_instructions)) {
    throw new Error('INVALID_EVENT_POLICY');
  }
}
export const scanBody = z.strictObject({ token: z.string().min(1).max(256), override: z.boolean().default(false), reason: reason.optional(),
  identity_checked: z.boolean().default(false), device_label: z.string().max(80).optional() });
export const pageQuery = z.strictObject({ limit: z.coerce.number().int().min(1).max(100).default(50), offset: z.coerce.number().int().min(0).max(100000).default(0) });
