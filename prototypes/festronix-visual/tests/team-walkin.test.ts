import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import {seedState,type FestivalState} from '../src/platform/model';
import {execute,type Command} from '../src/platform/commands';
import {teamChangesOpen} from '../src/platform/teamAdmissions';

let now=new Date('2026-10-16T07:00:00Z').getTime();
mock.method(Date,'now',()=>now);
const person=(s:FestivalState,id:string)=>s.staff.find(p=>p.id===id)!;
const act=(s:FestivalState,id:string,c:Command)=>execute(s,person(s,id),c);
function setup(){now=new Date('2026-10-16T07:00:00Z').getTime();const s=seedState();s.entries=[];return s}
function registration(s:FestivalState){act(s,'participant',{type:'register',eventId:'ai',team:'Learning team',members:'Sample Participant, Original Member',eligible:true,paymentRef:'',proofName:''});return s.entries.at(-1)!}

test('captain can edit within policy; retained members keep passes and removed passes become invalid',()=>{
 const s=setup(),r=registration(s),captain=r.attendees[0],removed=r.attendees[1];
 act(s,'participant',{type:'updateTeam',entryId:r.id,team:'Revised team',members:'Sample Participant, New Member',memberAccounts:[],eligible:true});
 assert.equal(r.team,'Revised team');assert.equal(r.attendees[0].token,captain.token);assert.equal(r.attendees[0].id,captain.id);
 assert.ok(r.attendees.every(a=>a.token!==removed.token));assert.equal(r.status,'CONFIRMED');
 act(s,'security',{type:'transition',eventId:'ai',target:'Live'});
 assert.throws(()=>act(s,'security',{type:'scan',eventId:'ai',token:removed.token}),/Invalid demo QR/);
 assert.ok(!r.checkedIn);
});

test('team edits enforce captain identity, linked accounts and eligibility without changing attendance',()=>{
 const s=setup(),r=registration(s);
 const edit:Command={type:'updateTeam',entryId:r.id,team:r.team,members:'Sample Participant',memberAccounts:['participant-2'],eligible:true};
 assert.throws(()=>act(s,'participant-2',edit),/captain/);
 assert.throws(()=>act(s,'participant',{...edit,eligible:false}),/eligibility/);
 act(s,'participant',edit);assert.equal(r.attendees[1].accountId,'participant-2');assert.equal(r.attendees[1].name,'User Two');
 const snapshot=JSON.stringify(r);
 assert.throws(()=>act(s,'participant',{...edit,memberAccounts:['participant-2','participant-2']}),/once/);
 assert.equal(JSON.stringify(r),snapshot);assert.ok(r.attendees.every(a=>!a.checkedAt));
});

test('team updates cannot cross the deadline, event start or attendance lock',()=>{
 const s=setup(),r=registration(s),e=s.events.find(e=>e.id===r.eventId)!;
 const edit:Command={type:'updateTeam',entryId:r.id,team:r.team,members:r.members,memberAccounts:[],eligible:true};
 now=new Date('2026-10-17T13:00:00Z').getTime();
 assert.equal(teamChangesOpen(r,e),false);assert.throws(()=>act(s,'participant',edit),/closed/);
 now=new Date('2026-10-16T07:00:00Z').getTime();e.state='Live';assert.throws(()=>act(s,'participant',edit),/closed/);
 e.state='Published';r.attendees[0].checkedAt='2026-10-18T08:00:00Z';assert.throws(()=>act(s,'participant',edit),/closed/);
});

test('a blocking confirmed event also blocks a new warn-only overlapping event',()=>{
 const s=setup(),first=s.events.find(e=>e.id==='signal')!;first.clashPolicy='Block';
 act(s,'participant',{type:'register',eventId:first.id,team:'',members:'Sample Participant',eligible:true,paymentRef:'',proofName:''});
 const second=s.events.find(e=>e.id==='cyber')!;second.clashPolicy='Warn';
 assert.throws(()=>act(s,'participant',{type:'register',eventId:second.id,team:'New team',members:'Sample Participant',eligible:true,paymentRef:'',proofName:''}),/overlapping/);
});

test('free walk-in after normal deadline enforces approved policy and records registration separately from attendance',()=>{
 const s=setup(),e=s.events.find(e=>e.id==='signal')!;e.walkins=true;e.state='Live';
 now=new Date('2026-10-19T04:00:00Z').getTime();
 act(s,'dev',{type:'walkin',eventId:e.id,participantId:'participant',team:'',members:'Sample Participant',eligible:true,reason:'College ID checked; no document copied.'});
 const r=s.entries.at(-1)!;assert.equal(r.status,'CONFIRMED');assert.match(r.note,/Staff walk-in/);assert.equal(r.checkedIn,false);
 assert.equal(r.attendees[0].accountId,'participant');
 act(s,'dev',{type:'scan',eventId:e.id,token:r.attendees[0].token});assert.equal(r.checkedIn,true);
});

test('helpers and unrelated coordinators cannot create a walk-in',()=>{
 const s=setup(),e=s.events.find(e=>e.id==='quantum')!;e.price=0;e.walkins=true;e.state='Live';
 const c:Command={type:'walkin',eventId:e.id,participantId:'participant',team:'Team',members:'Sample Participant, Guest Member',eligible:true,reason:'College ID checked.'};
 assert.throws(()=>act(s,'helper-dev',c),/scope/);assert.throws(()=>act(s,'engineering',c),/scope/);
 assert.equal(s.entries.length,0);
});

test('walk-ins never bypass paid proof requirements, capacity, duplicate registration or closed edition',()=>{
 const s=setup(),e=s.events.find(e=>e.id==='signal')!;e.walkins=true;e.state='Live';e.capacity=1;
 const c:Command={type:'walkin',eventId:e.id,participantId:'participant',team:'',members:'Sample Participant',eligible:true,reason:'College ID checked.'};
 e.price=100;assert.throws(()=>act(s,'dev',c),/Paid walk-ins require/);e.price=0;
 s.editions[0].registrationOpen=false;assert.throws(()=>act(s,'dev',c),/admission is closed/);s.editions[0].registrationOpen=true;
 act(s,'dev',c);assert.throws(()=>act(s,'dev',{...c,participantId:'participant-2',members:'User Two'}),/full/);
 e.capacity=2;assert.throws(()=>act(s,'dev',c),/active registration/);assert.equal(s.entries.length,1);
});

test('late substitution follows approved staff policy, preserves tokens/history and locks at attendance or event start',()=>{
 const s=setup(),r=registration(s),e=s.events.find(e=>e.id===r.eventId)!,token=r.attendees[0].token;
 now=new Date('2026-10-18T07:00:00Z').getTime();
 const change:Command={type:'staffTeam',entryId:r.id,team:r.team,members:'Sample Participant, Replacement Person',memberAccounts:[],eligible:true,reason:'Original teammate unavailable; replacement eligibility verified.'};
 assert.throws(()=>act(s,'security',change),/policy/);
 act(s,'primary',change);assert.equal(r.attendees[0].token,token);assert.match(r.rosterChanges![0].before,/Original Member/);assert.match(r.rosterChanges![0].after,/Replacement Person/);
 e.lateSubstitutions='Assigned staff';act(s,'security',{...change,members:'Sample Participant, Another Person'});assert.equal(r.rosterChanges!.length,2);
 assert.throws(()=>act(s,'helper-dev',change),/scope/);
 e.state='Live';assert.throws(()=>act(s,'primary',change),/locked/);e.state='Published';r.attendees[0].checkedAt='2026-10-18T08:00:00Z';assert.throws(()=>act(s,'primary',change),/locked/);
});

test('paid walk-in stays pending through scoped review and rejection-resubmission; capacity rechecked before approval',()=>{
 const s=setup(),e=s.events.find(e=>e.id==='signal')!;e.walkins=true;e.price=100;e.state='Live';e.capacity=1;
 now=new Date('2026-10-19T04:00:00Z').getTime();
 const c:Command={type:'walkin',eventId:e.id,participantId:'participant',team:'',members:'Sample Participant',eligible:true,reason:'College ID checked.',paymentRef:'FAKE-UTR',proofName:'fake.png'};
 act(s,'dev',c);const r=s.entries.at(-1)!;assert.equal(r.status,'PAYMENT_VERIFICATION_PENDING');
 assert.throws(()=>act(s,'dev',{type:'scan',eventId:e.id,token:r.attendees[0].token}),/not confirmed/);
 assert.throws(()=>act(s,'engineering',{type:'verifyPayment',entryId:r.id,approved:true,note:'Verified'}),/scope/);
 act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:false,note:'Sample reference unreadable'});
 act(s,'participant',{type:'proof',entryId:r.id,reference:'NEW-FAKE',filename:'new.png'});assert.equal(r.status,'PAYMENT_VERIFICATION_PENDING');
 act(s,'dev',{...c,participantId:'participant-2',members:'User Two'});const second=s.entries.at(-1)!;
 act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:true,note:'Verified example'});assert.equal(r.status,'CONFIRMED');
 assert.throws(()=>act(s,'dev',{type:'verifyPayment',entryId:second.id,approved:true,note:'Checked'}),/Capacity/);
 assert.equal(second.status,'PAYMENT_VERIFICATION_PENDING');
 e.state='Completed';assert.throws(()=>act(s,'dev',{type:'verifyPayment',entryId:second.id,approved:false,note:'Rejected'}),/review/);
});

test('edition settings reject unsupported theme values without changing saved configuration',()=>{
 const s=setup(),original=s.editions[0].theme;
 assert.throws(()=>act(s,'primary',{type:'settings',edition:{...s.editions[0],theme:'Unknown' as never}}),/supported FESTRONIX/);
 assert.equal(s.editions[0].theme,original);
});

test('authority is reloaded from current staff records before any command',()=>{
 const s=setup(),stale=structuredClone(person(s,'dev'));person(s,'dev').active=false;
 assert.throws(()=>execute(s,stale,{type:'transition',eventId:'quantum',target:'Live'}),/active access/);
 person(s,'dev').active=true;person(s,'dev').accessVersion=1;
 assert.throws(()=>execute(s,stale,{type:'transition',eventId:'quantum',target:'Live'}),/access has changed/);
});

test('faculty approval inputs require a usable team-edit deadline and whole-member policy',()=>{
 const s=setup(),draft={...s.events[4],id:'new-policy-event',time:'14:00',state:'Draft' as const};
 assert.throws(()=>act(s,'primary',{type:'event',event:{...draft,teamEditDeadline:'2026-10-19T20:00'}}),/team-edit deadline/);
 assert.throws(()=>act(s,'primary',{type:'event',event:{...draft,teamMin:1.5}}),/whole numbers/);
 assert.equal(s.events.length,6);
 act(s,'primary',{type:'event',event:draft});assert.equal(s.events.length,7);
});
