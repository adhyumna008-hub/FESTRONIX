import type {Entry,FestivalState,Staff} from './model';
import {ensureEditionCatalogue} from './editionCatalogue';

export interface Attendee {id:string;name:string;accountId?:string;token:string;checkedAt:string;checkedBy:string;method:''|'QR'|'Manual';reason:string}
export function createAttendees(names:string[],accountIds:Record<string,string>={}):Attendee[]{return names.map(name=>({id:crypto.randomUUID(),name,accountId:accountIds[name],token:'FESTRONIX-DEMO:'+crypto.randomUUID(),checkedAt:'',checkedBy:'',method:'',reason:''}))}
export function syncAttendance(entry:Entry){entry.checkedIn=entry.attendees.some(a=>!!a.checkedAt);entry.checkedAt=entry.attendees.find(a=>a.checkedAt)?.checkedAt??'';entry.token=entry.attendees[0]?.token??''}
export function belongsTo(entry:Entry,actor:Staff){return entry.participantId===actor.id||entry.attendees.some(a=>a.accountId===actor.id)}
// Upgrade the existing browser dataset in place. No registrations or history are discarded.
export function upgradeState(state:FestivalState):FestivalState {
 if(!state.staff.some(s=>s.id==='participant-2'))state.staff.push({id:'participant-2',name:'User Two',role:'Participant',editionId:state.activeEditionId,active:true});
 for(const entry of state.entries){
  if(!Array.isArray(entry.attendees)){
   const names=entry.members.split(',').map(n=>n.trim()).filter(Boolean);
   entry.attendees=createAttendees(names.length?names:[entry.name]);
   entry.attendees[0].accountId=entry.participantId;
   // A historic team check-in cannot prove which individual attended.
   if(entry.checkedIn){entry.legacyTeamCheckIn=entry.checkedAt||'Previously recorded';entry.note+=(entry.note?' ':'')+'Legacy team check-in retained in history; individual attendance must be verified.';}
   syncAttendance(entry);
  }
 }
 return ensureEditionCatalogue(state);
}
