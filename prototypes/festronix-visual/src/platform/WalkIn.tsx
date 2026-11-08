import {useState} from 'react';
import {useFestival} from './store';
import type {ManagedEvent} from './model';
import {Check,Field,Modal,checked,form,str,useAction} from './ui';

export function WalkIn({event,onClose}:{event:ManagedEvent;onClose:()=>void}){
 const {state,config}=useFestival(),act=useAction();
 const participants=state.staff.filter(p=>p.role==='Participant'&&p.active&&p.editionId===config.id);
 const [id,setId]=useState(participants[0]?.id??'');
 const captain=participants.find(p=>p.id===id);
 return <Modal title={'Add walk-in · '+event.title} onClose={onClose}>
  <p>Faculty-approved walk-ins · capacity and duplicate checks still apply. Check eligibility in person. Paid entries require separate proof verification before admission. A separate check-in records attendance.</p>
  {captain?<form className="op-form" onSubmit={ev=>{const f=form(ev);if(act({type:'walkin',eventId:event.id,participantId:id,team:str(f,'team'),members:str(f,'members'),eligible:checked(f,'eligible'),reason:str(f,'reason'),paymentRef:str(f,'paymentRef'),proofName:str(f,'proofName')}))onClose()}}>
   <label className="op-field"><span>Participant / team captain</span><select value={id} onChange={e=>setId(e.target.value)}>{participants.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
   {event.teamMax>1&&<Field label="Team name" name="team" required/>}
   <Field key={id} label="Member names (captain first)" name="members" value={captain.name} required hint={`${event.teamMin}–${event.teamMax} members. Add names only for fictional, consenting teammates.`}/>
   <Field label="Eligibility / college-ID check note" name="reason" required hint="Record the check performed; never record the ID document number or upload the document."/>
   {event.price>0&&<><p className="op-notice">Sample fee ₹{event.price}. Do not pay. Use invented reference/proof metadata. Pending proof does not reserve capacity or admit the participant.</p><p>{event.paymentInstructions}</p><Field name="paymentRef" label="Sample payment / UTR reference" required/><Field name="proofName" label="Sample proof filename" value="walk-in-sample.png" required/></>}
   <Check name="eligible">I checked the published eligibility and team-size rules.</Check>
   <button className="op-primary">{event.price>0?'Submit walk-in for payment review':'Confirm free walk-in'}</button>
  </form>:<p>No active participant accounts are available. Ask faculty to restore the participant account for this edition.</p>}
 </Modal>;
}
