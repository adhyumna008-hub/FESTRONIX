import test from 'node:test';
import assert from 'node:assert/strict';
import {execute} from '../src/platform/commands';
import {ensureEditionCatalogue} from '../src/platform/editionCatalogue';
import {getLandingSettings,validateLandingSettings,type LandingSettings} from '../src/platform/landingSettings';
import {seedState,type FestivalState} from '../src/platform/model';

const staff=(state:FestivalState,id:string)=>state.staff.find(person=>person.id===id)!;
const current=(state:FestivalState)=>state.editions.find(edition=>edition.id===state.activeEditionId)!;

test('saved editions without landing settings gain safe read defaults without mutation',()=>{
 const state=seedState(),before=structuredClone(state),edition=current(state),settings=getLandingSettings(edition);
 assert.equal(settings.primaryCta,'Explore events');assert.equal(settings.fluxHero,'Core');assert.equal(settings.motionEnabled,true);assert.deepEqual(settings.featuredEventIds,[]);
 settings.featuredEventIds.push('quantum');assert.deepEqual(getLandingSettings(edition).featuredEventIds,[]);
 assert.deepEqual(state,before);
 const malformed={...edition,landing:{primaryCta:42,showFaq:'no',fluxQuality:'Maximum',featuredEventIds:['quantum','quantum',null]} as unknown as LandingSettings};
 const safe=getLandingSettings(malformed);assert.equal(safe.primaryCta,'Explore events');assert.equal(safe.showFaq,true);assert.equal(safe.fluxQuality,'Auto');assert.deepEqual(safe.featuredEventIds,['quantum']);
});

test('an owner can publish normalized presentation settings without modifying business data',()=>{
 const state=seedState(),before=structuredClone(state),edition=current(state);
 const landing={...getLandingSettings(edition),primaryCta:'  Choose your challenge  ',eventsTitle:'Our engineering programme',featuredEventIds:['robot','quantum'],showFaq:false,pulseAccent:'Cobalt',fluxHero:'Network / Portal',fluxQuality:'Reduced'} as LandingSettings;
 execute(state,staff(state,'primary'),{type:'settings',edition:{...edition,landing}});
 assert.equal(edition.landing?.primaryCta,'Choose your challenge');assert.deepEqual(edition.landing?.featuredEventIds,['robot','quantum']);assert.equal(edition.landing?.showFaq,false);assert.equal(edition.landing?.fluxHero,'Network / Portal');
 assert.deepEqual(state.events,before.events);assert.deepEqual(state.entries,before.entries);assert.deepEqual(state.staff,before.staff);
 assert.deepEqual(state.editions.filter(x=>x.id!==edition.id),before.editions.filter(x=>x.id!==edition.id));
});

test('staff roles cannot acquire website publishing authority through landing controls',()=>{
 for(const id of ['dev','helper-dev','participant','approver']){
  const state=seedState(),before=structuredClone(state),edition=current(state);
  assert.throws(()=>execute(state,staff(state,id),{type:'settings',edition:{...edition,landing:{...getLandingSettings(edition),showIntro:false}}}),/faculty owner/i);
  assert.deepEqual(state,before);
 }
});

test('malformed controls, overlong copy and duplicate feature slots fail before state mutation',()=>{
 for(const patch of [{showIntro:'false'},{pulseAccent:'Neon'},{fluxHero:'Club Gallery'},{fluxQuality:'Ultra'},{primaryCta:'x'.repeat(33)},{eventsTitle:' '},{featuredEventIds:['quantum','quantum']},{featuredEventIds:['quantum','robot','signal','ai']},{customScript:'alert(1)'}]){
  const state=seedState(),before=structuredClone(state),edition=current(state);
  assert.throws(()=>execute(state,staff(state,'primary'),{type:'settings',edition:{...edition,landing:{...getLandingSettings(edition),...patch} as LandingSettings}}));
  assert.deepEqual(state,before);
 }
});

test('featured events must remain scoped to published records in the edited edition',()=>{
 const state=seedState(),edition=current(state),future=state.editions.find(e=>e.year===2030)!;
 const source=state.events.find(e=>e.id==='quantum')!;
 state.events.push({...structuredClone(source),id:'future-event',editionId:future.id,state:'Published'});
 for(const eventId of ['future-event','missing-event'])assert.throws(()=>validateLandingSettings({...getLandingSettings(edition),featuredEventIds:[eventId]},edition.id,state.events),/edition/i);
 source.state='Draft';assert.throws(()=>validateLandingSettings({...getLandingSettings(edition),featuredEventIds:['quantum']},edition.id,state.events),/published/i);
 source.state='Live';assert.deepEqual(validateLandingSettings({...getLandingSettings(edition),featuredEventIds:['quantum']},edition.id,state.events).featuredEventIds,['quantum']);
});

test('preparing the next year copies presentation choices but clears event selections',()=>{
 const state=seedState(),edition=current(state);edition.landing={...getLandingSettings(edition),eventsTitle:'Build something excellent.',featuredEventIds:['quantum'],pulseAccent:'Cobalt'};
 const beforeEntries=structuredClone(state.entries),beforeStaff=structuredClone(state.staff);
 execute(state,staff(state,'primary'),{type:'nextEdition',year:2031,label:'2K31',startDate:'2031-10-18',endDate:'2031-10-19'});
 const next=state.editions.find(e=>e.year===2031)!;
 assert.equal(next.landing?.eventsTitle,'Build something excellent.');assert.equal(next.landing?.pulseAccent,'Cobalt');assert.deepEqual(next.landing?.featuredEventIds,[]);
 assert.equal(next.registrationOpen,false);assert.equal(next.phase,'Upcoming');assert.deepEqual(edition.landing.featuredEventIds,['quantum']);
 assert.deepEqual(state.entries,beforeEntries);assert.deepEqual(state.staff,beforeStaff);assert.equal(state.events.filter(e=>e.editionId===next.id).length,0);
});

test('new default year presets also clear old featured IDs while edited presets survive',()=>{
 const state=seedState(),edition=current(state);edition.landing={...getLandingSettings(edition),featuredEventIds:['quantum'],closingTitle:'See you on campus.'};
 const edited=state.editions.find(e=>e.year===2030)!;edited.landing={...getLandingSettings(edited),closingTitle:'A custom 2030 invitation'};
 state.editions=state.editions.filter(e=>e.id===edition.id||e.year===2030);
 ensureEditionCatalogue(state);
 for(const year of [2027,2028,2029]){const next=state.editions.find(e=>e.year===year)!;assert.deepEqual(next.landing?.featuredEventIds,[]);assert.equal(next.landing?.closingTitle,'See you on campus.');}
 assert.equal(state.editions.find(e=>e.year===2030)!.landing?.closingTitle,'A custom 2030 invitation');
});

test('editing future presentation does not activate it or change the current edition',()=>{
 const state=seedState(),activeBefore=structuredClone(current(state)),future=state.editions.find(e=>e.year===2030)!;
 execute(state,staff(state,'primary'),{type:'settings',edition:{...future,theme:'Pulse',landing:{...getLandingSettings(future),closingTitle:'Welcome to the next edition.'}}});
 assert.deepEqual(current(state),activeBefore);assert.equal(future.phase,'Upcoming');assert.equal(future.registrationOpen,false);assert.equal(future.landing?.closingTitle,'Welcome to the next edition.');
});
