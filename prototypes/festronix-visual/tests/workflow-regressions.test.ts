import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import {editionDates,href,seedState,type FestivalState} from '../src/platform/model';
import {execute,type Command} from '../src/platform/commands';
import {loginDestination} from '../src/platform/loginDestination';
import {authenticateDemo,sessionActor} from '../src/platform/demoAuth';
import {registrationClosed} from '../src/platform/admission';

let now=new Date('2026-10-16T07:00:00Z').getTime();
mock.method(Date,'now',()=>now);
const person=(s:FestivalState,id:string)=>s.staff.find(p=>p.id===id)!;
const act=(s:FestivalState,id:string,c:Command)=>execute(s,person(s,id),c);
function register(s:FestivalState,eventId:string,id='participant',extra:Partial<Extract<Command,{type:'register'}>>={}){
 const e=s.events.find(e=>e.id===eventId)!;
 act(s,id,{type:'register',eventId,team:'QA team',members:person(s,id).name+(e.teamMin>1?', Fictional Teammate':''),paymentRef:'FAKE-ONLY',proofName:'fake.png',eligible:true,...extra});return s.entries.at(-1)!;
}

test('account buttons open the correct workspace; public login never loops back to Events',()=>{
 const s=seedState();
 for(const [id,view] of [['primary','admin'],['dev','coordinator'],['helper-dev','coordinator'],['participant','participant']]){
  assert.equal(loginDestination(person(s,id),'events',s.events).view,view);
  assert.equal(loginDestination(person(s,id),'help',s.events,undefined,true).view,view);
 }
 assert.equal(loginDestination(person(s,'participant'),'admin',s.events).view,'participant');
});

test('registration sign-in uses the exact event ID even when two events share a title',()=>{
 const s=seedState();s.events[1].title=s.events[0].title;
 const target=loginDestination(person(s,'participant'),'events',s.events,s.events[1].id);
 assert.deepEqual(target,{view:'events',extra:{event:'robot',register:'1'}});
 assert.equal(loginDestination(person(s,'primary'),'events',s.events,'robot').view,'admin');
 assert.equal(loginDestination(person(s,'participant'),'events',s.events,'missing').view,'participant');
});

test('paid waitlist accepts no payment evidence and issues no confirmed admission',()=>{
 now=new Date('2026-10-16T07:00:00Z').getTime();const s=seedState();s.entries=[];
 const e=s.events.find(e=>e.id==='circuit')!;e.capacity=1;e.waitlist=true;
 const first=register(s,e.id);act(s,'engineering',{type:'verifyPayment',entryId:first.id,approved:true,note:'Fictional proof only'});
 const second=register(s,e.id,'participant-2',{paymentRef:'',proofName:''});
 assert.equal(second.status,'WAITLISTED');assert.equal(second.paymentRef,'');assert.equal(second.proofName,'');
 act(s,'engineering',{type:'transition',eventId:e.id,target:'Live'});
 assert.throws(()=>act(s,'engineering',{type:'scan',eventId:e.id,token:second.attendees[0].token}),/not confirmed/);
});

test('waitlist cannot be promoted after its event registration deadline',()=>{
 now=new Date('2026-10-16T07:00:00Z').getTime();const s=seedState();s.entries=[];
 const e=s.events.find(e=>e.id==='signal')!;e.capacity=1;
 const first=register(s,e.id),second=register(s,e.id,'participant-2');
 act(s,'participant',{type:'withdraw',entryId:first.id});now=new Date('2026-10-18T07:00:00Z').getTime();
 assert.throws(()=>act(s,'dev',{type:'promote',entryId:second.id}),/deadline/);assert.equal(second.status,'WAITLISTED');
});

test('blocking schedule policy includes linked teammates, not just the captain',()=>{
 now=new Date('2026-10-16T07:00:00Z').getTime();const s=seedState();s.entries=[];
 register(s,'cyber','participant-2');const target=s.events.find(e=>e.id==='signal')!;target.teamMax=2;target.clashPolicy='Block';
 assert.throws(()=>register(s,target.id,'participant',{memberAccounts:['participant-2']}),/team member/);
 assert.equal(s.entries.length,1);
});

test('payment approval rechecks overlapping confirmed registrations',()=>{
 now=new Date('2026-10-16T07:00:00Z').getTime();const s=seedState();s.entries=[];
 const e=s.events.find(e=>e.id==='circuit')!;e.date='2026-10-19';e.time='09:30 AM';e.teamMin=1;e.teamMax=1;e.clashPolicy='Block';
 const pending=register(s,e.id);register(s,'cyber');
 assert.throws(()=>act(s,'engineering',{type:'verifyPayment',entryId:pending.id,approved:true,note:'Test'}),/incompatible/);
 assert.equal(pending.status,'PAYMENT_VERIFICATION_PENDING');
});

test('invalid manual attendance leaves all check-in records unchanged',()=>{
 const s=seedState(),entry=s.entries[0];act(s,'dev',{type:'transition',eventId:'quantum',target:'Live'});
 assert.throws(()=>act(s,'helper-dev',{type:'scan',eventId:'quantum',token:entry.attendees[0].token,manualReason:'x'}),/reason/);
 assert.ok(entry.attendees.every(a=>!a.checkedAt));assert.equal(entry.checkedIn,false);
});

test('restoring staff access never reactivates a previously revoked session',()=>{
 const s=seedState(),oldSession=authenticateDemo(s,'user6','user6');
 act(s,'primary',{type:'staff',person:{...person(s,'helper-engineering'),active:false}});
 assert.equal(sessionActor(s,oldSession),undefined);
 act(s,'primary',{type:'staff',person:{...person(s,'helper-engineering'),active:true}});
 assert.equal(sessionActor(s,oldSession),undefined);
 assert.equal(sessionActor(s,authenticateDemo(s,'user6','user6'))?.id,'helper-engineering');
});

test('landing and directory admission controls agree on deadlines and operating state',()=>{
 const s=seedState(),e=s.events[0],edition=s.editions[0];
 assert.equal(registrationClosed(e,edition,new Date('2026-10-16T00:00:00Z').getTime()),false);
 assert.equal(registrationClosed(e,edition,new Date('2026-10-18T00:00:00Z').getTime()),true);
 e.deadline='invalid';assert.equal(registrationClosed(e,edition,0),true);
 e.deadline='2026-10-17T18:00';e.state='Live';assert.equal(registrationClosed(e,edition,0),true);
});

test('unused draft deletion is allowed while registration history is protected',()=>{
 const s=seedState(),owner=person(s,'primary'),draft={...s.events[2],id:'qa-unused',time:'10:00',state:'Draft' as const};
 execute(s,owner,{type:'event',event:draft});assert.ok(s.events.some(e=>e.id===draft.id));
 execute(s,owner,{type:'delete',eventId:draft.id});assert.ok(!s.events.some(e=>e.id===draft.id));
 assert.throws(()=>execute(s,owner,{type:'delete',eventId:'quantum'}),/unused draft/);
 assert.equal(s.entries.length,2);
});

test('theme navigation keeps the future-edition preview while staff links leave it',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'location');
 Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?preview=edition-preset-2028'}});
 try{
  for(const theme of ['Campus','Pulse','Panel','Flux'] as const){const url=new URL(href('home',theme),'http://localhost');assert.equal(url.searchParams.get('preview'),'edition-preset-2028');assert.equal(url.searchParams.get('theme'),theme);}
  assert.equal(new URL(href('admin','Campus'),'http://localhost').searchParams.has('preview'),false);
 }finally{if(previous)Object.defineProperty(globalThis,'location',previous);else Reflect.deleteProperty(globalThis,'location');}
});

test('festival date ranges stay compact without losing year or cross-month detail',()=>{
 const e=seedState().editions[0];
 assert.equal(editionDates(e),'18–19 October 2026');
 assert.equal(editionDates({...e,endDate:e.startDate}),'18 October 2026');
 assert.match(editionDates({...e,endDate:'2026-11-01'}),/November 2026/);
});
