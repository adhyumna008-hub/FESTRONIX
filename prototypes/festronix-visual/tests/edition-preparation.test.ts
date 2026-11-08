import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState,type ManagedEvent} from '../src/platform/model';
import {execute} from '../src/platform/commands';
import {getEditionReadiness} from '../src/platform/editionReadiness';

function futureEdition(){
 const state=seedState();
 const edition=state.editions.find(item=>item.year===2030)!;
 edition.year=2099;edition.label='2K99';edition.startDate='2099-10-18';edition.endDate='2099-10-19';edition.contact='Faculty help desk · help@example.test';
 const source=state.events[0];
 const event:ManagedEvent={...structuredClone(source),id:'future-event-test',editionId:edition.id,ownerId:'primary',state:'Draft',date:edition.startDate,time:'09:05',deadline:'2099-10-17T18:00',teamEditDeadline:'2099-10-17T18:00',price:0,paymentInstructions:'Free event; no payment is due.'};
 return {state,edition,event,owner:state.staff.find(person=>person.id==='primary')!};
}

test('upcoming edition readiness lists missing event and contact details, then clears when completed',()=>{
 const {state,edition,event}=futureEdition();
 edition.contact='Faculty help desk · contact details to be confirmed';
 const empty=getEditionReadiness(edition,[]);
 assert.equal(empty.ready,false);
 assert.ok(empty.issues.includes('Add confirmed support contact details.'));
 assert.ok(empty.issues.includes('Add at least one event draft.'));
 edition.contact='Faculty help desk · help@example.test';
 const complete=getEditionReadiness(edition,[event]);
 assert.equal(complete.ready,true,complete.issues.join('\n'));
 const paid={...event,price:300,paymentInstructions:'Payment destination awaiting faculty confirmation. Do not pay in this preview.'};
 const unpaidInstructions=getEditionReadiness(edition,[paid]);
 assert.equal(unpaidInstructions.ready,false);
 assert.ok(unpaidInstructions.issues.some(issue=>issue.includes('faculty-approved payment instructions')));
 assert.equal(state.events.some(item=>item.id===event.id),false);
});

test('only an Owner can create drafts for an upcoming edition',()=>{
 const {state,edition,event,owner}=futureEdition();
 execute(state,owner,{type:'event',event});
 assert.equal(state.events.find(item=>item.id===event.id)?.editionId,edition.id);
 const coordinator=state.staff.find(person=>person.role==='Coordinator')!;
 const another={...event,id:'blocked-future-event'};
 assert.throws(()=>execute(state,coordinator,{type:'event',event:another}),/owners can prepare upcoming drafts/);
});

test('activation is blocked until required upcoming content and event drafts are ready, then keeps history',()=>{
 const {state,edition,event,owner}=futureEdition();
 const active=state.editions.find(item=>item.id===state.activeEditionId)!;
 active.registrationOpen=false;
 const entries=structuredClone(state.entries);
 assert.throws(()=>execute(state,owner,{type:'activate',editionId:edition.id}),/Complete upcoming edition details before activation/);
 state.events.push(event);
 execute(state,owner,{type:'activate',editionId:edition.id});
 assert.equal(state.activeEditionId,edition.id);
 assert.equal(edition.phase,'Active');
 assert.equal(edition.registrationOpen,false);
 assert.equal(state.editions.find(item=>item.id===active.id)?.phase,'Archived');
 assert.deepEqual(state.entries,entries);
 assert.equal(state.events.find(item=>item.id===event.id)?.state,'Draft');
});
