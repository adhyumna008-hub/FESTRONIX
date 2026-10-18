import {useState} from 'react';
import {useFestival} from './store';
import {href} from './model';
import {dateInYear,syncEditionLabel} from './editionIdentity';
import {EditionIdentityFields} from './EditionIdentityFields';
import {Confirm,Empty,Panel,Tag,form,num,str,useAction} from './ui';

export function AnnualEditions({onEdit}:{onEdit:(id:string)=>void}){
 const {state,config}=useFestival(),act=useAction();
 const available=state.editions.filter(e=>e.phase==='Upcoming'&&e.year>config.year).sort((a,b)=>a.year-b.year);
 const [selected,setSelected]=useState(available[0]?.id??''),[confirm,setConfirm]=useState(false);
 const edition=available.find(e=>e.id===selected)??available[0];
 const extraYear=Math.max(config.year,...state.editions.map(e=>e.year))+1;
 const live=state.events.some(e=>e.editionId===config.id&&e.state==='Live');
 return <div className="op-two">
  <Panel title="Choose an edition" kicker="2026–2030 / READY TO CONFIGURE">
   <p>The editions through 2030 are already available. Select a year, edit its settings and preview it before activation.</p>
   {edition?<><label className="op-field"><span>Edition to activate</span><select aria-label="Edition to activate" value={edition.id} onChange={e=>setSelected(e.target.value)}>{available.map(e=><option value={e.id} key={e.id}>{e.year} · {e.label} · Upcoming</option>)}</select></label><div className="op-actions"><button onClick={()=>onEdit(edition.id)}>Edit {edition.year} settings</button><a href={href('home',edition.theme,{preview:edition.id})}>Preview {edition.label} ↗</a></div><p className="op-muted">Each year has separate settings. New editions start with registration closed and no events, registrations, payment records, attendance, sponsors or student permissions.</p></>:<Empty title="No future edition selected">Add another year below when needed.</Empty>}
   {extraYear<=2100&&<details><summary>Add a year after {extraYear-1}</summary><form className="op-form" onSubmit={ev=>{const f=form(ev);act({type:'nextEdition',year:num(f,'year'),label:str(f,'label'),startDate:str(f,'startDate'),endDate:str(f,'endDate')})}}><EditionIdentityFields key={extraYear} year={extraYear} label={syncEditionLabel(extraYear,config.label)} startDate={dateInYear(config.startDate,extraYear)} endDate={dateInYear(config.endDate,extraYear)} minYear={extraYear}/><button className="op-primary">Add future edition</button></form></details>}
  </Panel>
  <Panel title="Activate when ready" kicker="SAFE YEARLY HANDOVER">
   {edition?<><Tag>PRIVATE PREPARATION</Tag><h3>FESTRONIX {edition.label}</h3><p>Current public edition: {config.year} · {config.label}. Selecting a year above does not change the public website.</p><ul className="op-checklist"><li>Review the selected year’s dates, content and theme.</li><li>Close current registration and complete live events.</li><li>Activation preserves previous registrations, attendance and reports.</li><li>Assign the new year’s coordinators after activation. Faculty owners remain.</li></ul>{config.registrationOpen&&<button onClick={()=>act({type:'settings',edition:{...config,registrationOpen:false}})}>Close {config.year} registration</button>}{live&&<p className="op-notice">Complete current live events before activating another edition.</p>}<div className="op-actions"><button className="op-primary" disabled={config.registrationOpen||live} onClick={()=>setConfirm(true)}>Activate {edition.year} edition</button></div><p className="op-muted">Activation archives the current edition and any skipped, unused preset years, and expires old edition staff access.</p></>:<Empty title="All listed editions are current or archived">Add a future year to continue.</Empty>}
  </Panel>
  {confirm&&edition&&<Confirm title={'Activate '+edition.year+'?'} label={'Activate '+edition.year} onClose={()=>setConfirm(false)} action={()=>{act({type:'activate',editionId:edition.id})}}><p>This makes {edition.label} public with registration closed, preserves existing history and expires current edition staff access.</p></Confirm>}
 </div>;
}
