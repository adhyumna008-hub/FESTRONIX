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

test('preset settings survive reload; activation is explicit and preserves old records',()=>{
 const s=seedState(),owner=s.staff.find(x=>x.id==='primary')!;
 const future=s.editions.find(e=>e.year===2028)!;future.heroTitle='Prepared for 2028';
 ensureEditionCatalogue(s);assert.equal(s.editions.find(e=>e.year===2028)!.heroTitle,'Prepared for 2028');
 assert.equal(s.editions.find(e=>e.id===s.activeEditionId)!.year,2026);
 const entries=structuredClone(s.entries);s.editions[0].registrationOpen=false;
 execute(s,owner,{type:'activate',editionId:future.id});
 assert.equal(s.activeEditionId,future.id);assert.equal(future.registrationOpen,false);
 assert.equal(s.editions.find(e=>e.year===2026)!.phase,'Archived');
 assert.equal(s.editions.find(e=>e.year===2027)!.phase,'Archived');
 assert.equal(s.editions.find(e=>e.year===2029)!.phase,'Upcoming');
 assert.deepEqual(s.entries,entries);assert.ok(s.events.every(e=>e.state==='Archived'));
 assert.throws(()=>execute(s,owner,{type:'activate',editionId:s.editions.find(e=>e.year===2027)!.id}),/Select an upcoming edition/);
});
