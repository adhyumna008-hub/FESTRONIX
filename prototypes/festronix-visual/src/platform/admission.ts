import {overlaps,type Edition,type Entry,type FestivalState,type ManagedEvent} from './model';

export function registrationClosed(event:ManagedEvent,edition:Edition,now=Date.now()){
 return !edition.registrationOpen||event.state!=='Published'||!(new Date(event.deadline+'+05:30').getTime()>now);
}

export function entryAccountIds(entry:Entry){return [...new Set([entry.participantId,...entry.attendees.flatMap(a=>a.accountId?[a.accountId]:[])])]}
export function hasBlockedClash(state:FestivalState,event:ManagedEvent,accountIds:string[],exceptEntry?:string){
 if(event.clashPolicy!=='Block')return false;
 return state.entries.some(r=>r.id!==exceptEntry&&r.status==='CONFIRMED'&&entryAccountIds(r).some(id=>accountIds.includes(id))&&state.events.some(other=>other.id===r.eventId&&overlaps(event,other)));
}
