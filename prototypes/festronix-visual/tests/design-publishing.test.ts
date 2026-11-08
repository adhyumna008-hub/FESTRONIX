import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState,type VisualTheme} from '../src/platform/model';
import {execute} from '../src/platform/commands';
import {designChoices} from '../src/designCatalogue';

test('design publication and restore retain all operational records and remember the previous presentation',()=>{
 const state=seedState(),owner=state.staff.find(s=>s.id==='primary')!,edition=state.editions.find(e=>e.id===state.activeEditionId)!;
 const before=structuredClone(state),original=edition.theme;
 for(const theme of designChoices){
  const previous=edition.theme;
  execute(state,owner,{type:'publishDesign',editionId:edition.id,theme});
  assert.equal(edition.theme,theme);
  if(previous!==theme)assert.equal(edition.previousTheme,previous);
  assert.deepEqual(state.entries,before.entries);assert.deepEqual(state.events,before.events);assert.deepEqual(state.staff,before.staff);
 }
 execute(state,owner,{type:'publishDesign',editionId:edition.id,theme:original});
 assert.equal(edition.theme,original);assert.equal(state.activeEditionId,before.activeEditionId);
});

test('upcoming design publication does not activate an edition or change the current design',()=>{
 const state=seedState(),before=structuredClone(state),owner=state.staff.find(s=>s.id==='primary')!,future=state.editions.find(e=>e.year===2030)!;
 execute(state,owner,{type:'publishDesign',editionId:future.id,theme:'Comic'});
 assert.equal(future.theme,'Comic');assert.equal(future.phase,'Upcoming');assert.equal(future.registrationOpen,false);
 assert.deepEqual(state.editions.find(e=>e.id===state.activeEditionId),before.editions.find(e=>e.id===before.activeEditionId));
 assert.deepEqual(state.entries,before.entries);assert.deepEqual(state.events,before.events);
});

test('design publishing rejects unprivileged, revoked and stale accounts before mutation',()=>{
 for(const id of ['participant','dev','helper-dev','approver']){
  const state=seedState(),before=structuredClone(state);
  assert.throws(()=>execute(state,state.staff.find(s=>s.id===id)!,{type:'publishDesign',editionId:state.activeEditionId,theme:'Comic'}),/faculty owner/i);
  assert.deepEqual(state,before);
 }
 const state=seedState(),owner=state.staff.find(s=>s.id==='primary')!,stale={...owner};owner.active=false;
 const before=structuredClone(state);assert.throws(()=>execute(state,stale,{type:'publishDesign',editionId:state.activeEditionId,theme:'Comic'}),/active access/i);assert.deepEqual(state,before);
});

test('invalid and archived designs are rejected and reselecting a design retains rollback history',()=>{
 const state=seedState(),owner=state.staff.find(s=>s.id==='primary')!,edition=state.editions.find(e=>e.id===state.activeEditionId)!;
 const before=structuredClone(state);
 assert.throws(()=>execute(state,owner,{type:'publishDesign',editionId:edition.id,theme:'unknown' as VisualTheme}),/supported/i);assert.deepEqual(state,before);
 const archived=state.editions.find(e=>e.phase==='Upcoming')!;archived.phase='Archived';const archivedBefore=structuredClone(state);
 assert.throws(()=>execute(state,owner,{type:'publishDesign',editionId:archived.id,theme:'Comic'}),/active or upcoming/i);assert.deepEqual(state,archivedBefore);
 execute(state,owner,{type:'publishDesign',editionId:edition.id,theme:'Comic'});const previous=edition.previousTheme;
 execute(state,owner,{type:'publishDesign',editionId:edition.id,theme:'Comic'});assert.equal(edition.previousTheme,previous);
});
