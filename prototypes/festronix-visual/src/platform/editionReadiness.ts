import {clock24, type Edition, type ManagedEvent} from './model';

export interface EditionReadiness {
 ready:boolean;
 issues:string[];
}

const missingText=(value:string|undefined|null)=>!value?.trim();
const placeholderText=(value:string|undefined|null)=>missingText(value)||/\b(to be confirmed|tbd|placeholder|awaiting(?: faculty)? confirmation|do not pay in this preview)\b/i.test(value??'');
const isDate=(value:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(`${value}T00:00:00.000Z`);return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value};

/** Checks the content an owner needs before making an upcoming edition active. */
export function getEditionReadiness(edition:Edition,events:ManagedEvent[],now=Date.now()):EditionReadiness{
 const issues:string[]=[];
 if(edition.phase!=='Upcoming')issues.push('Choose an upcoming edition to prepare.');
 if(!Number.isInteger(edition.year)||edition.year<2020||edition.year>2100||!edition.label.trim())issues.push('Set a valid edition year and public label.');
 if(!isDate(edition.startDate)||!isDate(edition.endDate)||edition.startDate>edition.endDate||!edition.startDate.startsWith(String(edition.year))||!edition.endDate.startsWith(String(edition.year)))issues.push('Set valid start and end dates in the edition year.');
 if(missingText(edition.tagline))issues.push('Add the festival tagline.');
 if(missingText(edition.heroTitle))issues.push('Add the home page headline.');
 if(missingText(edition.heroBody))issues.push('Add the home page description.');
 if(missingText(edition.intro))issues.push('Add the festival introduction.');
 if(missingText(edition.location))issues.push('Add the campus location.');
 if(placeholderText(edition.contact))issues.push('Add confirmed support contact details.');
 if(!edition.faqs.length||edition.faqs.some(([question,answer])=>missingText(question)||missingText(answer)))issues.push('Complete at least one FAQ question and answer.');

 const planned=events.filter(event=>event.editionId===edition.id&&event.state!=='Archived');
 if(!planned.length)issues.push('Add at least one event draft.');
 for(const event of planned){
  const name=event.title.trim()||'Untitled event';
  const incomplete:string[]=[];
  if(event.title.trim().length<5)incomplete.push('a title');
  if(event.description.trim().length<20)incomplete.push('a description');
  if(event.venue.trim().length<2)incomplete.push('a venue');
  if(event.eligibility.trim().length<10)incomplete.push('eligibility and safety rules');
  if(!event.prize.trim())incomplete.push('a prize or learning outcome');
  if(!Number.isInteger(event.capacity)||event.capacity<1)incomplete.push('a valid capacity');
  if(!Number.isInteger(event.teamMin)||!Number.isInteger(event.teamMax)||event.teamMin<1||event.teamMax<event.teamMin)incomplete.push('valid team sizes');
  if(!Number.isInteger(event.duration)||event.duration<15)incomplete.push('a session duration');
  if(!['Code','Build','Discover'].includes(event.category))incomplete.push('a supported track');
  if(incomplete.length)issues.push(`${name}: add ${incomplete.join(', ')}.`);

  const eventStart=isDate(event.date)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(clock24(event.time))
   ?new Date(`${event.date}T${clock24(event.time)}+05:30`).getTime():NaN;
  if(!Number.isFinite(eventStart)||event.date<edition.startDate||event.date>edition.endDate)issues.push(`${name}: set an event date and time within the edition dates.`);

  const deadline=event.deadline?new Date(`${event.deadline}+05:30`).getTime():NaN;
  if(!Number.isFinite(deadline)||deadline<=now||!Number.isFinite(eventStart)||deadline>eventStart)issues.push(`${name}: set a future registration deadline before the event starts.`);
  const teamDeadline=event.teamEditDeadline?new Date(`${event.teamEditDeadline}+05:30`).getTime():NaN;
  if(!Number.isFinite(teamDeadline)||!Number.isFinite(eventStart)||teamDeadline>eventStart)issues.push(`${name}: set a team-edit deadline at or before the event starts.`);
  if(event.price>0&&placeholderText(event.paymentInstructions))issues.push(`${name}: add faculty-approved payment instructions for this paid event.`);
 }

 return {ready:issues.length===0,issues};
}
