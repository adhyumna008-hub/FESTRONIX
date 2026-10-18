import test from 'node:test';
import assert from 'node:assert/strict';
import {dateInYear,editionLabel,syncEditionLabel} from '../src/platform/editionIdentity';
import {seedState} from '../src/platform/model';
import {execute} from '../src/platform/commands';

test('edition year generates short/full labels and retains custom identity',()=>{
 assert.equal(editionLabel(2028),'2K28');assert.equal(editionLabel(2031,'year'),'2031');
 assert.equal(syncEditionLabel(2028,'2K27'),'2K28');assert.equal(syncEditionLabel(2028,'2027'),'2028');
 assert.equal(syncEditionLabel(2028,'Ignition'),'Ignition');
 assert.equal(dateInYear('2028-02-29T18:00',2029),'2029-02-28T18:00');
 assert.equal(dateInYear('',2028),'');
});

test('changing a pre-registration edition year synchronizes its label, event dates and deadlines',()=>{
 const s=seedState();s.entries=[];const owner=s.staff.find(x=>x.id==='primary')!;
 const edition={...s.editions[0],year:2031,startDate:'2031-10-18',endDate:'2031-10-19'};
 execute(s,owner,{type:'settings',edition});
 assert.equal(s.editions[0].label,'2K31');
 for(const e of s.events){assert.ok(e.date.startsWith('2031-'));assert.ok(e.deadline.startsWith('2031-'));assert.ok(e.teamEditDeadline.startsWith('2031-'));}
 assert.throws(()=>execute(s,owner,{type:'settings',edition:{...edition,year:2028.5}}),/year/);
});

test('registered editions retain history while the next edition uses the chosen year style',()=>{
 const s=seedState(),owner=s.staff.find(x=>x.id==='primary')!,before=structuredClone(s.events);
 assert.throws(()=>execute(s,owner,{type:'settings',edition:{...s.editions[0],year:2031,startDate:'2031-10-18',endDate:'2031-10-19'}}),/Prepare a new edition/);
 execute(s,owner,{type:'nextEdition',year:2031,label:'2026',startDate:'2031-10-18',endDate:'2031-10-19'});
 assert.equal(s.editions.at(-1)!.label,'2031');assert.equal(s.editions[0].label,'2K26');
 assert.deepEqual(s.events,before);assert.equal(s.editions.at(-1)!.phase,'Upcoming');
});
