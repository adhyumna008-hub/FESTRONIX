import {useEffect,useRef,useState} from 'react';
import type {FestivalEvent} from './data';
import {useFestival} from './platform/store';
import {href,eventDate} from './platform/model';
import {EventPoster} from './platform/EventPoster';
import {getLandingSettings} from './platform/landingSettings';
import {getFluxTracks} from './fluxProgramme';
import {selectFeaturedEvents} from './programmePresentation';
import {WorkspaceLinks,PublicNotices} from './platform/PublicLinks';
import './glass-home.css';
import {CampusX} from './CampusX';
import {registrationClosed} from './platform/admission';
import {CampusHeader} from './CampusHeader';
import {LoginPanel} from './LoginPanel';
import './campus-refinements.css';
import './campus-composition.css';

const Arrow=()=> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6"/></svg>;
type Sheet='login'|FestivalEvent|null;
export default function GlassHome(){
 const {edition,events,faqs,config,scheduleDays,actor}=useFestival();
 const [interest,setInterest]=useState('All'),[day,setDay]=useState(Number(config.startDate.slice(8))),[sheet,setSheet]=useState<Sheet>(null),[loginEvent,setLoginEvent]=useState<FestivalEvent|null>(null),[calm,setCalm]=useState(false),[menuOpen,setMenuOpen]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null),root=useRef<HTMLDivElement>(null);
 const open=(next:Sheet)=>{if(!dialog.current?.open)trigger.current=document.activeElement as HTMLElement;setLoginEvent(null);setSheet(next)};
 const requestRegistration=(event:FestivalEvent)=>{if(actor?.role==='Participant'){location.assign(href('events','Campus',{event:event.id,register:'1'}));return}setLoginEvent(event);setSheet('login')};
 const sheetOpen=sheet!==null;
 const close=()=>setSheet(null);
 useEffect(()=>{
  const font=document.createElement('link');font.rel='stylesheet';font.href='https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap';
  document.head.append(font);return()=>font.remove();
 },[]);
 useEffect(()=>{
  const node=dialog.current;if(!node)return;
  if(sheet){
   node.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';
   const containFocus=(event:KeyboardEvent)=>{
    if(event.key!=='Tab')return;
    const controls=Array.from(node.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
    const first=controls[0],last=controls.at(-1);if(!first||!last)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   };
   node.addEventListener('keydown',containFocus);
   return()=>{node.removeEventListener('keydown',containFocus);document.body.style.overflow=previous;node.close();trigger.current?.focus({preventScroll:true});};
  }
 },[sheetOpen]);
 const visited=useRef(new WeakSet<Element>());
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const mq=matchMedia('(prefers-reduced-motion: reduce)');
  let observer:IntersectionObserver|undefined;
  const targets=()=>Array.from(el.querySelectorAll<HTMLElement>('[data-gl-reveal] .gl-section-heading,[data-gl-reveal] .gl-interest-list,[data-gl-reveal] .gl-interest-description,.gl-event-card,.gl-club,.gl-timetable>button,.gl-visit-title,.gl-visit-note,.gl-questions>div'));
  const setup=()=>{
   observer?.disconnect();el.querySelectorAll('.gl-waiting').forEach(node=>node.classList.remove('gl-waiting'));
   targets().forEach(node=>node.classList.remove('gl-reveal-waiting'));
   if(calm||mq.matches||!('IntersectionObserver' in window))return;
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('gl-reveal-waiting');visited.current.add(entry.target);observer?.unobserve(entry.target)}}),{threshold:.06,rootMargin:'0px 0px 40px 0px'});
   targets().forEach((node,index)=>{node.classList.add('gl-reveal-item');node.style.setProperty('--gl-reveal-delay',(index%3)*65+'ms');if(!visited.current.has(node)&&node.getBoundingClientRect().top>innerHeight){node.classList.add('gl-reveal-waiting');observer?.observe(node)}else visited.current.add(node)});
  };
  setup();mq.addEventListener('change',setup);
  const revealFocus=(event:FocusEvent)=>{const section=(event.target as HTMLElement)?.closest('[data-gl-reveal]');section?.querySelectorAll('.gl-reveal-waiting').forEach(node=>{node.classList.remove('gl-reveal-waiting');visited.current.add(node)})};
  el.addEventListener('focusin',revealFocus);
  return()=>{observer?.disconnect();mq.removeEventListener('change',setup);el.removeEventListener('focusin',revealFocus);targets().forEach(node=>node.classList.remove('gl-reveal-waiting'))};
 },[calm,interest,day]);
 useEffect(()=>{const previous=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior=calm?'auto':'smooth';return()=>{document.documentElement.style.scrollBehavior=previous}},[calm]);
 const tracks=getFluxTracks(events),settings=getLandingSettings(config);
 const activeInterest=tracks.some(track=>track.name===interest)?interest:'All';
 const interests=[{name:'All events',category:'All'},...tracks.map(track=>({name:track.name,category:track.name}))];
 const selectedInterest=activeInterest==='All'?{line:'The programme',copy:'Compare each event’s brief, entry requirements and time. Register for events separately.'}:{line:activeInterest,copy:'Explore the published events in this category. Check each event’s brief, requirements and availability.'};
 const filtered=activeInterest==='All'?selectFeaturedEvents(events,settings.featuredEventIds):events.filter(event=>(event.category.trim()||'Other events').toLowerCase()===activeInterest.toLowerCase());
 const scheduled=events.filter(event=>event.day===day);
 useEffect(()=>{if(!scheduleDays.includes(day))setDay(scheduleDays[0]??Number(config.startDate.slice(8)))},[scheduleDays.join(','),day,config.startDate]);
 return <div className={'gl-home gl-campus-composed'+(calm?' gl-calm':'')+(sheet?' gl-paused':'')} ref={root}>
  <a className="gl-skip" href="#discover">Skip to event discovery</a>
  <CampusHeader onLogin={()=>open('login')} onMenuChange={setMenuOpen}/>
  <main id="home">
   <section className="gl-hero" aria-labelledby="gl-title">
    <div className="gl-hero-meta"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>{config.tagline}</span></div>
    <h1 id="gl-title" className="gl-wordmark">FESTRONI<span>X</span><sup>{edition.label}</sup></h1>
    <div className="gl-hero-stage">
     <div className="gl-hero-copy"><p className="gl-eyebrow"><span className="gl-dot"/> VARDHAMAN’S TECHNOLOGY FESTIVAL</p><h2>{config.heroTitle}</h2><p>{config.heroBody}</p><div className="gl-hero-cta"><a className="gl-button gl-button-orange" href={href('events','Campus')}>Explore events <Arrow/></a><a className="gl-text-link" href="#lineup">Plan your day <span aria-hidden="true">↓</span></a></div><div className="gl-hero-facts"><span><b>{edition.dates}</b><small>Sample edition dates</small></span><span><b>Vardhaman campus</b><small>Hyderabad, India</small></span></div></div>
     <CampusX paused={calm||sheetOpen||menuOpen}/>
    </div>
    <div className="gl-hero-bottom"><span>THE {edition.year} EDITION / TECHNOLOGY, MADE TOGETHER.</span><a href="#discover">See the programme <span aria-hidden="true">↓</span></a><button onClick={()=>setCalm(!calm)} aria-pressed={calm}>{calm?'Motion off':'Motion on'} <span aria-hidden="true">◉</span></button></div>
   </section>
   <PublicNotices theme="Campus"/>
   <section className="gl-campus-intro" aria-label="About FESTRONIX"><p className="gl-eyebrow">A FESTIVAL FOR<br/>PEOPLE WHO MAKE THINGS.</p><div><p>{config.intro}</p><dl><div><dt>Published events</dt><dd>{String(events.length).padStart(2,'0')}</dd></div><div><dt>Technical tracks</dt><dd>{String(tracks.length).padStart(2,'0')}</dd></div><div><dt>Edition</dt><dd>{edition.label}</dd></div></dl></div></section>
   <section id="discover" className="gl-section gl-discover" data-gl-reveal>
    <div className="gl-section-heading"><div><p className="gl-eyebrow">01 / THE PROGRAMME</p><h2>Pick your<br/><span>next challenge.</span></h2></div><p>Individual events. Different disciplines.<br/>One place to find your team’s next project.</p></div>
    <div className="gl-interest-list" aria-label="Choose an interest">{interests.map(item=><button key={item.category} aria-pressed={item.category===activeInterest} onClick={()=>setInterest(item.category)}>{item.name}<span aria-hidden="true">{item.category===activeInterest?'↗':'+'}</span></button>)}</div>
    <div className="gl-interest-description" aria-live="polite"><h3>{selectedInterest.line}</h3><p>{selectedInterest.copy}</p></div>
    <div className={'gl-programme-board'+(filtered.length===1?' gl-programme-single':filtered.length===2?' gl-programme-pair':'')}>{filtered.slice(0,3).map((event,index)=><article className={'gl-programme-event gl-event-card'+(index===0?' gl-programme-feature':'')} key={event.id}>
     <div className="gl-programme-art"><EventPoster event={event}/></div>
     <div className="gl-programme-meta"><span>{String(index+1).padStart(2,'0')} / {event.category}</span><span>{event.format}</span></div>
     <h3><button onClick={()=>open(event)}><span className="gl-programme-title">{event.title}</span><Arrow/></button></h3>
     {index===0&&<p className="gl-programme-description">{event.description}</p>}
     <dl className="gl-programme-facts"><div><dt>When</dt><dd>{eventDate(event,config)} · {event.time}</dd></div><div><dt>Where</dt><dd>{event.venue}</dd></div></dl>
     <div className="gl-programme-actions"><strong>{event.fee}</strong><button onClick={()=>open(event)}>Details <span aria-hidden="true">↗</span></button><button className="gl-card-register" disabled={registrationClosed(event,config)} onClick={()=>requestRegistration(event)}>{registrationClosed(event,config)?'Registration closed':'Register ↗'}</button></div>
    </article>)}</div>
    {filtered.length===0&&<div className="gl-coming"><span className="gl-coming-mark" aria-hidden="true">↗</span><div><h3>No matching events published yet.</h3><p>{events.length?'Check another category for published events.':'Faculty-approved events will appear here when the programme is published.'}</p>{tracks.length>0&&<a className="gl-text-link" href="#clubs">Explore event categories <Arrow/></a>}</div></div>}
    <a className="gl-all-events" href={href('events','Campus')}>View all events & register <Arrow/></a><p className="gl-fineprint">Sample events and dates. Real registrations and payments are not connected.</p>
   </section>
   {tracks.length>0&&<section id="clubs" className="gl-section gl-clubs" data-gl-reveal><div className="gl-section-heading"><div><p className="gl-eyebrow">02 / FIND YOUR FIELD</p><h2>What are<br/><span>you into?</span></h2></div><p>Start with a discipline.<br/>The event brief will take it from there.</p></div><div className="gl-track-index">{tracks.map((track,index)=><a key={track.name} className="gl-club gl-track-row" href={href('events','Campus',{category:track.name})}><span className="gl-track-number">{String(index+1).padStart(2,'0')}</span><div><small>EVENT CATEGORY</small><h3>{track.name}</h3></div><p>Read the event briefs, compare requirements and choose your challenge.</p><span className="gl-track-count">{track.count} {track.count===1?'event':'events'}</span><Arrow/></a>)}</div></section>}
   <section id="lineup" className="gl-section gl-lineup" data-gl-reveal><div className="gl-section-heading"><div><p className="gl-eyebrow">03 / MAKE A DAY OF IT</p><h2>Your technical<br/><span>event schedule.</span></h2></div><div className="gl-days" aria-label="Choose schedule day">{scheduleDays.map((date,index)=><button key={date} aria-pressed={day===date} onClick={()=>setDay(date)}>Day 0{index+1}<small>{date} / {new Date(config.startDate+'T12:00:00').toLocaleString('en-IN',{month:'short'})}</small></button>)}</div></div><div className="gl-timetable" aria-live="polite">{scheduled.map(event=><button key={event.id} onClick={()=>open(event)}><time>{event.time}</time><div><span>{event.category} / {event.format}</span><h3>{event.title}</h3></div><span className="gl-timetable-venue">{event.venue}</span><Arrow/></button>)}{scheduled.length===0&&<p className="gl-schedule-empty">Published sessions will appear here when their schedule is ready.</p>}</div><p className="gl-fineprint">Sample schedule · Hyderabad local time (IST). Confirmed sessions will appear in the final programme.</p></section>
   <section id="visit" className="gl-section gl-visit" data-gl-reveal><div className="gl-visit-title"><p className="gl-eyebrow">04 / ON CAMPUS</p><h2>Make a plan.<br/>We’ll see you here.</h2><p>{config.location}</p><a className="gl-text-link" href={href('help','Campus')}>Travel, eligibility & help <Arrow/></a></div><div className="gl-visit-note"><p className="gl-eyebrow">BEFORE YOU SET OFF</p><ol><li><span>01</span>Check your event’s time and venue.</li><li><span>02</span>Confirm your team and registration status.</li><li><span>03</span>Bring the equipment listed in the event brief.</li></ol><small>{config.contact}</small></div></section>
   {config.sponsors.length>0&&<section id="sponsors" className="gl-section gl-sponsors" data-gl-reveal><div className="gl-section-heading"><div><p className="gl-eyebrow">EDITION PARTNERS</p><h2>Supporting the<br/><span>next generation.</span></h2></div></div><ul className="gl-sponsor-list">{config.sponsors.map((name,i)=><li key={i}>{name}</li>)}</ul></section>}
   <section id="questions" className="gl-section gl-questions" data-gl-reveal><div><p className="gl-eyebrow">A FEW THINGS TO KNOW</p><h2>Good questions.<br/><span>Clear answers.</span></h2></div><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
   <section className="gl-last-call"><div><p className="gl-eyebrow">FESTRONIX / {edition.label}</p><h2>Your next<br/><em>project awaits.</em></h2></div><div><p>Read the brief. Find your people.<br/>Pick an event and get started.</p><a className="gl-button gl-button-dark" href={href('events','Campus')}>Browse the programme <Arrow/></a></div></section>
  </main>
  <footer className="gl-footer"><a className="gl-footer-brand" href="#home">FESTRONIX<span>↗</span></a><div><span>VARDHAMAN · {edition.label}</span><button onClick={()=>open('login')}>Participant login <Arrow/></button><span>Technology festival · Interactive preview</span></div><WorkspaceLinks theme="Campus"/></footer>
  <dialog ref={dialog} className={'gl-dialog '+(sheet==='login'?'gl-auth-dialog':'gl-event-dialog')} aria-labelledby="gl-dialog-title" onCancel={close} onClick={event=>{if(event.target===dialog.current)close();}}>
   <button className="gl-close" onClick={close} aria-label="Close dialog">Close <span aria-hidden="true">×</span></button>
   {sheet==='login'?<LoginPanel titleId="gl-dialog-title" eventTitle={loginEvent?.title} eventId={loginEvent?.id} onClose={close}/>:sheet&&typeof sheet==='object'?<><p className="gl-eyebrow">{sheet.category} / SAMPLE EVENT</p><h2 id="gl-dialog-title">{sheet.title}</h2><p>{sheet.description}</p><dl>{[['When',`${eventDate(sheet as import('./platform/model').ManagedEvent,config)} · ${sheet.time} IST`],['Where',sheet.venue],['Entry',sheet.fee],['Format',sheet.format]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>{sheet.rules}</p><div className="gl-login-notice">Sample event · test registrations are saved only in your browser. No payment is collected.</div><div className="registration-actions"><button className="gl-button gl-register" disabled={registrationClosed(sheet as import('./platform/model').ManagedEvent,config)} onClick={()=>requestRegistration(sheet)}>{registrationClosed(sheet as import('./platform/model').ManagedEvent,config)?'Registration closed':actor?.role==='Participant'?'Register':'Log in to register'} <Arrow/></button></div></>:null}
  </dialog>
 </div>;
}
