import {useEffect,useState} from 'react';
import {useFestival} from './platform/store';
import {clock24,eventDate,href,type ManagedEvent} from './platform/model';
import {registrationClosed} from './platform/admission';
import {getLandingSettings} from './platform/landingSettings';
import {displayFonts} from './themes';
import {workspaceFor} from './platform/demoAuth';
import {EventPoster} from './platform/EventPoster';
import {Modal} from './platform/ui';
import {LoginPanel} from './LoginPanel';
import {FestivalHeader} from './FestivalHeader';
import {PulseHero} from './PulseHero';
import {FluxHero} from './FluxHero';
import {getFluxTracks} from './fluxProgramme';
import {selectFeaturedEvents} from './programmePresentation';
import './platform/portal.css';
import './platform/events-directory.css';
import './festival-landing.css';
import './pulse-landing.css';
import './flux-landing.css';

export default function FestivalLanding({theme}:{theme:'Pulse'|'Flux'}){
 const {config,edition,events,actor,storageWarning}=useFestival();
 const settings=getLandingSettings(config);
 const [login,setLogin]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>{const link=document.createElement('link');link.rel='stylesheet';link.href=`https://fonts.googleapis.com/css2?family=${displayFonts[theme]}&display=swap`;document.head.append(link);return()=>link.remove()},[theme]);
 const featured=selectFeaturedEvents(events,settings.featuredEventIds);
 const [lead,...supporting]=featured;
 const sorted=[...events].sort((a,b)=>a.date.localeCompare(b.date)||clock24(a.time).localeCompare(clock24(b.time)));
 const days=[...new Set(sorted.map(e=>e.date))];
 const categories=getFluxTracks(events);
 const accepting=events.some(e=>!registrationClosed(e,config));
 const detailHref=(event:ManagedEvent)=>href('events',theme,{event:event.id});
 const eventMeta=(event:ManagedEvent)=><><span>{event.format}</span><span>{event.time} IST</span><span>{event.fee}</span></>;
 const status=(event:ManagedEvent)=>event.state==='Live'?'In progress':registrationClosed(event,config)?'Registration closed':'Registration available';
 return <div className="festival-landing op-app" data-theme={theme} data-accent={settings.pulseAccent} data-paused={paused||!settings.motionEnabled}>
  <a className="fl-skip" href="#programme">Skip to events</a>
  <FestivalHeader theme={theme} onLogin={()=>setLogin(true)}/>
  {config.phase==='Upcoming'&&<div className="fl-preview-note">Upcoming edition preview · registration stays closed until faculty activation</div>}
  {storageWarning&&<p className="fl-preview-note" role="status">{storageWarning}</p>}
  <main id="festival-home">
   {theme==='Pulse'?<PulseHero config={config} events={featured} settings={settings} paused={paused||login}/>:<FluxHero config={config} events={events} settings={settings} paused={paused||login}/>}
   <div className="fl-container fl-edition-strip"><span>{edition.dates}</span><span>{config.location}</span><span className="fl-admission-state">{config.phase==='Upcoming'?'Upcoming programme':accepting?'Check event availability':'Browse this edition’s programme'}</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'}</button></div>
   {settings.showIntro&&<section className="fl-container fl-intro" aria-labelledby="fl-intro-title"><h2 id="fl-intro-title">{settings.introTitle}</h2><p>{config.intro}</p></section>}
   {config.announcements.length>0&&<aside className="fl-container fl-announcements" aria-label="Festival announcements"><strong>Festival notices</strong><ul>{config.announcements.map((text,i)=><li key={i}>{text}</li>)}</ul></aside>}
   <section id="programme" className="fl-container fl-programme" aria-labelledby="fl-events-title">
    <div className="fl-section-heading"><h2 id="fl-events-title">{settings.eventsTitle}</h2><a href={href('events',theme)}>All events <span aria-hidden="true">↗</span></a></div>
    {lead?<><article className="fl-feature"><a href={detailHref(lead)} className="fl-feature-art" aria-label={'View '+lead.title}><EventPoster event={lead} neutral={theme==='Flux'}/><span className="fl-art-category">{lead.category}</span></a><div className="fl-feature-copy"><div className="fl-event-topline"><span>{lead.category}</span><span>{status(lead)}</span></div><h3><a href={detailHref(lead)}>{lead.title}</a></h3><p>{lead.description}</p><div className="fl-event-meta">{eventMeta(lead)}</div><p className="fl-event-place">{eventDate(lead,config)} · {lead.venue}</p><a className="fl-button" href={detailHref(lead)}>View details <span aria-hidden="true">↗</span></a></div></article>
     {supporting.length>0&&<div className="fl-supporting">{supporting.map(event=><article className="fl-event-row" key={event.id}><a href={detailHref(event)} className="fl-row-art" aria-label={'View '+event.title}><EventPoster event={event} neutral={theme==='Flux'}/></a><div className="fl-row-copy"><div className="fl-event-topline"><span>{event.category}</span><span>{status(event)}</span></div><h3><a href={detailHref(event)}>{event.title}</a></h3><p>{event.description}</p></div><div className="fl-row-details"><div className="fl-event-meta">{eventMeta(event)}</div><p className="fl-event-place">{eventDate(event,config)} · {event.venue}</p><a className="fl-inline-link" href={detailHref(event)}>View details <span aria-hidden="true">↗</span></a></div></article>)}</div>}</>:<div className="fl-empty"><h3>The programme is taking shape.</h3><p>Faculty-approved events will appear here when published.</p><a href={href('events',theme)}>View the event directory ↗</a></div>}
   </section>
   {settings.showCategories&&categories.length>0&&<section className="fl-container fl-tracks" aria-label="Explore event categories">{categories.map(({name,count})=><a href={href('events',theme,{category:name})} key={name}><span>{name}</span><small>{count} {count===1?'event':'events'}</small><b aria-hidden="true">↗</b></a>)}</section>}
   {settings.showSchedule&&<section className="fl-container fl-schedule" aria-labelledby="fl-schedule-title"><div className="fl-section-heading"><h2 id="fl-schedule-title">{settings.scheduleTitle}</h2><a href={href('schedule',theme)}>Full schedule <span aria-hidden="true">↗</span></a></div>{days.length?<div className="fl-days">{days.slice(0,2).map(date=><div key={date}><h3>{eventDate(sorted.find(e=>e.date===date)!,config)}</h3>{sorted.filter(e=>e.date===date).slice(0,4).map(event=><a href={detailHref(event)} className="fl-session" key={event.id}><time dateTime={`${event.date}T${clock24(event.time)}:00+05:30`}>{event.time}</time><span>{event.title}<small>{event.venue}</small></span><b aria-hidden="true">↗</b></a>)}</div>)}</div>:<p className="fl-muted">Published session times will appear here.</p>}</section>}
   {settings.showVisit&&<section className="fl-container fl-visit" aria-labelledby="fl-visit-title"><div><h2 id="fl-visit-title">{settings.visitTitle}</h2><p>{config.location}</p><p>{config.contact}</p><a className="fl-inline-link" href={href('help',theme)}>Visit & help <span aria-hidden="true">↗</span></a></div><div className="fl-visit-mark" aria-hidden="true"><span>F</span><b>×</b><small>FESTRONIX {config.label}</small></div></section>}
   {settings.showSponsors&&config.sponsors.length>0&&<section className="fl-container fl-sponsors" aria-label="Festival sponsors"><h2>{settings.sponsorsTitle}</h2><ul>{config.sponsors.map((s,i)=><li key={i}>{s}</li>)}</ul></section>}
   {settings.showFaq&&config.faqs.length>0&&<section className="fl-container fl-faq" aria-labelledby="fl-faq-title"><h2 id="fl-faq-title">{settings.faqTitle}</h2><div>{config.faqs.map(([question,answer],i)=><details key={i}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>}
   <section className="fl-container fl-closing" aria-labelledby="fl-closing-title"><div><h2 id="fl-closing-title">{settings.closingTitle}</h2><p>{settings.closingBody}</p></div><a className="fl-button" href={href('events',theme)}>{settings.primaryCta}<span aria-hidden="true">↗</span></a></section>
  </main>
  <footer className="fl-container fl-footer"><a className="fl-footer-brand" href={href('home',theme)}>FESTRONI<span>X</span><small>{config.label}</small></a><p>{config.location}<br/>{config.contact}</p><nav aria-label="Footer navigation"><a href={href('events',theme)}>Events</a><a href={href('schedule',theme)}>Schedule</a><a href={href('help',theme)}>Visit & help</a><a href={href(actor?workspaceFor(actor):'participant',theme)}>{actor?'My workspace':'Demo sign-in'}</a></nav><p className="fl-demo-note">Local test edition · fictional data and demo accounts · no real payment or admission</p></footer>
  {login&&<Modal title="FESTRONIX account" onClose={()=>setLogin(false)}><LoginPanel titleId="landing-login" onClose={()=>setLogin(false)}/></Modal>}
 </div>;
}
