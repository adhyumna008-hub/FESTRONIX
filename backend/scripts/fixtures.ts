import { randomUUID } from 'node:crypto';
import { transaction, type Pool, type Tx } from '../src/db.js';
import { ROLE } from '../src/permissions.js';
import { eventColumns, eventInput } from '../src/schemas.js';
import { code } from '../src/registrations.js';
import { tokenHash } from '../src/tickets.js';
import type { ProofStore } from '../src/storage.js';

export const fixtureNames=['owner','backup','admin','approver','coordinatorA','coordinatorB','scannerA','core','alice','bob','carol','dave','captain','member','pending','paid'] as const;
export type Actors=Record<typeof fixtureNames[number],string>;
export const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jE5kAAAAASUVORK5CYII=';
export function eventDetails(patch:Record<string,unknown>={}) {
  const at=(hours:number)=>new Date(Date.now()+hours*3600000).toISOString();
  return eventInput.parse({title:'Development Fixture Challenge',description:'Fictional local event for backend verification only.',category:'Technology',venue:'Demo Lab',
    starts_at:at(2),ends_at:at(5),registration_opens:at(-24),registration_deadline:at(1),checkin_opens:at(-1),checkin_closes:at(4),
    capacity:20,mode:'SOLO',team_min:1,team_max:1,team_edit_deadline:at(1),...patch});
}
export async function seedActors(pool:Pool) {
  return transaction(pool,async tx=>{
    const actors={} as Actors;
    for (const name of fixtureNames) {
      const u=(await tx.one(`INSERT INTO users(display_name,email,institution,institution_type,academic_year,branch,age_years)
        VALUES($1,$2,'Fictional College','COLLEGE',2,'CSE',20) RETURNING id`,[`Fixture ${name}`,`${name}@example.invalid`]))!;
      actors[name]=u.id;
      await tx.rows("INSERT INTO identities(provider,subject,user_id) VALUES('FIREBASE',$1,$2)",['fixture-'+name,u.id]);
    }
    for (const [u,r] of [[actors.owner,ROLE.primary],[actors.backup,ROLE.backup]]) await tx.rows('INSERT INTO role_assignments(user_id,role_code,granted_by,reason) VALUES($1,$2,$3,$4)',[u,r,actors.owner,'Fictional development custodian']);
    const edition=(await tx.one(`INSERT INTO editions(slug,display_name,starts_at,ends_at,state,admissions_open,created_by)
      VALUES('fixture-2027','FESTRONIX 2K27 (fictional development)',now()-interval '1 day',now()+interval '7 days','ACTIVE',true,$1) RETURNING id`,[actors.owner]))!.id as string;
    const nextEdition=(await tx.one(`INSERT INTO editions(slug,display_name,starts_at,ends_at,created_by)
      VALUES('fixture-2028','FESTRONIX 2K28 (private fixture)',now()+interval '365 days',now()+interval '370 days',$1) RETURNING id`,[actors.owner]))!.id as string;
    for (const [u,r] of [[actors.admin,ROLE.admin],[actors.approver,ROLE.approver],[actors.core,ROLE.core]]) await tx.rows(`INSERT INTO role_assignments(user_id,role_code,edition_id,expires_at,granted_by,reason)
      VALUES($1,$2,$3,now()+interval '7 days',$4,'Development assignment')`,[u,r,edition,actors.owner]);
    return {actors,edition,nextEdition};
  },true);
}
export async function fixtureEvent(tx:Tx,actors:Actors,edition:string,patch:Record<string,unknown>={}) {
  const input=eventDetails(patch);
  const event=(await tx.one('INSERT INTO events(edition_id,slug,created_by) VALUES($1,$2,$3) RETURNING id',[edition,'fixture-'+randomUUID(),actors.admin]))!.id as string;
  const values=eventColumns.map(k=>input[k as keyof typeof input]);
  const revision=(await tx.one(`INSERT INTO event_revisions(event_id,version,author_id,reviewer_id,state,reviewed_at,published_at,${eventColumns.join(',')})
    VALUES($1,1,$2,$3,'PUBLISHED',now(),now(),${values.map((_,i)=>'$'+(i+4)).join(',')}) RETURNING id`,[event,actors.admin,actors.approver,...values]))!.id as string;
  await tx.rows("UPDATE events SET active_revision_id=$2,status='PUBLISHED',registration_state='OPEN' WHERE id=$1",[event,revision]);
  return {id:event,revision};
}
export async function fixtureRegistration(tx:Tx,event:{id:string;revision:string},edition:string,users:string[],status='CONFIRMED',teamId:string|null=null) {
  const r=(await tx.one(`INSERT INTO registrations(code,edition_id,event_id,revision_id,applicant_id,team_id,status,confirmed_at,hold_expires_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,CASE WHEN $7='CONFIRMED' THEN now() END,now()+interval '24 hours') RETURNING id,code`,[code('REG'),edition,event.id,event.revision,users[0],teamId,status]))!;
  const members:string[]=[];
  for (const user of users) members.push((await tx.one('INSERT INTO registration_members(registration_id,edition_id,event_id,user_id) VALUES($1,$2,$3,$4) RETURNING id',[r.id,edition,event.id,user]))!.id);
  return {...r,id:r.id as string,code:r.code as string,members};
}
export async function scenario(pool:Pool,actors:Actors,edition:string,store:ProofStore) {
  return transaction(pool,async tx=>{
    const a=await fixtureEvent(tx,actors,edition,{title:'Event A'});
    const b=await fixtureEvent(tx,actors,edition,{title:'Event B'});
    const paidEvent=await fixtureEvent(tx,actors,edition,{title:'Paid Event',fee_paise:30000,payment_instructions:'DEVELOPMENT ONLY: Do not transfer money.'});
    const teamEvent=await fixtureEvent(tx,actors,edition,{title:'Team Event',mode:'TEAM',team_min:2,team_max:4});
    for (const [eventId,user,role] of [[a.id,actors.coordinatorA,ROLE.coordinator],[a.id,actors.scannerA,ROLE.scanner],
      [b.id,actors.coordinatorB,ROLE.coordinator],[paidEvent.id,actors.coordinatorA,ROLE.coordinator],[teamEvent.id,actors.coordinatorA,ROLE.coordinator],[teamEvent.id,actors.scannerA,ROLE.scanner]]) {
      await tx.rows(`INSERT INTO role_assignments(user_id,role_code,edition_id,event_id,expires_at,granted_by,reason)
        VALUES($1,$2,$3,$4,now()+interval '7 days',$5,'Development event scope')`,[user,role,edition,eventId,actors.owner]);
    }
    const regA=await fixtureRegistration(tx,a,edition,[actors.alice]);
    const regB=await fixtureRegistration(tx,b,edition,[actors.bob]);
    const pending=await fixtureRegistration(tx,paidEvent,edition,[actors.pending],'PAYMENT_VERIFICATION_PENDING');
    const paid=await fixtureRegistration(tx,paidEvent,edition,[actors.paid]);
    const teamId=(await tx.one('INSERT INTO teams(edition_id,event_id,name,captain_id) VALUES($1,$2,$3,$4) RETURNING id',[edition,teamEvent.id,'Demo Team',actors.captain]))!.id;
    for(const u of [actors.captain,actors.member]) await tx.rows('INSERT INTO team_members(team_id,event_id,edition_id,user_id) VALUES($1,$2,$3,$4)',[teamId,teamEvent.id,edition,u]);
    const team=await fixtureRegistration(tx,teamEvent,edition,[actors.captain,actors.member],'CONFIRMED',teamId);
    async function payment(reg: typeof regA, user:string,status:string) {
      const key=randomUUID();await store.put(key,Buffer.from(png,'base64'));
      const proof=(await tx.one(`INSERT INTO proof_objects(registration_id,owner_id,storage_key,media_type,byte_size,content_sha256)
        VALUES($1,$2,$3,'image/png',$4,$5) RETURNING id`,[reg.id,user,key,Buffer.from(png,'base64').length,tokenHash(png)]))!.id;
      return (await tx.one(`INSERT INTO payment_submissions(registration_id,edition_id,event_id,proof_id,reference,status,submitted_by,reviewed_by,reviewed_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,CASE WHEN $6='APPROVED' THEN $8::uuid END,CASE WHEN $6='APPROVED' THEN now() END) RETURNING id`,[reg.id,edition,paidEvent.id,proof,'DEMO-'+randomUUID(),status,user,actors.admin]))!.id as string;
    }
    const pendingPayment=await payment(pending,actors.pending,'PENDING');
    await payment(paid,actors.paid,'APPROVED');
    async function ticket(reg: typeof regA,eventId:string,status:string) {
      const token='fx1_'+randomUUID().replaceAll('-','')+randomUUID().replaceAll('-','');
      const t=(await tx.one(`INSERT INTO tickets(code,registration_id,member_id,edition_id,event_id,token_hash,status,expires_at,revoked_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,now()+interval '4 hours',CASE WHEN $7='REVOKED' THEN now() END) RETURNING id`,[code('TKT'),reg.id,reg.members[0],edition,eventId,tokenHash(token),status]))!;
      return {id:t.id as string,token};
    }
    const valid=await ticket(regA,a.id,'ACTIVE');
    const other=await ticket(regB,b.id,'ACTIVE');
    const revokedReg=await fixtureRegistration(tx,a,edition,[actors.carol]);
    const revoked=await ticket(revokedReg,a.id,'REVOKED');
    return {a,b,paidEvent,teamEvent,regA,regB,pending,paid,team,teamId,pendingPayment,valid,other,revoked};
  },true);
}
