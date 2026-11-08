import {useFestival} from './store';
import type {Entry,ManagedEvent,Staff} from './model';
import {Check,Field,Modal,checked,form,str,useAction} from './ui';

export function TeamEditor({entry,event,actor,onClose,staff=false}:{entry:Entry;event:ManagedEvent;actor:Staff;onClose:()=>void;staff?:boolean}){
 const {state,config}=useFestival(),act=useAction();
 const captain=staff?state.staff.find(p=>p.id===entry.participantId):actor;
 if(!captain)return null;
 return <Modal title={'Update team · '+event.title} onClose={onClose}>
  <p>{staff?'Staff substitution · approved policy: '+(event.lateSubstitutions??'Faculty only')+'. A reason is required; captain transfer is unavailable.':'Self-service changes close '+event.teamEditDeadline.replace('T',' ')+' IST.'} Existing members keep their pass; removing a member invalidates their previous pass. Changes lock at event start or first attendance.</p>
  <form className="op-form" onSubmit={ev=>{const f=form(ev);const details={entryId:entry.id,team:str(f,'team'),members:str(f,'members'),memberAccounts:f.getAll('memberAccounts').map(String),eligible:checked(f,'eligible')};if(act(staff?{type:'staffTeam',...details,reason:str(f,'reason')}:{type:'updateTeam',...details}))onClose()}}>
   {event.teamMax>1&&<Field name="team" label="Team name" value={entry.team} required/>}
   <Field name="members" label="Member names (comma separated, captain first)" value={entry.members} required hint={`${event.teamMin}–${event.teamMax} members. Keep ${captain.name} first.`}/>
   {event.teamMax>1&&<fieldset className="op-teammates"><legend>Linked participant accounts</legend>{state.staff.filter(p=>p.role==='Participant'&&p.active&&p.editionId===config.id&&p.id!==captain.id).map(p=><label className="op-check" key={p.id}><input type="checkbox" name="memberAccounts" value={p.id} defaultChecked={entry.attendees.some(a=>a.accountId===p.id)}/>{p.name}</label>)}<small>To remove a linked teammate, remove their name and uncheck their account. Only include consenting fictional teammates in this preview.</small></fieldset>}
   {staff&&<Field label="Substitution reason (minimum 10 characters)" name="reason" required/>}
   <Check name="eligible">The updated team meets the published eligibility and team-size rules.</Check>
   <button className="op-primary">Save team changes</button>
  </form>
 </Modal>;
}
