import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../src/platform/model';
import {ensureEditionCatalogue} from '../src/platform/editionCatalogue';
import {execute} from '../src/platform/commands';
import {dateInYear} from '../src/platform/editionIdentity';

test('2026 is current and presets through 2030 need no manual creation',()=>{
 const s=seedState();
 assert.deepEqual(s.editions.map(e=>e.year).sort(),[2026,2027,2028,2029,2030]);
 const active=s.editions.find(e=>e.id===s.activeEditionId)!;
 assert.equal(active.year,2026);assert.equal(active.label,'2K26');
 for(const e of s.editions.filter(e=>e.year>2026)){
  assert.equal(e.phase,'Upcoming');assert.equal(e.registrationOpen,false);
  assert.equal(s.events.filter(x=>x.editionId===e.id).length,0);
  assert.equal(s.staff.filter(x=>x.editionId===e.id).length,0);
 }
});

test('legacy fictional 2027 edition is corrected once without resetting records',()=>{
 const s=seedState();delete s.editionCatalogueVersion;
 const active=s.editions[0];s.editions=[active];
 const oldId=active.id;active.id='edition-2027';active.year=2027;active.label='2K27';
 active.startDate='2027-10-18';active.endDate='2027-10-19';s.activeEditionId=active.id;
 for(const e of s.events){e.editionId=active.id;e.date=dateInYear(e.date,2027);e.deadline=dateInYear(e.deadline,2027);e.teamEditDeadline=dateInYear(e.teamEditDeadline,2027);}
 s.staff.filter(x=>x.editionId===oldId).forEach(x=>x.editionId=active.id);
 const records=structuredClone(s.entries),people=structuredClone(s.staff);
 ensureEditionCatalogue(s);
 assert.equal(active.year,2026);assert.equal(active.label,'2K26');assert.equal(s.activeEditionId,'edition-2027');
 assert.deepEqual(s.entries,records);assert.deepEqual(s.staff,people);assert.equal(s.editions.length,5);
 assert.ok(s.events.every(e=>e.date.startsWith('2026-')&&e.deadline.startsWith('2026-')));
 const auditLength=s.audit.length;ensureEditionCatalogue(s);assert.equal(s.audit.length,auditLength);assert.equal(s.editions.length,5);
});

test('preset settings survive reload; a complete upcoming edition activates without losing old records',()=>{
 const s=seedState(),owner=s.staff.find(x=>x.id==='primary')!;
 const preparedSettings=s.editions.find(e=>e.year===2028)!;preparedSettings.heroTitle='Prepared for 2028';
 const future=s.editions.find(e=>e.year===2030)!;future.year=2099;future.label='2K99';future.startDate='2099-10-18';future.endDate='2099-10-19';future.contact='Faculty support · help@example.test';future.heroTitle='Prepared for 2099';
 const event=structuredClone(s.events[0]);event.id='future-edition-event';event.editionId=future.id;event.ownerId=owner.id;event.state='Draft';event.date='2099-10-18';event.time='09:05';event.deadline='2099-10-17T18:00';event.teamEditDeadline='2099-10-17T18:00';event.price=0;event.paymentInstructions='No fee.';s.events.push(event);
 ensureEditionCatalogue(s);assert.equal(s.editions.find(e=>e.id===preparedSettings.id)!.heroTitle,'Prepared for 2028');
 assert.equal(s.editions.find(e=>e.id===s.activeEditionId)!.year,2026);
 const entries=structuredClone(s.entries);s.editions[0].registrationOpen=false;
 execute(s,owner,{type:'activate',editionId:future.id});
 assert.equal(s.activeEditionId,future.id);assert.equal(future.registrationOpen,false);
 assert.equal(s.editions.find(e=>e.year===2026)!.phase,'Archived');
 assert.equal(s.editions.find(e=>e.year===2027)!.phase,'Archived');
 assert.equal(s.editions.find(e=>e.year===2029)!.phase,'Archived');
 assert.deepEqual(s.entries,entries);assert.ok(s.events.filter(e=>e.id!=='future-edition-event').every(e=>e.state==='Archived'));
 assert.equal(s.events.find(e=>e.id==='future-edition-event')!.state,'Draft');
 assert.throws(()=>execute(s,owner,{type:'activate',editionId:s.editions.find(e=>e.year===2027)!.id}),/Select an upcoming edition/);
});
