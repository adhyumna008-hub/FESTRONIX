import Fastify, { LogController, type FastifyInstance, type FastifyReply, type FastifyRequest, type HTTPMethods } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import { z } from 'zod';
import { ApiError, audit, must, transaction, type Pool, type Tx } from './db.js';
import { authenticate, resolveUser, type IdentityVerifier } from './auth.js';
import { ADMINS, APPROVERS, EDITORS, OWNERS, ROLE, SCANNERS, grant, requireGrant, scopedEvent } from './permissions.js';
import { date, empty, eventInput, pageQuery, reason, scanBody, slug, uuid } from './schemas.js';
import * as events from './events.js';
import * as registrations from './registrations.js';
import * as teams from './teams.js';
import * as payments from './payments.js';
import * as tickets from './tickets.js';
import type { ProofStore } from './storage.js';

type Context = { tx: Tx; actor: string; params: Record<string,string>; request: FastifyRequest; reply: FastifyReply };
interface Dependencies { pool: Pool; verifier: IdentityVerifier; proofStore: ProofStore; logging?: boolean; rateLimitMax?: number }

export async function buildApp(deps: Dependencies): Promise<FastifyInstance> {
  const app=Fastify({logger:deps.logging ? {level:'info',redact:['req.headers.authorization','req.headers.cookie','res.headers["set-cookie"]'],
    serializers:{req:(req)=>({method:req.method,url:String(req.url).split('?')[0]}),err:()=>({type:'Error',message:'Request failed',stack:''})}} : false,
    logController:new LogController({disableRequestLogging:true}),bodyLimit:3_000_000,trustProxy:false,
    ajv:{customOptions:{removeAdditional:false,coerceTypes:false}}});
  await app.register(helmet);
  await app.register(rateLimit,{max:deps.rateLimitMax??120,timeWindow:'1 minute'});
  await app.register(swagger,{openapi:{info:{title:'FESTRONIX backend',version:'0.1.0'},components:{securitySchemes:{firebase:{type:'http',scheme:'bearer'}}}}});
  app.addHook('onSend',async (_request,reply,payload)=>{reply.header('Cache-Control','no-store');return payload;});
  app.setErrorHandler((error: any,request,reply)=>{
    const validation=error instanceof z.ZodError || error.validation;
    const databaseCode=error.code;
    const status=error instanceof ApiError?error.status:validation?400:
      ['23505','23514','23503','23P01'].includes(databaseCode)?409:['55P03','57014','40001','40P01'].includes(databaseCode)?503:
      error.statusCode===429?429:error.statusCode===413?413:error.statusCode===400?400:500;
    const code=error instanceof ApiError?error.code:validation?'VALIDATION_ERROR':status===409?'DATA_CONFLICT':status===503?'RETRY_REQUEST':status===429?'RATE_LIMITED':status===413?'PAYLOAD_TOO_LARGE':status===400?'BAD_REQUEST':'INTERNAL_ERROR';
    if (status===500) app.log.error({requestId:request.id,code:'INTERNAL_ERROR'},'Request failed');
    const fields=error instanceof z.ZodError ? error.issues.map(i=>({path:i.path.join('.'),message:i.message})):undefined;
    reply.code(status).send({error:{code,message:error instanceof ApiError?error.message:code,fields},request_id:request.id});
  });
  app.get('/health',async()=>({status:'ok'}));
  app.get('/ready',async(_req,reply)=>{try {await deps.pool.query('SELECT 1');return {status:'ready'};} catch {return reply.code(503).send({status:'unavailable'});} });
  app.get('/api/v1/openapi.json',{schema:{hide:true}},async()=>app.swagger());

  function route<S extends z.ZodType>(method: HTTPMethods,path: string,schema:S,handler:(ctx:Context,body:z.infer<S>)=>Promise<unknown>,options:{exclusive?:boolean;public?:boolean;query?:boolean}={}) {
    const params=Object.fromEntries([...path.matchAll(/:([A-Za-z]+)/g)].map(m=>[m[1],uuid]));
    app.route({method,url:'/api/v1'+path,schema:{tags:[path.split('/')[1]],security:options.public?[]:[{firebase:[]}],
      ...(Object.keys(params).length?{params:z.toJSONSchema(z.strictObject(params),{target:'draft-7'})}:{}),
      ...(!['GET','DELETE'].includes(method)?{body:z.toJSONSchema(schema,{target:'draft-7'})}:{})},
      handler:async(request,reply)=>{
        const identity=options.public?null:await authenticate(request.headers.authorization,deps.verifier);
        const body=schema.parse(options.query?request.query:(request.body??{}));
        return transaction(deps.pool,async tx=>{
          const actor=identity?await resolveUser(tx,identity):'';
          return handler({tx,actor,params:request.params as Record<string,string>,request,reply},body);
        },options.exclusive);
      }});
  }
  route('GET','/me',empty,async({tx,actor})=>({user:await tx.one(`SELECT id,display_name,email,is_student,institution,institution_type,academic_year,branch,age_years FROM users WHERE id=$1`,[actor]),
    assignments:await tx.rows(`SELECT id,role_code,edition_id,event_id,expires_at FROM role_assignments WHERE user_id=$1 AND revoked_at IS NULL AND starts_at<=now() AND (expires_at IS NULL OR expires_at>now())`,[actor])}));
  const profile=z.strictObject({display_name:z.string().trim().min(1).max(120),is_student:z.boolean(),institution:z.string().trim().min(1).max(160).nullable(),
    institution_type:z.enum(['COLLEGE','UNIVERSITY']).nullable(),academic_year:z.number().int().min(1).max(12).nullable(),branch:z.string().trim().min(1).max(120).nullable(),age_years:z.number().int().min(10).max(100).nullable()});
  route('PUT','/me/profile',profile,async({tx,actor},b)=>{
    const keys=Object.keys(b);
    await tx.rows(`UPDATE users SET ${keys.map((k,i)=>`${k}=$${i+2}`).join(',')} WHERE id=$1`,[actor,...Object.values(b)]);
    return {updated:true};
  });
  route('GET','/me/registrations',pageQuery,async({tx,actor},q)=>tx.rows(`SELECT r.id,r.code,r.edition_id,r.event_id,r.team_id,r.status,r.hold_expires_at,r.offer_expires_at,r.reason,m.id AS member_id,m.withdrawn_at
    FROM registrations r JOIN registration_members m ON m.registration_id=r.id WHERE m.user_id=$1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`,[actor,q.limit,q.offset]),{query:true});
  route('GET','/me/invitations',pageQuery,async({tx,actor},q)=>tx.rows(`SELECT i.id,i.team_id,t.name,t.event_id,i.expires_at,i.accepted_at FROM team_invitations i JOIN teams t ON t.id=i.team_id WHERE i.invited_user_id=$1 ORDER BY i.created_at DESC LIMIT $2 OFFSET $3`,[actor,q.limit,q.offset]),{query:true});
  route('POST','/invitations/:invitationId/accept',empty,async(c)=>teams.acceptInvitation(c.tx,c.actor,c.params.invitationId));
  route('GET','/me/teams',pageQuery,async({tx,actor},q)=>tx.rows(`SELECT t.id,t.event_id,t.edition_id,t.name,t.captain_id,t.transfer_to,t.transfer_expires_at
    FROM teams t JOIN team_members m ON m.team_id=t.id WHERE m.user_id=$1 AND m.left_at IS NULL ORDER BY t.created_at DESC LIMIT $2 OFFSET $3`,[actor,q.limit,q.offset]),{query:true});
  route('GET','/me/tickets',pageQuery,async({tx,actor},q)=>tx.rows(`SELECT t.id,t.code,t.event_id,t.edition_id,t.member_id,t.status,t.expires_at
    FROM tickets t JOIN registration_members m ON m.id=t.member_id WHERE m.user_id=$1 ORDER BY t.issued_at DESC LIMIT $2 OFFSET $3`,[actor,q.limit,q.offset]),{query:true});
  route('GET','/me/payments',pageQuery,async({tx,actor},q)=>tx.rows(`SELECT p.id,p.registration_id,p.event_id,p.status,p.review_reason,p.reviewed_at,p.created_at
    FROM payment_submissions p JOIN registrations r ON r.id=p.registration_id WHERE r.applicant_id=$1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,[actor,q.limit,q.offset]),{query:true});
  route('GET','/me/proofs/:proofId',empty,async({tx,actor,params,reply})=>{
    const p=must(await tx.one('SELECT * FROM proof_objects WHERE id=$1 AND owner_id=$2',[params.proofId,actor]));
    reply.header('Content-Type',p.media_type).header('Content-Disposition','attachment; filename="payment-proof"').header('X-Content-Type-Options','nosniff');
    return deps.proofStore.read(p.storage_key);
  });
  route('GET','/editions',pageQuery,async({tx},q)=>tx.rows(`SELECT id,slug,display_name,starts_at,ends_at,timezone,state,admissions_open,theme FROM editions
    WHERE state IN ('ACTIVE','CLOSED','ARCHIVED') ORDER BY starts_at DESC LIMIT $1 OFFSET $2`,[q.limit,q.offset]),{public:true,query:true});
  route('GET','/editions/:editionId/staff',pageQuery,async({tx,actor,params},q)=>{
    await requireGrant(tx,actor,ADMINS,params.editionId);
    return tx.rows(`SELECT a.id,a.user_id,u.display_name,a.role_code,a.event_id,a.starts_at,a.expires_at,a.revoked_at FROM role_assignments a
      JOIN users u ON u.id=a.user_id WHERE a.edition_id=$1 ORDER BY a.created_at DESC LIMIT $2 OFFSET $3`,[params.editionId,q.limit,q.offset]);
  },{query:true});
  route('POST','/editions/:editionId/staff-user-lookup',z.strictObject({firebase_uid:z.string().min(1).max(128),reason}),async({tx,actor,params},b)=>{
    await requireGrant(tx,actor,ADMINS,params.editionId);
    const u=must(await tx.one("SELECT u.id,u.display_name FROM users u JOIN identities i ON i.user_id=u.id WHERE i.provider='FIREBASE' AND i.subject=$1 AND u.disabled_at IS NULL",[b.firebase_uid]));
    await audit(tx,actor,'STAFF_IDENTITY_LOOKUP','user',u.id,params.editionId,null,{reason:b.reason});return u;
  });

  route('POST','/editions',z.strictObject({slug,display_name:z.string().min(3).max(100),starts_at:date,ends_at:date}),async({tx,actor},b)=>{
    await requireGrant(tx,actor,OWNERS);
    const ed=(await tx.one('INSERT INTO editions(slug,display_name,starts_at,ends_at,created_by) VALUES($1,$2,$3,$4,$5) RETURNING *',[b.slug,b.display_name,b.starts_at,b.ends_at,actor]))!;
    await audit(tx,actor,'EDITION_CREATED','edition',ed.id,ed.id);return ed;
  },{exclusive:true});
  route('POST','/editions/:editionId/ready',z.strictObject({reason}),async({tx,actor,params},b)=>{
    await requireGrant(tx,actor,OWNERS);
    const ed=must(await tx.one("UPDATE editions SET state='READY' WHERE id=$1 AND state='PREPARATION' RETURNING id",[params.editionId]),'INVALID_TRANSITION',409);
    await audit(tx,actor,'EDITION_READY','edition',ed.id,ed.id,null,{reason:b.reason});return {state:'READY'};
  },{exclusive:true});
  route('POST','/editions/:editionId/activate',empty,c=>events.activateEdition(c.tx,c.actor,c.params.editionId),{exclusive:true});
  route('POST','/editions/:editionId/close',z.strictObject({reason}),(c,b)=>events.closeEdition(c.tx,c.actor,c.params.editionId,b.reason),{exclusive:true});
  route('POST','/editions/:editionId/archive',z.strictObject({reason}),async({tx,actor,params},b)=>{
    await requireGrant(tx,actor,OWNERS);
    if (await tx.one("SELECT id FROM events WHERE edition_id=$1 AND status NOT IN ('COMPLETED','CANCELLED','ARCHIVED','REJECTED') LIMIT 1",[params.editionId])) throw new ApiError(409,'EVENT_CLOSEOUT_REQUIRED');
    const ed=must(await tx.one("UPDATE editions SET state='ARCHIVED',admissions_open=false WHERE id=$1 AND state='CLOSED' RETURNING id",[params.editionId]),'INVALID_TRANSITION',409);
    await tx.rows('UPDATE role_assignments SET revoked_at=now() WHERE edition_id=$1 AND revoked_at IS NULL',[ed.id]);
    await audit(tx,actor,'EDITION_ARCHIVED_ACCESS_REVOKED','edition',ed.id,ed.id,null,{reason:b.reason});return {state:'ARCHIVED'};
  },{exclusive:true});
  route('GET','/editions/:editionId/events',pageQuery,async({tx,params},q)=>tx.rows(`SELECT e.id,e.edition_id,e.slug,e.status,e.registration_state,v.title,v.description,v.category,v.venue,v.starts_at,v.ends_at,
    v.registration_opens,v.registration_deadline,v.capacity,v.mode,v.team_min,v.team_max,v.fee_paise,v.waitlist_enabled,v.walkins_allowed,v.rules,v.certificate_policy,
    v.allow_non_students,v.institution_types,v.allowed_colleges,v.academic_years,v.branches,v.minimum_age,v.id_check_required,v.payment_instructions,v.payment_hold_minutes,v.waitlist_offer_minutes
    FROM events e JOIN event_revisions v ON v.id=e.active_revision_id JOIN editions ed ON ed.id=e.edition_id
    WHERE e.edition_id=$1 AND ed.state IN ('ACTIVE','CLOSED','ARCHIVED') AND e.status IN ('PUBLISHED','LIVE','ENDED','COMPLETED','CANCELLED','ARCHIVED')
    ORDER BY v.starts_at,e.id LIMIT $2 OFFSET $3`,[params.editionId,q.limit,q.offset]),{public:true,query:true});
  route('POST','/editions/:editionId/events',z.strictObject({slug,details:eventInput}),async({tx,actor,params},b)=>{
    await requireGrant(tx,actor,ADMINS,params.editionId);
    const ed=must(await tx.one('SELECT state FROM editions WHERE id=$1',[params.editionId]));
    if (!['PREPARATION','READY','ACTIVE'].includes(ed.state)) throw new ApiError(409,'EDITION_CLOSED');
    const e=(await tx.one('INSERT INTO events(edition_id,slug,created_by) VALUES($1,$2,$3) RETURNING *',[params.editionId,b.slug,actor]))!;
    const revision=await events.createRevision(tx,actor,e.id,b.details);return {event:e,revision};
  });
  route('GET','/events/:eventId/preview',empty,async({tx,actor,params})=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,[...APPROVERS,ROLE.coordinator]);
    return {event,revisions:await tx.rows('SELECT * FROM event_revisions WHERE event_id=$1 ORDER BY version DESC LIMIT 50',[event.id]),
      sessions:await tx.rows('SELECT s.* FROM event_sessions s JOIN event_revisions v ON v.id=s.revision_id WHERE v.event_id=$1 ORDER BY v.version DESC,s.starts_at LIMIT 500',[event.id])};
  });
  route('POST','/events/:eventId/revisions/:revisionId/sessions',z.strictObject({label:z.string().min(1).max(160),venue:z.string().min(1).max(200),starts_at:date,ends_at:date}),async({tx,actor,params},b)=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,EDITORS);
    const v=must(await tx.one('SELECT * FROM event_revisions WHERE id=$1 AND event_id=$2',[params.revisionId,event.id]));
    if (v.state!=='DRAFT' || !['DRAFT','CHANGES_REQUESTED','APPROVED','PUBLISHED'].includes(event.status)) throw new ApiError(409,'REVISION_NOT_DRAFT');
    if (Date.parse(b.starts_at)<+v.starts_at || Date.parse(b.ends_at)>+v.ends_at || Date.parse(b.ends_at)<=Date.parse(b.starts_at)) throw new ApiError(400,'INVALID_SESSION_WINDOW');
    const row=(await tx.one('INSERT INTO event_sessions(revision_id,label,venue,starts_at,ends_at) VALUES($1,$2,$3,$4,$5) RETURNING *',[v.id,b.label,b.venue,b.starts_at,b.ends_at]))!;
    await audit(tx,actor,'EVENT_SESSION_CREATED','event_session',row.id,event.edition_id,event.id);return row;
  });
  route('GET','/events/:eventId/sessions',empty,async({tx,params})=>tx.rows(`SELECT s.id,s.label,s.venue,s.starts_at,s.ends_at FROM event_sessions s JOIN events e ON e.active_revision_id=s.revision_id JOIN editions ed ON ed.id=e.edition_id
    WHERE e.id=$1 AND ed.state IN ('ACTIVE','CLOSED','ARCHIVED') AND e.status IN ('PUBLISHED','LIVE','ENDED','COMPLETED','CANCELLED','ARCHIVED') ORDER BY s.starts_at`,[params.eventId]),{public:true});
  route('POST','/events/:eventId/revisions',eventInput,(c,b)=>events.createRevision(c.tx,c.actor,c.params.eventId,b));
  route('POST','/events/:eventId/revisions/:revisionId/submit',empty,c=>events.submitRevision(c.tx,c.actor,c.params.eventId,c.params.revisionId));
  route('POST','/events/:eventId/revisions/:revisionId/review',z.strictObject({decision:z.enum(['APPROVED','CHANGES_REQUESTED','REJECTED']),reason}),(c,b)=>events.reviewRevision(c.tx,c.actor,c.params.eventId,c.params.revisionId,b.decision,b.reason));
  route('POST','/events/:eventId/revisions/:revisionId/publish',empty,c=>events.publishRevision(c.tx,c.actor,c.params.eventId,c.params.revisionId));
  route('POST','/events/:eventId/state',z.strictObject({state:z.enum(['LIVE','ENDED','COMPLETED','CANCELLED','ARCHIVED','DRAFT']),reason}),(c,b)=>events.changeEventState(c.tx,c.actor,c.params.eventId,b.state,b.reason));
  route('POST','/events/:eventId/admissions',z.strictObject({state:z.enum(['OPEN','PAUSED','CLOSED']),reason}),async({tx,actor,params},b)=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,EDITORS);
    if (!['PUBLISHED','LIVE'].includes(event.status)) throw new ApiError(409,'EVENT_CLOSED');
    if (b.state==='OPEN') {
      await requireGrant(tx,actor,ADMINS,event.edition_id,event.id);
      const {e,v,ed}=await registrations.lockedEvent(tx,event.id);registrations.admissions({...e,registration_state:'OPEN'},v,ed);
    }
    await tx.rows('UPDATE events SET registration_state=$2 WHERE id=$1',[event.id,b.state]);
    await audit(tx,actor,'ADMISSIONS_CHANGED','event',event.id,event.edition_id,event.id,{state:b.state,reason:b.reason});return {state:b.state};
  });

  const assignment=z.strictObject({user_id:uuid,role:z.enum(['FACULTY_ADMIN','FACULTY_APPROVER','CORE_TEAM','EVENT_COORDINATOR','VOLUNTEER_SCANNER']),edition_id:uuid,event_id:uuid.optional(),expires_at:date,reason});
  route('POST','/role-assignments',assignment,async({tx,actor},b)=>{
    await requireGrant(tx,actor,b.role==='FACULTY_ADMIN'||b.role==='FACULTY_APPROVER'?OWNERS:ADMINS,b.edition_id);
    if (b.user_id===actor) throw new ApiError(403,'SELF_ASSIGNMENT_PROHIBITED');
    if (Date.parse(b.expires_at)<=Date.now()) throw new ApiError(400,'INVALID_EXPIRY');
    if (['EVENT_COORDINATOR','VOLUNTEER_SCANNER'].includes(b.role)!==!!b.event_id) throw new ApiError(400,'INVALID_SCOPE');
    const ed=must(await tx.one('SELECT state FROM editions WHERE id=$1',[b.edition_id]));
    if (['ARCHIVED','CANCELLED'].includes(ed.state)) throw new ApiError(409,'EDITION_CLOSED');
    if (b.event_id) must(await tx.one('SELECT id FROM events WHERE id=$1 AND edition_id=$2',[b.event_id,b.edition_id]));
    const r=(await tx.one(`INSERT INTO role_assignments(user_id,role_code,edition_id,event_id,expires_at,granted_by,reason)
      VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,[b.user_id,b.role,b.edition_id,b.event_id??null,b.expires_at,actor,b.reason]))!;
    await audit(tx,actor,'ROLE_ASSIGNED','role_assignment',r.id,b.edition_id,b.event_id??null,{role:b.role,reason:b.reason});return r;
  },{exclusive:true});
  route('POST','/role-assignments/:assignmentId/revoke',z.strictObject({reason}),async({tx,actor,params},b)=>{
    const r=must(await tx.one('SELECT * FROM role_assignments WHERE id=$1',[params.assignmentId]));
    await requireGrant(tx,actor,[ROLE.coordinator,ROLE.scanner,ROLE.core].includes(r.role_code)?ADMINS:OWNERS,r.edition_id);
    await tx.rows('UPDATE role_assignments SET revoked_at=coalesce(revoked_at,now()) WHERE id=$1',[r.id]);
    await audit(tx,actor,'ROLE_REVOKED','role_assignment',r.id,r.edition_id,r.event_id,{reason:b.reason});return {revoked:true};
  },{exclusive:true});
  route('POST','/ownership/handover',z.strictObject({primary_user_id:uuid,backup_user_id:uuid,reason}),async({tx,actor},b)=>{
    await requireGrant(tx,actor,OWNERS);
    if (b.primary_user_id===b.backup_user_id) throw new ApiError(400,'DISTINCT_CUSTODIANS_REQUIRED');
    const users=await tx.rows('SELECT id FROM users WHERE id=ANY($1::uuid[]) AND disabled_at IS NULL',[ [b.primary_user_id,b.backup_user_id] ]);
    if (users.length!==2) throw new ApiError(400,'INVALID_CUSTODIANS');
    await tx.rows('UPDATE role_assignments SET revoked_at=now() WHERE role_code=ANY($1::text[]) AND revoked_at IS NULL',[OWNERS]);
    for (const [user,role] of [[b.primary_user_id,ROLE.primary],[b.backup_user_id,ROLE.backup]]) await tx.rows('INSERT INTO role_assignments(user_id,role_code,granted_by,reason) VALUES($1,$2,$3,$4)',[user,role,actor,b.reason]);
    await audit(tx,actor,'CUSTODY_HANDOVER','platform','institution',null,null,{primary_user_id:b.primary_user_id,backup_user_id:b.backup_user_id,reason:b.reason});return {updated:true};
  },{exclusive:true});

  route('POST','/events/:eventId/registrations',z.strictObject({team_id:uuid.optional()}),(c,b)=>registrations.register(c.tx,c.actor,c.params.eventId,b.team_id));
  route('GET','/events/:eventId/registrations',pageQuery,async({tx,actor,params},q)=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    return tx.rows('SELECT id,code,team_id,status,confirmed_at,hold_expires_at,created_at FROM registrations WHERE event_id=$1 ORDER BY created_at,id LIMIT $2 OFFSET $3',[params.eventId,q.limit,q.offset]);
  },{query:true});
  route('GET','/events/:eventId/registrations/:registrationId',empty,async({tx,actor,params})=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    const r=must(await tx.one('SELECT id,code,status,team_id,reason FROM registrations WHERE id=$1 AND event_id=$2',[params.registrationId,params.eventId]));
    return {...r,members:await tx.rows(`SELECT m.id,u.display_name,u.institution,m.withdrawn_at FROM registration_members m JOIN users u ON u.id=m.user_id WHERE m.registration_id=$1`,[r.id])};
  });
  route('POST','/events/:eventId/registrations/:registrationId/withdraw',z.strictObject({reason}),(c,b)=>registrations.cancelRegistration(c.tx,c.actor,c.params.eventId,c.params.registrationId,b.reason));
  route('POST','/events/:eventId/registrations/:registrationId/cancel',z.strictObject({reason}),(c,b)=>registrations.cancelRegistration(c.tx,c.actor,c.params.eventId,c.params.registrationId,b.reason,true));
  route('POST','/events/:eventId/registrations/:registrationId/offer',z.strictObject({minutes:z.number().int().min(15).max(1440)}),(c,b)=>registrations.offerWaitlist(c.tx,c.actor,c.params.eventId,c.params.registrationId,b.minutes));
  route('POST','/events/:eventId/registrations/:registrationId/accept-offer',empty,c=>registrations.acceptOffer(c.tx,c.actor,c.params.eventId,c.params.registrationId));
  route('POST','/events/:eventId/waitlist/expire-offers',empty,c=>registrations.expireOffers(c.tx,c.actor,c.params.eventId));
  route('POST','/events/:eventId/teams',z.strictObject({name:z.string().trim().min(2).max(100)}),(c,b)=>teams.createTeam(c.tx,c.actor,c.params.eventId,b.name));
  route('POST','/events/:eventId/teams/:teamId/invitations',z.strictObject({user_id:uuid}),(c,b)=>teams.invite(c.tx,c.actor,c.params.eventId,c.params.teamId,b.user_id));
  route('GET','/events/:eventId/teams/:teamId',empty,async({tx,actor,params})=>{
    const team=must(await tx.one('SELECT id,name,captain_id FROM teams WHERE id=$1 AND event_id=$2',[params.teamId,params.eventId]));
    if (!await tx.one('SELECT user_id FROM team_members WHERE team_id=$1 AND user_id=$2 AND left_at IS NULL',[team.id,actor])) await scopedEvent(tx,actor,params.eventId,EDITORS);
    return {...team,members:await tx.rows('SELECT m.user_id,u.display_name,m.left_at FROM team_members m JOIN users u ON u.id=m.user_id WHERE m.team_id=$1',[team.id])};
  });
  route('POST','/events/:eventId/teams/:teamId/leave',z.strictObject({reason}),(c,b)=>teams.leaveTeam(c.tx,c.actor,c.params.eventId,c.params.teamId,b.reason));
  route('POST','/events/:eventId/teams/:teamId/reconcile',z.strictObject({reason}),(c,b)=>teams.reconcileTeam(c.tx,c.actor,c.params.eventId,c.params.teamId,b.reason));
  route('POST','/events/:eventId/teams/:teamId/captain-transfer',z.strictObject({new_captain_id:uuid}),async(c,b)=>teams.proposeCaptain(c.tx,c.actor,c.params.eventId,c.params.teamId,b.new_captain_id));
  route('POST','/events/:eventId/teams/:teamId/accept-captain',empty,async(c)=>teams.acceptCaptain(c.tx,c.actor,c.params.eventId,c.params.teamId));

  route('POST','/events/:eventId/registrations/:registrationId/proofs',z.strictObject({content_base64:z.string().max(2_800_000),media_type:z.enum(['image/png','image/jpeg'])}),
    (c,b)=>payments.uploadProof(c.tx,deps.proofStore,c.actor,c.params.eventId,c.params.registrationId,b.content_base64,b.media_type));
  route('POST','/events/:eventId/registrations/:registrationId/payments',z.strictObject({proof_id:uuid,reference:z.string().trim().min(4).max(100).regex(/^[a-zA-Z0-9 /_-]+$/)}),
    (c,b)=>payments.submitPayment(c.tx,c.actor,c.params.eventId,c.params.registrationId,b.proof_id,b.reference));
  route('GET','/events/:eventId/payments',pageQuery,async({tx,actor,params},q)=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    return tx.rows('SELECT id,registration_id,proof_id,reference,status,review_reason,created_at FROM payment_submissions WHERE event_id=$1 ORDER BY created_at LIMIT $2 OFFSET $3',[params.eventId,q.limit,q.offset]);
  },{query:true});
  route('POST','/events/:eventId/payments/:paymentId/review',z.strictObject({decision:z.enum(['APPROVED','REJECTED']),reason,override:z.boolean().default(false)}),
    (c,b)=>payments.reviewPayment(c.tx,c.actor,c.params.eventId,c.params.paymentId,b.decision,b.reason,b.override));
  route('GET','/events/:eventId/proofs/:proofId',empty,async({tx,actor,params,reply})=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    const p=must(await tx.one('SELECT p.* FROM proof_objects p JOIN registrations r ON r.id=p.registration_id WHERE p.id=$1 AND r.event_id=$2',[params.proofId,params.eventId]));
    const bytes=await deps.proofStore.read(p.storage_key);
    await audit(tx,actor,'PAYMENT_PROOF_ACCESSED','proof',p.id,(await tx.one('SELECT edition_id FROM events WHERE id=$1',[params.eventId]))!.edition_id,params.eventId);
    reply.header('Content-Type',p.media_type).header('Content-Disposition','attachment; filename="payment-proof"').header('X-Content-Type-Options','nosniff');
    return bytes;
  });
  route('POST','/events/:eventId/members/:memberId/ticket',z.strictObject({regenerate:z.boolean().default(false),reason:reason.default('Participant requested event ticket')}),
    (c,b)=>tickets.issueTicket(c.tx,c.actor,c.params.eventId,c.params.memberId,b.regenerate,b.reason));
  route('POST','/events/:eventId/tickets/:ticketId/revoke',z.strictObject({reason}),(c,b)=>tickets.revokeTicket(c.tx,c.actor,c.params.eventId,c.params.ticketId,b.reason));
  route('POST','/events/:eventId/scans',scanBody,async(c,b)=>{
    const result=await tickets.scan(c.tx,c.actor,c.params.eventId,b.token,b);
    const e=(await c.tx.one('SELECT edition_id FROM events WHERE id=$1',[c.params.eventId]))!;
    await audit(c.tx,c.actor,'QR_SCAN_RESULT','event',c.params.eventId,e.edition_id,c.params.eventId,{result:result.result});
    return result;
  });
  route('POST','/events/:eventId/lookup',z.strictObject({code:z.string().regex(/^(REG|TKT)-[A-F0-9]{18}$/)}),async({tx,actor,params},b)=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,SCANNERS);
    const r=await tx.one(`SELECT DISTINCT r.id,r.code,r.status,r.team_id FROM registrations r LEFT JOIN tickets t ON t.registration_id=r.id
      WHERE r.event_id=$1 AND (r.code=$2 OR t.code=$2)`,[params.eventId,b.code]);
    if (!r) return {result:'NOT_FOUND'};
    await audit(tx,actor,'MANUAL_LOOKUP','registration',r.id,event.edition_id,event.id);
    return {registration:r,members:await tx.rows(`SELECT m.id,u.display_name,m.withdrawn_at,a.checked_in_at FROM registration_members m
      JOIN users u ON u.id=m.user_id LEFT JOIN attendance a ON a.member_id=m.id AND a.voided_at IS NULL WHERE m.registration_id=$1`,[r.id])};
  });
  route('POST','/events/:eventId/manual-checkins',z.strictObject({member_id:uuid,reason,override:z.boolean().default(false),identity_checked:z.boolean().default(false),device_label:z.string().max(80).optional()}),
    (c,b)=>tickets.manualCheckin(c.tx,c.actor,c.params.eventId,b.member_id,b));
  route('POST','/events/:eventId/attendance/:attendanceId/void',z.strictObject({reason}),
    (c,b)=>tickets.voidAttendance(c.tx,c.actor,c.params.eventId,c.params.attendanceId,b.reason));

  route('GET','/events/:eventId/report',empty,async({tx,actor,params})=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,[...EDITORS,ROLE.core]);
    const counts=await tx.one(`SELECT count(*)::int AS registered,count(*) FILTER(WHERE status='CONFIRMED')::int AS confirmed,
      count(*) FILTER(WHERE status IN ('PENDING_PAYMENT','PAYMENT_VERIFICATION_PENDING','PAYMENT_REJECTED'))::int AS payment_pending,
      count(*) FILTER(WHERE status='PAYMENT_VERIFICATION_PENDING')::int AS verification_pending,count(*) FILTER(WHERE status IN ('WAITLISTED','OFFERED'))::int AS waitlisted
      FROM registrations WHERE event_id=$1`,[event.id]);
    const people=(await tx.one(`SELECT count(*) FILTER(WHERE r.status='CONFIRMED' AND m.withdrawn_at IS NULL)::int AS eligible_members,
      count(*) FILTER(WHERE a.id IS NOT NULL)::int AS attended,
      count(*) FILTER(WHERE r.status='CONFIRMED' AND m.withdrawn_at IS NULL AND a.id IS NOT NULL)::int AS eligible_attended,
      count(*) FILTER(WHERE r.status='CONFIRMED' AND m.withdrawn_at IS NULL AND a.id IS NULL)::int AS not_checked_in
      FROM registration_members m JOIN registrations r ON r.id=m.registration_id LEFT JOIN attendance a ON a.member_id=m.id AND a.voided_at IS NULL WHERE m.event_id=$1`,[event.id]))!;
    return {...counts,...people,no_show:['ENDED','COMPLETED','ARCHIVED'].includes(event.status)?people.not_checked_in:null,
      attendance_percentage:people.eligible_members?Math.round(10000*people.eligible_attended/people.eligible_members)/100:0};
  });
  route('GET','/events/:eventId/team-attendance',pageQuery,async({tx,actor,params},q)=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    return tx.rows(`SELECT t.id,t.name,m.id AS member_id,u.display_name,a.checked_in_at,m.withdrawn_at FROM teams t JOIN registrations r ON r.team_id=t.id
      JOIN registration_members m ON m.registration_id=r.id JOIN users u ON u.id=m.user_id LEFT JOIN attendance a ON a.member_id=m.id AND a.voided_at IS NULL
      WHERE t.event_id=$1 ORDER BY t.id,m.id LIMIT $2 OFFSET $3`,[params.eventId,q.limit,q.offset]);
  },{query:true});
  route('GET','/events/:eventId/certificate-basis',pageQuery,async({tx,actor,params},q)=>{
    await scopedEvent(tx,actor,params.eventId,EDITORS);
    return tx.rows('SELECT * FROM certificate_eligibility_basis WHERE event_id=$1 ORDER BY member_id LIMIT $2 OFFSET $3',[params.eventId,q.limit,q.offset]);
  },{query:true});
  route('POST','/events/:eventId/exports/attendance',z.strictObject({reason}),async({tx,actor,params,reply},b)=>{
    const {event}=await scopedEvent(tx,actor,params.eventId,ADMINS);
    const count=(await tx.one('SELECT count(*)::int AS n FROM registration_members WHERE event_id=$1',[event.id]))!.n;
    if(count>10000) throw new ApiError(409,'EXPORT_REQUIRES_BATCH_JOB','This bounded export supports up to 10,000 member rows.');
    const rows=await tx.rows(`SELECT r.code,u.display_name,r.status,a.checked_in_at FROM registrations r JOIN registration_members m ON m.registration_id=r.id
      JOIN users u ON u.id=m.user_id LEFT JOIN attendance a ON a.member_id=m.id AND a.voided_at IS NULL WHERE r.event_id=$1 ORDER BY r.code,m.id`,[event.id]);
    const cell=(x:unknown)=>{let s=x instanceof Date?x.toISOString():String(x??'');if(/^[=+@\-\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
    const csv=['registration_code,display_name,registration_status,checked_in_at',...rows.map(r=>[r.code,r.display_name,r.status,r.checked_in_at].map(cell).join(','))].join('\r\n');
    await audit(tx,actor,'ATTENDANCE_EXPORTED','event',event.id,event.edition_id,event.id,{reason:b.reason,row_count:rows.length});
    reply.header('Content-Type','text/csv; charset=utf-8').header('Content-Disposition','attachment; filename="attendance.csv"');return csv;
  });
  route('GET','/editions/:editionId/audit',pageQuery,async({tx,actor,params},q)=>{
    await requireGrant(tx,actor,ADMINS,params.editionId);
    return tx.rows('SELECT * FROM audit_logs WHERE edition_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3',[params.editionId,q.limit,q.offset]);
  },{query:true});

  const announcement=z.strictObject({audience:z.enum(['EDITION','EVENT','TEAM','PARTICIPANTS']),event_id:uuid.optional(),team_id:uuid.optional(),recipients:z.array(uuid).max(100).default([]),title:z.string().min(3).max(160),body:z.string().min(3).max(4000)});
  route('POST','/editions/:editionId/announcements',announcement,async({tx,actor,params},b)=>{
    if (b.audience==='EDITION') {
      await requireGrant(tx,actor,[...ADMINS,ROLE.core],params.editionId);
      if (b.event_id||b.team_id||b.recipients.length) throw new ApiError(400,'INVALID_AUDIENCE');
    } else {
      if (!b.event_id) throw new ApiError(400,'EVENT_REQUIRED');
      const {event}=await scopedEvent(tx,actor,b.event_id,EDITORS);
      if (event.edition_id!==params.editionId) throw new ApiError(400,'INVALID_SCOPE');
      if ((b.audience==='TEAM')!==!!b.team_id || (b.audience==='PARTICIPANTS')!==(b.recipients.length>0)) throw new ApiError(400,'INVALID_AUDIENCE');
      if (b.team_id) must(await tx.one('SELECT id FROM teams WHERE id=$1 AND event_id=$2',[b.team_id,b.event_id]));
      if (b.recipients.length) {
        const recipients=await tx.rows('SELECT DISTINCT user_id FROM registration_members WHERE event_id=$1 AND user_id=ANY($2::uuid[])',[b.event_id,b.recipients]);
        if (recipients.length!==new Set(b.recipients).size) throw new ApiError(400,'INVALID_RECIPIENTS');
      }
    }
    const a=(await tx.one('INSERT INTO announcements(edition_id,event_id,team_id,audience,title,body,author_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [params.editionId,b.event_id??null,b.team_id??null,b.audience,b.title,b.body,actor]))!;
    for (const user of new Set(b.recipients)) await tx.rows('INSERT INTO announcement_recipients(announcement_id,user_id) VALUES($1,$2)',[a.id,user]);
    await audit(tx,actor,'ANNOUNCEMENT_DRAFTED','announcement',a.id,params.editionId,b.event_id??null);return a;
  });
  route('POST','/editions/:editionId/announcements/:announcementId/publish',z.strictObject({reason}),async({tx,actor,params},b)=>{
    await requireGrant(tx,actor,ADMINS,params.editionId);
    const ed=must(await tx.one('SELECT state FROM editions WHERE id=$1',[params.editionId]));
    if (!['ACTIVE','CLOSED'].includes(ed.state)) throw new ApiError(409,'EDITION_NOT_PUBLIC');
    const a=must(await tx.one('UPDATE announcements SET published_at=now(),published_by=$3 WHERE id=$1 AND edition_id=$2 AND published_at IS NULL RETURNING id,event_id',[params.announcementId,params.editionId,actor]));
    await audit(tx,actor,'ANNOUNCEMENT_PUBLISHED','announcement',a.id,params.editionId,a.event_id,{reason:b.reason});return {published:true};
  });
  route('GET','/editions/:editionId/announcements',pageQuery,async({tx,actor,params},q)=>tx.rows(`SELECT a.id,a.event_id,a.title,a.body,a.published_at FROM announcements a
    WHERE a.edition_id=$1 AND a.published_at IS NOT NULL AND (a.audience='EDITION'
    OR (a.audience='EVENT' AND EXISTS(SELECT 1 FROM registration_members m WHERE m.event_id=a.event_id AND m.user_id=$2))
    OR (a.audience='TEAM' AND EXISTS(SELECT 1 FROM team_members m WHERE m.team_id=a.team_id AND m.user_id=$2 AND m.left_at IS NULL))
    OR (a.audience='PARTICIPANTS' AND EXISTS(SELECT 1 FROM announcement_recipients r WHERE r.announcement_id=a.id AND r.user_id=$2)))
    ORDER BY a.published_at DESC LIMIT $3 OFFSET $4`,[params.editionId,actor,q.limit,q.offset]),{query:true});
  return app;
}
