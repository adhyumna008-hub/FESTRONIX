import {useEffect,useState} from 'react';
import {useFestival} from './platform/store';
import {clock24,eventDate,href} from './platform/model';
import {getLandingSettings} from './platform/landingSettings';
import {registrationClosed} from './platform/admission';
import {Events} from './platform/Events';
import {getFluxTracks} from './fluxProgramme';
import {designs,type StitchTheme} from './designCatalogue';

function EditionClock({start,end}:{start:string;end:string}){
 const [now,setNow]=useState(()=>Date.now());
 useEffect(()=>{if(Date.now()>new Date(end+'T23:59:59+05:30').getTime())return;const id=setInterval(()=>{if(!document.hidden)setNow(Date.now())},1000);return()=>clearInterval(id)},[end]);
 const starts=new Date(start+'T00:00:00+05:30').getTime(),ends=new Date(end+'T23:59:59+05:30').getTime();
 const remaining=Math.max(0,Math.floor((starts-now)/1000));
 return <div className="st-clock"><p className="st-eyebrow">{now>ends?'EDITION COMPLETE':now>=starts?'FESTIVAL DAYS':'COUNTDOWN TO FESTRONIX'} <span>IST</span></p>{now<starts?<div className="st-clock-digits" aria-label="Time until festival begins">{[[Math.floor(remaining/86400),'Days'],[Math.floor(remaining/3600)%24,'Hours'],[Math.floor(remaining/60)%60,'Minutes'],[remaining%60,'Seconds']].map(([value,label])=><div key={label}><b>{String(value).padStart(2,'0')}</b><small>{label}</small></div>)}</div>:<strong className="st-clock-message">{now>ends?'The ideas live on.':'Make the most of it.'}</strong>}<a href="#st-programme">Explore the programme <span aria-hidden="true">↗</span></a></div>;
}

function HeroMark({theme,label}:{theme:StitchTheme;label:string}){
 return <div className="st-hero-mark" aria-hidden="true">{theme==='Comic'?<><span className="st-chapter">CHAPTER / {label}</span><strong>BUILD.<br/>BREAK.<br/><em>DISCOVER!</em></strong><span className="st-burst">WHAT<br/>IF?</span></>:theme==='Panel'?<><span className="st-shape st-shape-circle"/><span className="st-shape st-shape-grid"/><span className="st-shape st-shape-arrow">↗</span><span className="st-shape-label">FORM × FUNCTION × FESTRONIX</span></>:theme==='Blueprint'?<><span className="st-pixel-star">✦</span><strong>F<span>×</span></strong><small>PLAYER ONE / YOU</small></>:<><span className="st-orbit"/><strong>F<span>×</span></strong><small>{theme==='Studio'?'ENGINEERING. EXPRESSION. EXPLORATION.':'BUILD / COMPILE / DISCOVER'}</small></>}</div>;
}

export default function StitchHome({theme}:{theme:StitchTheme}){
 const {config,edition,events,actor}=useFestival(),settings=getLandingSettings(config);
 const tracks=getFluxTracks(events),open=events.filter(event=>!registrationClosed(event,config)).length;
 const dates=[...new Set(events.map(event=>event.date))].sort();
 const schedule=[...events].sort((a,b)=>a.date.localeCompare(b.date)||clock24(a.time).localeCompare(clock24(b.time)));
 const [day,setDay]=useState('');const selectedDay=dates.includes(day)?day:dates[0];
 return <div className="st-home" data-motion={settings.motionEnabled?'on':'off'}>
  <div className="st-institution"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>STUDENTS ACTIVITY COUNCIL / {config.label}</span></div>
  <section className="st-hero" aria-labelledby="st-title"><div className="st-hero-copy"><p className="st-eyebrow"><span className="st-dot"/> ANNUAL TECHNOLOGY FESTIVAL <span>{config.label}</span></p><h1 id="st-title">FESTRONI<span>X</span><small>{theme==='Comic'?'THE NEXT CHAPTER':theme==='Blueprint'?'PRESS START':config.label}</small></h1><h2>{config.heroTitle}</h2><p className="st-lead">{config.heroBody}</p><dl className="st-hero-facts"><div><dt>WHEN</dt><dd>{edition.dates}</dd></div><div><dt>WHERE</dt><dd>{config.location}</dd></div></dl><div className="st-actions"><a className="st-primary" href={href('events',theme)}>{settings.primaryCta} <span aria-hidden="true">↗</span></a><a href={href('schedule',theme)}>{settings.secondaryCta} <span aria-hidden="true">→</span></a></div></div><div className="st-hero-aside"><HeroMark theme={theme} label={config.label}/><EditionClock start={config.startDate} end={config.endDate}/></div></section>
  <dl className="st-metrics">{[[events.length,'Published events','Find your next challenge'],[tracks.length,'Technical tracks','Follow your curiosity'],[events.filter(e=>e.price===0).length,'Free-entry events','Check individual eligibility'],[open,'Accepting registrations','Availability checked per event']].map(([count,label,detail])=><div key={label}><dt>{label}</dt><dd>{String(count).padStart(2,'0')}</dd><p>{detail}</p></div>)}</dl>
  {config.announcements.length>0&&<aside className="st-broadcast" aria-label="Festival announcements"><strong>FESTIVAL NOTES</strong><ul>{config.announcements.map((notice,i)=><li key={i}>{notice}</li>)}</ul></aside>}
  {settings.showIntro&&<section className="st-intro"><p className="st-eyebrow">01 / THE FESTIVAL</p><h2>{settings.introTitle}</h2><div><p>{config.intro}</p><a href={href('help',theme)}>Get to know FESTRONIX <span aria-hidden="true">↗</span></a></div></section>}
  {settings.showCategories&&tracks.length>0&&<section className="st-tracks" aria-labelledby="st-tracks-title"><div className="st-section-head"><div><p className="st-eyebrow">EXPLORE YOUR INTERESTS</p><h2 id="st-tracks-title">{theme==='Comic'?'Choose your chapter.':theme==='Blueprint'?'Select your stage.':'Different disciplines. Shared curiosity.'}</h2></div><a href={href('events',theme)}>All events ↗</a></div><div className="st-track-grid">{tracks.map((track,index)=><a href={href('events',theme,{category:track.name})} key={track.name}><span className="st-track-number">{String(index+1).padStart(2,'0')} /</span><h3>{track.name}</h3><p>{track.count} published {track.count===1?'event':'events'}</p><b aria-hidden="true">↗</b></a>)}</div></section>}
  <div className="st-programme" id="st-programme"><Events actor={actor} featured/></div>
  {settings.showSchedule&&<section className="st-agenda"><div className="st-section-head"><div><p className="st-eyebrow">02 / PLAN YOUR VISIT</p><h2>{settings.scheduleTitle}</h2></div><a href={href('schedule',theme)}>Full schedule ↗</a></div>{dates.length?<><div className="st-day-tabs" role="group" aria-label="Schedule day">{dates.map((date,index)=><button key={date} aria-pressed={date===selectedDay} onClick={()=>setDay(date)}>Day {index+1}<span>{new Date(date+'T12:00:00+05:30').toLocaleDateString('en-IN',{day:'numeric',month:'short',timeZone:'Asia/Kolkata'})}</span></button>)}</div><div className="st-agenda-list">{schedule.filter(event=>event.date===selectedDay).map(event=><a key={event.id} href={href('events',theme,{event:event.id})}><time dateTime={`${event.date}T${clock24(event.time)}:00+05:30`}>{event.time}<small>IST</small></time><div><span>{event.category} / {event.format}</span><h3>{event.title}</h3><p>{event.venue}</p></div><b aria-hidden="true">↗</b></a>)}</div></>:<p>The programme will appear here as events are published.</p>}</section>}
  {settings.showVisit&&<section className="st-visit"><div><p className="st-eyebrow">03 / SEE YOU ON CAMPUS</p><h2>{settings.visitTitle}</h2><p>{config.location}</p><p>{config.contact}</p><a className="st-primary" href={href('help',theme)}>Directions & help ↗</a></div><div className="st-entry-note"><span aria-hidden="true">F×</span><h3>Find an event.<br/>Make it your own.</h3><p>Check eligibility and entry details, register, then find your personal QR pass in your workspace once your entry is confirmed.</p><a href={href('participant',theme)}>My registrations & passes ↗</a></div></section>}
  {settings.showSponsors&&config.sponsors.length>0&&<section className="st-sponsors"><p className="st-eyebrow">{settings.sponsorsTitle}</p><ul>{config.sponsors.map((sponsor,i)=><li key={i}>{sponsor}</li>)}</ul></section>}
  {settings.showFaq&&config.faqs.length>0&&<section className="st-faq"><div><p className="st-eyebrow">BEFORE YOU ARRIVE</p><h2>{settings.faqTitle}</h2></div><div>{config.faqs.map(([question,answer],i)=><details key={i}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>}
  <section className="st-finale"><p className="st-eyebrow">FESTRONIX / {config.label}</p><h2>{settings.closingTitle}</h2><p>{settings.closingBody}</p><a className="st-primary" href={href('events',theme)}>{settings.primaryCta} ↗</a><small>{designs[theme].motif}</small></section>
 </div>;
}
