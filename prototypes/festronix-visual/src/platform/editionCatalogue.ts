import type {Edition,FestivalState} from './model';
import {dateInYear,syncEditionLabel} from './editionIdentity';

export const DEFAULT_EDITION_YEARS=[2026,2027,2028,2029,2030] as const;

/** Add editable annual presets without copying events, entries or staff privileges. */
export function ensureEditionCatalogue(state:FestivalState):FestivalState {
 const active=state.editions.find(e=>e.id===state.activeEditionId);
 if(!active)return state;
 // The owner corrected the original fictional demo's current year to 2026.
 // Retain stable IDs and every related record instead of resetting browser data.
 if(state.editionCatalogueVersion!==1&&active.id==='edition-2027'&&active.year===2027&&!state.editions.some(e=>e.year===2026)){
  active.year=2026;active.label=syncEditionLabel(2026,active.label);
  active.startDate=dateInYear(active.startDate,2026);active.endDate=dateInYear(active.endDate,2026);
  for(const e of state.events.filter(e=>e.editionId===active.id)){
   for(const field of ['date','deadline','teamEditDeadline'] as const)if(e[field].startsWith('2027-'))e[field]=dateInYear(e[field],2026);
   e.day=Number(e.date.slice(8));
  }
  state.audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor:'Preview migration',action:'Owner correction: current demo edition is 2026. Related records and IDs retained.'});
 }
 for(const year of DEFAULT_EDITION_YEARS){
  if(state.editions.some(e=>e.year===year))continue;
  const presetId='edition-preset-'+year;
  const edition:Edition={...structuredClone(active),id:state.editions.some(e=>e.id===presetId)?crypto.randomUUID():presetId,year,label:syncEditionLabel(year,active.label),startDate:dateInYear(active.startDate,year),endDate:dateInYear(active.endDate,year),phase:year>active.year?'Upcoming':'Archived',registrationOpen:false,sponsors:[],announcements:[]};
  state.editions.push(edition);
 }
 state.editionCatalogueVersion=1;
 return state;
}
