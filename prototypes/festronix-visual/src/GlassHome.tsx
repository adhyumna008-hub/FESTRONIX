import {useEffect,useRef,useState} from 'react';
import {edition,events,faqs,type FestivalEvent} from './data';
import './glass-home.css';
import {campusClubs} from './ClubSymbols';
import {ClubArtwork} from './ClubArtwork';
import {PrototypeThemes} from './PrototypeThemes';
import {CampusX} from './CampusX';
import {LoginPanel} from './LoginPanel';
import './campus-refinements.css';

const interests=[
 {name:'Everything',line:'A little outside your usual.',copy:'Start with a challenge, stay for the people. Find your way into the festival.',category:'All'},
 {name:'Hackathons',line:'Your next idea starts here.',copy:'Find a team, write the first line and build something you can put in someone’s hands.',category:'Code'},
 {name:'Workshops',line:'Less watching. More doing.',copy:'Get hands-on with new tools and leave knowing something you didn’t yesterday.',category:'Discover'},
 {name:'Esports',line:'Bring your competitive side.',copy:'For the clutch moments and the teams behind them. Esports titles and fixtures will be announced.',category:'Pending'},
 {name:'Talks',line:'Meet a new point of view.',copy:'Conversations and lectures that connect classroom ideas to what comes next. Speakers will be announced.',category:'Pending'},
 {name:'Fun & culture',line:'Make room for the unexpected.',copy:'Film, stories, anime and the activities between the big events. The club programme is on its way.',category:'Pending'}
];
const Arrow=()=> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6"/></svg>;
type Sheet='menu'|'login'|FestivalEvent|null;
export default function GlassHome(){
 const [interest,setInterest]=useState(0),[day,setDay]=useState(18),[sheet,setSheet]=useState<Sheet>(null),[loginEvent,setLoginEvent]=useState<FestivalEvent|null>(null),[calm,setCalm]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null),root=useRef<HTMLDivElement>(null);
 const open=(next:Sheet)=>{if(!dialog.current?.open)trigger.current=document.activeElement as HTMLElement;setLoginEvent(null);setSheet(next)};
 const requestRegistration=(event:FestivalEvent)=>{setLoginEvent(event);setSheet('login')};
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
 const selectedInterest=interests[interest],filtered=events.filter(event=>selectedInterest.category==='All'||event.category===selectedInterest.category);
 return <div className={'gl-home'+(calm?' gl-calm':'')+(sheet?' gl-paused':'')} ref={root}>
  <a className="gl-skip" href="#discover">Skip to event discovery</a>
  <header className="gl-header">
   <a href="#home" className="gl-brand" aria-label="FESTRONIX home"><span className="gl-institutions"><img src="/wardhaman-college-of-engineering.png" alt="Vardhaman College of Engineering"/><img src="/sac-logo.png" alt="Students Activity Council"/></span><span>FESTRONI<span className="gl-orange">X</span><small>VARDHAMAN · {edition.label}</small></span></a>
   <div className="gl-header-actions"><button className="gl-login-link" aria-haspopup="dialog" onClick={()=>open('login')}>Log in <span aria-hidden="true">↗</span></button><button className="gl-menu-toggle" onClick={()=>open('menu')} aria-haspopup="dialog" aria-expanded={sheet==='menu'}>Explore <span className="gl-menu-glyph" aria-hidden="true"><i/><i/></span></button></div>
  </header>
  <main id="home">
   <section className="gl-hero" aria-labelledby="gl-title">
    <div className="gl-hero-meta"><span>THE CAMPUS IS YOUR PLAYGROUND.</span><span>TECH. CULTURE. A LITTLE CHAOS.</span></div>
    <h1 id="gl-title" className="gl-wordmark">FESTRONI<span>X</span><sup>’27</sup></h1>
    <div className="gl-hero-stage">
     <div className="gl-hero-copy"><p className="gl-eyebrow"><span className="gl-dot"/> VARDHAMAN’S STUDENT FESTIVAL</p><h2>Out of syllabus.<br/>Into your <em>element.</em></h2><p>Big ideas. Close games. New obsessions. A campus full of reasons to show up.</p><div className="gl-hero-cta"><a className="gl-button gl-button-orange" href="#discover">Find your thing <Arrow/></a><a className="gl-text-link" href="#lineup">Plan your day <span aria-hidden="true">↓</span></a></div><div className="gl-hero-facts"><span><b>{edition.dates}</b><small>Sample edition dates</small></span><span><b>Vardhaman campus</b><small>Hyderabad, India</small></span></div></div>
     <CampusX paused={calm||sheetOpen}/>
    </div>
    <div className="gl-hero-bottom"><span>BUILT BY CLUBS. BROUGHT TO LIFE BY YOU.</span><a href="#discover">Scroll into the good stuff <span aria-hidden="true">↓</span></a><button onClick={()=>setCalm(!calm)} aria-pressed={calm}>{calm?'Motion off':'Motion on'} <span aria-hidden="true">◉</span></button></div>
   </section>
   <section id="discover" className="gl-section gl-discover" data-gl-reveal>
    <div className="gl-section-heading"><div><p className="gl-eyebrow">01 / PICK YOUR KIND OF DAY</p><h2>Come for one thing.<br/><span>Find a few more.</span></h2></div><p>You don’t need to be “a tech person.”<br/>Just bring whatever you’re into.</p></div>
    <div className="gl-interest-list" aria-label="Choose an interest">{interests.map((item,index)=><button key={item.name} aria-pressed={index===interest} onClick={()=>setInterest(index)}>{item.name}<span aria-hidden="true">{index===interest?'↗':'+'}</span></button>)}</div>
    <div className="gl-interest-description" aria-live="polite"><h3>{selectedInterest.line}</h3><p>{selectedInterest.copy}</p></div>
    <div className="gl-event-grid">{filtered.map((event,index)=><button className={'gl-event-card gl-event-'+event.id} key={event.id} onClick={()=>open(event)} aria-label={'View '+event.title}><div className="gl-event-art"><span className="gl-event-number">0{index+1}</span><span className="gl-event-type">{event.category==='Code'?'HACK & BUILD':event.category==='Build'?'COMPETITION':'WORKSHOP'}</span>{event.category==='Code'?<div className="gl-code-art" aria-hidden="true"><span>&lt;</span><span>/&gt;</span></div>:event.category==='Build'?<div className="gl-robo-art" aria-hidden="true"><span>R</span><i>×</i><span>R</span></div>:<div className="gl-signal-art" aria-hidden="true">{Array.from({length:15},(_,n)=><i key={n} style={{height:(20+Math.sin(n*1.4)**2*70)+'%'}}/>)}</div>}<span className="gl-card-arrow"><Arrow/></span></div><div className="gl-event-info"><p>{event.format} <span>OCT {event.day}</span></p><h3>{event.title}</h3><div><span>{event.venue}</span><b>{event.fee}</b></div></div></button>)}</div>
    {filtered.length===0&&<div className="gl-coming"><span className="gl-coming-mark" aria-hidden="true">↗</span><div><h3>The next good thing is on its way.</h3><p>This programme is being shaped by the clubs. Explore their worlds while the lineup comes together.</p><a className="gl-text-link" href="#clubs">Meet the clubs <Arrow/></a></div></div>}
    <p className="gl-fineprint">Sample events and dates for this preview. Registrations are not open here.</p>
   </section>
   <section id="clubs" className="gl-section gl-clubs" data-gl-reveal><div className="gl-section-heading"><div><p className="gl-eyebrow">02 / FIND YOUR PEOPLE</p><h2>Different worlds.<br/><span>Same campus.</span></h2></div><a className="gl-button gl-button-light" href="#discover">Explore the events <Arrow/></a></div><div className="gl-club-grid">{campusClubs.map((club,index)=><article className="gl-club" key={club.id}><div className={'gl-club-image gl-club-poster gl-club-poster-'+club.id}><ClubArtwork id={club.id}/><span className="gl-club-index">0{index+1}</span><span className="gl-club-category">{club.label}</span></div><h3>{club.name}</h3><p>{club.note}</p></article>)}</div><div className="gl-clubs-foot"><span>Student-led. Curiosity-powered.</span><p>Five interests. A campus full of possibilities.</p></div></section>
   <section id="lineup" className="gl-section gl-lineup" data-gl-reveal><div className="gl-section-heading"><div><p className="gl-eyebrow">03 / MAKE A DAY OF IT</p><h2>A plan.<br/><span>With room for detours.</span></h2></div><div className="gl-days" aria-label="Choose schedule day">{[18,19].map((date,index)=><button key={date} aria-pressed={day===date} onClick={()=>setDay(date)}>Day 0{index+1}<small>OCT {date}</small></button>)}</div></div><div className="gl-timetable" aria-live="polite">{events.filter(event=>event.day===day).map(event=><button key={event.id} onClick={()=>open(event)}><time>{event.time}</time><div><span>{event.category} / {event.format}</span><h3>{event.title}</h3></div><span className="gl-timetable-venue">{event.venue}</span><Arrow/></button>)}</div><p className="gl-fineprint">Sample schedule · Hyderabad local time (IST). Confirmed sessions will appear in the final programme.</p></section>
   <section id="visit" className="gl-section gl-visit" data-gl-reveal><div className="gl-visit-title"><p className="gl-eyebrow">04 / SEE YOU ON CAMPUS</p><h2>Bring your crew.<br/>Or find one here.</h2><p>Vardhaman College of Engineering<br/>Hyderabad, India</p><a className="gl-text-link" href="#questions">Before you arrive <span aria-hidden="true">↓</span></a></div><div className="gl-visit-note"><span className="gl-asterisk" aria-hidden="true">✳</span><p>There’s no single way<br/>to do FESTRONIX.</p><small>Build something. Learn something.<br/>Leave with a story.</small></div></section>
   <section id="questions" className="gl-section gl-questions" data-gl-reveal><div><p className="gl-eyebrow">A FEW THINGS TO KNOW</p><h2>Good questions.<br/><span>Clear answers.</span></h2></div><div>{faqs.slice(0,5).map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
   <section className="gl-last-call"><p className="gl-eyebrow">THERE’S SOMETHING HERE WITH YOUR NAME ON IT.</p><h2>See you<br/><em>in your element.</em></h2><a className="gl-button gl-button-dark" href="#discover">Explore the experiences <Arrow/></a></section>
  </main>
  <footer className="gl-footer"><a className="gl-footer-brand" href="#home">FESTRONIX<span>↗</span></a><div><span>VARDHAMAN · {edition.label}</span><button onClick={()=>open('login')}>Participant login <Arrow/></button><span>Student festival · Visual preview</span></div></footer>
  <details className="gl-theme-picker"><summary>Prototype controls <span>Campus</span></summary><div><p>Compare the four visual directions.</p><PrototypeThemes active="Campus" onSelect={theme=>{if(theme!=='Campus')location.assign('/?theme='+theme)}}/></div></details>
  <dialog ref={dialog} className={'gl-dialog '+(sheet==='menu'?'gl-menu-dialog':sheet==='login'?'gl-auth-dialog':'gl-event-dialog')} aria-labelledby="gl-dialog-title" onCancel={close} onClick={event=>{if(event.target===dialog.current)close();}}>
   <button className="gl-close" onClick={close} aria-label="Close dialog">Close <span aria-hidden="true">×</span></button>
   {sheet==='menu'?<><div className="gl-menu-top"><span>FESTRONI<span className="gl-orange">X</span> / FIELD GUIDE</span><small>FIND YOUR WAY IN.</small></div><div className="gl-menu-layout"><div><h2 id="gl-dialog-title" className="gl-sr">Explore FESTRONIX</h2><nav aria-label="Festival directory">{[['01','Find your thing','discover','Events & experiences'],['02','Find your people','clubs','The clubs behind it all'],['03','Make your plan','lineup','Schedule & sessions'],['04','Come on over','visit','Campus & essentials']].map(([num,title,id,note])=><a href={'#'+id} key={id} onClick={close}><small>{num}</small><div>{title}<span>{note}</span></div><Arrow/></a>)}</nav></div><aside className="gl-menu-aside"><span className="gl-menu-x" aria-hidden="true">×</span><p>A little curiosity<br/>goes a long way.</p><a href="#questions" onClick={close}>Questions? Start here <Arrow/></a><button className="gl-button gl-button-orange" onClick={()=>setSheet('login')}>Participant login <Arrow/></button></aside></div><div className="gl-menu-bottom"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>TECH / PLAY / CULTURE</span></div></>:sheet==='login'?<LoginPanel titleId="gl-dialog-title" eventTitle={loginEvent?.title} onClose={close}/>:sheet&&typeof sheet==='object'?<><p className="gl-eyebrow">{sheet.category} / SAMPLE EVENT</p><h2 id="gl-dialog-title">{sheet.title}</h2><p>{sheet.description}</p><dl>{[['When',`October ${sheet.day}, 2027 · ${sheet.time} IST`],['Where',sheet.venue],['Entry',sheet.fee],['Format',sheet.format]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>{sheet.rules}</p><div className="gl-login-notice">This is a sample event. No registration or payment is accepted in this preview.</div><div className="registration-actions"><button className="gl-button gl-register" onClick={()=>requestRegistration(sheet)}>Log in to register <Arrow/></button></div></>:null}
  </dialog>
 </div>;
}
