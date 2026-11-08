import {useState} from 'react';
import {useFestival} from './store';
import {href,type ManagedEvent,type Staff} from './model';
import {dateInYear,syncEditionLabel} from './editionIdentity';
import {EditionIdentityFields} from './EditionIdentityFields';
import {Confirm,Empty,Panel,Tag,form,num,str,useAction} from './ui';
import {EventEditor} from './EventEditor';
import {getEditionReadiness} from './editionReadiness';

export function AnnualEditions({actor,onEdit}:{actor:Staff;onEdit:(id:string)=>void}){
 const {state,config}=useFestival(),act=useAction();
 const available=state.editions.filter(e=>e.phase==='Upcoming'&&e.year>config.year).sort((a,b)=>a.year-b.year);
 const [selected,setSelected]=useState(available[0]?.id??''),[confirm,setConfirm]=useState(false);
 const [eventEditor,setEventEditor]=useState<{editionId:string;event?:ManagedEvent}|null>(null);
 const [deleting,setDeleting]=useState<ManagedEvent|null>(null);
 const edition=available.find(e=>e.id===selected)??available[0];
 const events=edition?state.events.filter(e=>e.editionId===edition.id&&e.state!=='Archived'):[];
 const readiness=edition?getEditionReadiness(edition,events):null;
 const extraYear=Math.max(config.year,...state.editions.map(e=>e.year))+1;
 const live=state.events.some(e=>e.editionId===config.id&&e.state==='Live');

 return <div className="op-two">
  <Panel title="Choose an edition" kicker="2026–2030 / READY TO CONFIGURE">
   <p>The editions through 2030 are available. Select a year, edit its settings and event drafts, then preview it before activation.</p>
   {edition?<>
    <label className="op-field"><span>Edition to prepare</span><select aria-label="Edition to prepare" value={edition.id} onChange={e=>setSelected(e.target.value)}>{available.map(e=><option value={e.id} key={e.id}>{e.year} · {e.label} · Upcoming</option>)}</select></label>
    <div className="op-actions"><button onClick={()=>onEdit(edition.id)}>Edit {edition.year} website settings</button><a href={href('home',edition.theme,{preview:edition.id})}>Preview {edition.label} ↗</a></div>
    <p className="op-muted">Preparation stays separate from the current public edition. Event drafts, registration records and student access are not copied from other years.</p>
   </>:<Empty title="No future edition selected">Add another year below when needed.</Empty>}
   {extraYear<=2100&&<details><summary>Add a year after {extraYear-1}</summary><form className="op-form" onSubmit={ev=>{const f=form(ev);act({type:'nextEdition',year:num(f,'year'),label:str(f,'label'),startDate:str(f,'startDate'),endDate:str(f,'endDate')})}}><EditionIdentityFields key={extraYear} year={extraYear} label={syncEditionLabel(extraYear,config.label)} startDate={dateInYear(config.startDate,extraYear)} endDate={dateInYear(config.endDate,extraYear)} minYear={extraYear}/><button className="op-primary">Add future edition</button></form></details>}
  </Panel>

  <Panel title="Prepare event drafts" kicker="UPCOMING EDITION / PREPARATION ONLY" actions={edition?<button className="op-primary" onClick={()=>setEventEditor({editionId:edition.id})}>Add event to {edition.label}</button>:undefined}>
   {edition?<>
    <p>Complete the brief, schedule, venue, eligibility, capacity, fee and event policies now. Drafts stay out of the current public programme and need faculty review before publication. You can edit or remove an unused draft while this edition is upcoming.</p>
    {events.length?<div className="op-roster">{events.map(event=><article key={event.id}>
     <div><Tag>{event.state}</Tag><h3>{event.title}</h3><p>{event.date} · {event.time} IST · {event.venue}</p><small>{event.category} · {event.price?`₹${event.price}`:'Free'} · {event.teamMin}–{event.teamMax} people</small></div>
     <div className="op-actions"><button onClick={()=>setEventEditor({editionId:edition.id,event})}>Edit draft</button>{event.state==='Draft'&&<button onClick={()=>setDeleting(event)}>Delete draft</button>}</div>
    </article>)}</div>:<Empty title="No events prepared yet">Add the first complete event draft before activating this edition.</Empty>}
   </>:<Empty title="Choose an upcoming edition">Select or add a future edition before preparing event drafts.</Empty>}
  </Panel>

  <Panel title="Activation readiness" kicker="SAFE YEARLY HANDOVER">
   {edition&&readiness?<>
    <Tag>{readiness.ready?'READY':'NEEDS ATTENTION'}</Tag>
    {readiness.ready?<p role="status">Required edition content and at least one complete event draft are ready. The edition will still start with registration closed.</p>:<><p role="status">Finish these items before activation. Your changes stay saved in the upcoming edition while you work.</p><ul className="op-checklist">{readiness.issues.map((issue,index)=><li key={index}>{issue}</li>)}</ul></>}
    <p>Current public edition: {config.year} · {config.label}. Activation preserves its registrations, attendance and reports.</p>
    <ul className="op-checklist"><li>Confirm dates, content, event details and theme.</li><li>Close current registration and complete any live events.</li><li>Assign next-year coordinators after activation; faculty owners remain.</li></ul>
    {config.registrationOpen&&<button onClick={()=>act({type:'settings',edition:{...config,registrationOpen:false}})}>Close {config.year} registration</button>}
    {live&&<p className="op-notice">Complete current live events before activating another edition.</p>}
    <div className="op-actions"><button className="op-primary" disabled={!readiness.ready||config.registrationOpen||live} onClick={()=>setConfirm(true)}>Activate {edition.year} edition</button></div>
    <p className="op-muted">Activation archives the current edition and unused earlier presets. The new edition starts with registration closed; previous history is retained.</p>
   </>:<Empty title="No future edition selected">Add a future year to continue.</Empty>}
  </Panel>

  {eventEditor&&edition&&<EventEditor actor={actor} editionId={eventEditor.editionId} event={eventEditor.event} onClose={()=>setEventEditor(null)}/>}
  {deleting&&<Confirm title="Delete this unused event draft?" label="Delete draft" onClose={()=>setDeleting(null)} action={()=>act({type:'delete',eventId:deleting.id})}><p>This removes only this upcoming draft. Events with registrations cannot be deleted, and current-year records are unchanged.</p></Confirm>}
  {confirm&&edition&&<Confirm title={'Activate '+edition.year+'?'} label={'Activate '+edition.year} onClose={()=>setConfirm(false)} action={()=>act({type:'activate',editionId:edition.id})}><p>This makes {edition.label} the active edition with registration closed. Current-year registration and attendance history stays archived.</p></Confirm>}
 </div>;
}
