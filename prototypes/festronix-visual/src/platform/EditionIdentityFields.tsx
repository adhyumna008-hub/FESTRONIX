import {useState} from 'react';
import {dateInYear,editionLabel,editionLabelStyle,type EditionLabelStyle} from './editionIdentity';

export function EditionIdentityFields({year,label,startDate,endDate,minYear=2026,locked=false,fixedYear=false}:{year:number;label:string;startDate:string;endDate:string;minYear?:number;locked?:boolean;fixedYear?:boolean}) {
 const [draftYear,setYear]=useState(String(year)),[style,setStyle]=useState<EditionLabelStyle>(()=>editionLabelStyle(label));
 const [custom,setCustom]=useState(label),[start,setStart]=useState(startDate),[end,setEnd]=useState(endDate);
 const validYear=Number.isInteger(Number(draftYear))&&Number(draftYear)>=minYear&&Number(draftYear)<=2100;
 const display=style==='custom'?custom:validYear?editionLabel(Number(draftYear),style):'—';
 const changeYear=(value:string)=>{
  setYear(value);const next=Number(value);
  if(Number.isInteger(next)&&next>=minYear&&next<=2100){setStart(dateInYear(start,next));setEnd(dateInYear(end,next));}
 };
 return <>
  <div className="op-form-grid">
   <label className="op-field"><span>Edition year</span><input name="year" aria-label="Edition year" type="number" min={minYear} max={2100} value={draftYear} onChange={e=>changeYear(e.target.value)} readOnly={locked||fixedYear} required/><small>{fixedYear?'Choose another year from the edition dropdown.':locked?'Registrations exist. Select the next year in Annual rollover.':'Changing the year updates the label and date years below.'}</small></label>
   <label className="op-field"><span>Year display style</span><select aria-label="Year display style" value={style} onChange={e=>setStyle(e.target.value as EditionLabelStyle)}><option value="short">2K format{validYear?' · '+editionLabel(Number(draftYear)):''}</option><option value="year">Full year{validYear?' · '+draftYear:''}</option><option value="custom">Custom edition label</option></select></label>
   {style==='custom'?<label className="op-field"><span>Custom edition label</span><input name="label" aria-label="Custom edition label" value={custom} onChange={e=>setCustom(e.target.value)} maxLength={16} required/><small>Custom labels are kept exactly as entered; update their year manually.</small></label>:<input name="label" type="hidden" value={display}/>}
   <label className="op-field"><span>Start date</span><input name="startDate" aria-label="Start date" type="date" value={start} onChange={e=>setStart(e.target.value)} readOnly={locked} required/></label>
   <label className="op-field"><span>End date</span><input name="endDate" aria-label="End date" type="date" value={end} onChange={e=>setEnd(e.target.value)} readOnly={locked} required/></label>
  </div>
  <p className="op-notice" aria-live="polite">Preview: <strong>FESTRONIX {display}</strong> · year {draftYear||'—'}. Saving applies this identity across all four themes. An upcoming edition stays private until activated.</p>
 </>;
}
