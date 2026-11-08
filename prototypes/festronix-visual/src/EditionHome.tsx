import {useState} from 'react';
import {useFestival} from './platform/store';
import {Events} from './platform/Events';
import {clock24,eventDate,href,type VisualTheme} from './platform/model';
import {getLandingSettings} from './platform/landingSettings';
import {getFluxTracks} from './fluxProgramme';
import {registrationClosed} from './platform/admission';
import './edition-themes.css';
import './comic-book.css';
import './studio-blueprint-layout.css';
import {ComicBackdrop,ComicPageTexture,ComicMarginCharacter,ComicCredits} from './ComicArtwork';
import {StudioProgrammeArt,BlueprintSignalArt} from './StudioBlueprintArt';

type EditionTheme='Comic'|'Studio'|'Blueprint';

export default function EditionHome({theme}:{theme:EditionTheme}){
 const {config,edition,events,actor}=useFestival();
 const [motionPaused,setMotionPaused]=useState(false);
 const visual=theme as VisualTheme,settings=getLandingSettings(config);
 const schedule=[...events].sort((a,b)=>a.date.localeCompare(b.date)||clock24(a.time).localeCompare(clock24(b.time))).slice(0,3);
 const trackCount=getFluxTracks(events).length;
 const accepting=events.some(event=>!registrationClosed(event,config));
 return <div className={`edition-home edition-home-${theme.toLowerCase()}${motionPaused||!settings.motionEnabled?' edition-motion-paused':''}`} data-event-count={events.length}>
  <section className="edition-hero" aria-labelledby="edition-title">
   {theme==='Comic'&&<ComicBackdrop/>}
   <div className="edition-meta"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>TECHNOLOGY FESTIVAL / {config.label}</span></div>
   <div className="edition-masthead"><h1 id="edition-title">FESTRONI<span>X</span></h1><span className="edition-issue">{theme==='Comic'?'ISSUE':theme==='Studio'?'EDITION':'VERSION'}<b>{config.label}</b></span></div>
   <div className="edition-hero-grid">
    <div className="edition-hero-copy"><p className="edition-eyebrow">{config.tagline}</p><h2>{config.heroTitle}</h2><p className="edition-description">{config.heroBody}</p><div className="edition-hero-actions"><a className="edition-cta" href={href('events',visual)}>Explore events <span aria-hidden="true">↗</span></a><a className="edition-text-link" href={href('schedule',visual)}>Plan your day <span aria-hidden="true">→</span></a></div><dl className="edition-facts"><div><dt>WHEN</dt><dd>{edition.dates}</dd></div><div><dt>WHERE</dt><dd>{config.location}</dd></div></dl></div>
    {theme!=='Comic'&&<div className="edition-hero-art">{theme==='Studio'?<StudioProgrammeArt/>:<BlueprintSignalArt/>}<div className="edition-art-caption"><span>{theme==='Studio'?'A MEETING OF MINDS & MACHINES.':'IDEAS IN. POSSIBILITIES OUT.'}</span><button className="edition-motion-control" onClick={()=>setMotionPaused(p=>!p)} aria-pressed={motionPaused||!settings.motionEnabled} disabled={!settings.motionEnabled}>{!settings.motionEnabled?'Motion disabled in settings':motionPaused?'Resume artwork':'Pause artwork'}</button></div></div>}
   </div>
  </section>
  <div className="edition-index" aria-label="Festival at a glance"><span><b>{String(events.length).padStart(2,'0')}</b> published events</span><span><b>{String(trackCount).padStart(2,'0')}</b> technical tracks</span><span><b>{accepting?'OPEN':'CLOSED'}</b> event registration</span><a href={href('help',visual)}>All you need to know <span aria-hidden="true">↗</span></a></div>
  {settings.showIntro&&<section className="edition-intro" aria-labelledby="edition-intro-title">{theme==='Comic'&&<ComicPageTexture variant="spread"/>}<p className="edition-section-number">01 / THE FESTIVAL</p><h2 id="edition-intro-title">{settings.introTitle}</h2><div><p>{config.intro}</p><a className="edition-text-link" href={href('events',visual)}>Find your challenge ↗</a></div></section>}
  {config.announcements.length>0&&<aside className="edition-announcements" aria-label="Festival announcements"><span>FESTIVAL NOTES</span><ul>{config.announcements.map((item,index)=><li key={index}>{item}</li>)}</ul></aside>}
  <div className="edition-events">{theme==='Comic'&&<ComicPageTexture variant="closing"/>}<Events actor={actor} featured/></div>
  {settings.showSchedule&&<section className="edition-agenda" aria-labelledby="edition-agenda-title">{theme==='Comic'&&<ComicPageTexture variant="spread"/>}<div className="edition-section-head"><div><p className="edition-section-number">02 / YOUR DAY, SORTED</p><h2 id="edition-agenda-title">{settings.scheduleTitle}</h2></div><a className="edition-text-link" href={href('schedule',visual)}>Full schedule ↗</a></div>{schedule.length?<div className="edition-agenda-list">{schedule.map((event,i)=><a href={href('events',visual,{event:event.id})} key={event.id}><span className="edition-agenda-number">{String(i+1).padStart(2,'0')}</span><div><time dateTime={`${event.date}T${clock24(event.time)}:00+05:30`}>{eventDate(event,config)} · {event.time} IST</time><h3>{event.title}</h3><p>{event.venue} · {event.format}</p></div><span className="edition-agenda-arrow" aria-hidden="true">↗</span></a>)}</div>:<p className="edition-empty">The next programme is taking shape. Published events will appear here.</p>}</section>}
  {settings.showVisit&&<section className="edition-visit" aria-labelledby="edition-visit-title">{theme==='Comic'&&<ComicPageTexture variant="spread"/>}{theme==='Comic'&&<ComicMarginCharacter/>}<div><p className="edition-section-number">03 / MAKE YOUR WAY HERE</p><h2 id="edition-visit-title">{settings.visitTitle}</h2><p>{config.location}</p><p>{edition.dates}</p><a className="edition-cta" href={href('help',visual)}>Visit & support <span aria-hidden="true">↗</span></a></div><div className="edition-visit-note"><span aria-hidden="true">↗</span><h3>Bring your curiosity.<br/>Check your event rules.</h3><p>Every event has its own eligibility, team size and registration deadline. Open an event for the information you need before you enter.</p><p className="edition-contact">{config.contact}</p></div></section>}
  {settings.showSponsors&&config.sponsors.length>0&&<section className="edition-sponsors" aria-labelledby="edition-sponsors-title">{theme==='Comic'&&<ComicPageTexture variant="spread"/>}<p className="edition-section-number">THE PEOPLE BEHIND THE POSSIBILITIES</p><h2 id="edition-sponsors-title">{settings.sponsorsTitle}</h2><ul>{config.sponsors.map((sponsor,index)=><li key={index}>{sponsor}</li>)}</ul></section>}
  {settings.showFaq&&config.faqs.length>0&&<section className="edition-faq" aria-labelledby="edition-faq-title">{theme==='Comic'&&<ComicPageTexture variant="spread"/>}<div><p className="edition-section-number">04 / A FEW GOOD QUESTIONS</p><h2 id="edition-faq-title">{settings.faqTitle}</h2></div><div>{config.faqs.map(([question,answer],index)=><details key={index}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>}
  <section className="edition-finale" aria-labelledby="edition-finale-title">{theme==='Comic'&&<ComicPageTexture variant="closing"/>}{theme==='Comic'&&<ComicMarginCharacter character="ripple"/>}<span className="edition-section-number">FESTRONIX / {config.label}</span><h2 id="edition-finale-title">{settings.closingTitle}</h2><a className="edition-cta" href={href('events',visual)}>{settings.primaryCta} <span aria-hidden="true">↗</span></a><p>{settings.closingBody}</p></section>
  {theme==='Comic'&&<ComicCredits/>}
 </div>;
}
