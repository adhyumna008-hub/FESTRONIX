import {belongsTo} from './attendance';
import {hasBlockedClash} from './admission';
import type {Entry,FestivalState,ManagedEvent,Staff} from './model';

/** Shared local admission rules for initial registration, roster edits and staff walk-ins. */
export function prepareRoster(state:FestivalState,event:ManagedEvent,captain:Staff,membersText:string,team:string,memberAccounts:string[]=[],exceptEntry?:string){
 const require=(ok:boolean,message:string)=>{if(!ok)throw new Error(message)};
 const selected=memberAccounts.map(id=>state.staff.find(p=>p.id===id&&p.role==='Participant'&&p.active&&p.editionId===event.editionId));
 require(selected.every(Boolean),'A teammate account is unavailable.');
 require(new Set(memberAccounts).size===memberAccounts.length&&!selected.some(p=>p!.id===captain.id),'Choose each teammate account once, excluding yourself.');
 const names=membersText.split(',').map(n=>n.trim()).filter(Boolean);
 for(const member of selected)if(!names.includes(member!.name))names.push(member!.name);
 require(names[0]===captain.name,'Keep your own account name as the first team member.');
 require(new Set(names.map(n=>n.toLowerCase())).size===names.length,'Each team member must be listed once.');
 require(names.every(n=>n.length>=2&&n.length<=100),'Member names must contain 2–100 characters.');
 require(names.length>=event.teamMin&&names.length<=event.teamMax,`Provide ${event.teamMin}–${event.teamMax} comma-separated member names, including yourself.`);
 require(event.teamMax===1||!!team.trim(),'Enter a team name.');
 require(team.trim().length<=100,'Keep the team name within 100 characters.');
 for(const member of [captain,...selected as Staff[]])require(!state.entries.some(r=>r.id!==exceptEntry&&r.eventId===event.id&&r.status!=='WITHDRAWN'&&belongsTo(r,member)),'You or a selected teammate already have an active registration for this event.');
 const accounts:Record<string,string>={[captain.name]:captain.id};
 selected.forEach(p=>{accounts[p!.name]=p!.id});
 require(!hasBlockedClash(state,event,Object.values(accounts),exceptEntry),'This event blocks overlapping confirmed registrations for a team member.');
 return {names,accounts};
}

export function teamChangesOpen(entry:Entry,event:ManagedEvent,now=Date.now()){
 return entry.status!=='WITHDRAWN'&&!entry.attendees.some(a=>a.checkedAt)&&event.state==='Published'&&new Date(event.teamEditDeadline+'+05:30').getTime()>now;
}
