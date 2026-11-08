import {Component,Suspense,lazy,useCallback,useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {editionDates,href,type Edition,type ManagedEvent} from './platform/model';
import type {LandingSettings} from './platform/landingSettings';
import type {FluxPointer,FluxSceneMode} from './FluxCoreScene';
import {getFluxTracks} from './fluxProgramme';
import './flux-landing.css';

const LiveScene=lazy(()=>import('./FluxCoreScene').then(module=>({default:module.FluxCoreScene})));
type FluxMode=LandingSettings['fluxHero'];
const modeCodes:Record<FluxMode,string>={'Technical Tracks':'A','Liquid Flux':'B','Network / Portal':'C',Core:'D'};
const modeChoices:FluxMode[]=['Core','Technical Tracks','Liquid Flux','Network / Portal'];

class VisualBoundary extends Component<{children:ReactNode;onFail:()=>void},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(){this.props.onFail()}
 render(){return this.state.failed?null:this.props.children}
}
function useMatch(query:string){const [matches,setMatches]=useState(()=>matchMedia(query).matches);useEffect(()=>{const media=matchMedia(query),changed=()=>setMatches(media.matches);media.addEventListener('change',changed);changed();return()=>media.removeEventListener('change',changed)},[query]);return matches}
function previewMode(fallback:FluxMode):FluxMode{const code=new URLSearchParams(location.search).get('variant');return modeChoices.find(mode=>modeCodes[mode]===code)??fallback}
function Arrow(){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6"/></svg>}

function StillObject({mode,id}:{mode:FluxMode;id:string}){
 return <svg className="flux-still-object" viewBox="0 0 640 640" fill="none" aria-hidden="true">
  <defs><radialGradient id={id+'-hub'}><stop stopColor="#edfff2"/><stop offset=".28" stopColor="#b4decb"/><stop offset=".6" stopColor="#657f73"/><stop offset="1" stopColor="#1b302a"/></radialGradient><linearGradient id={id+'-metal'} x1="110" y1="90" x2="530" y2="550" gradientUnits="userSpaceOnUse"><stop stopColor="#414f46"/><stop offset=".25" stopColor="#d8ddc4"/><stop offset=".48" stopColor="#687f70"/><stop offset=".72" stopColor="#c1c5a8"/><stop offset="1" stopColor="#23352c"/></linearGradient></defs>
  {mode==='Network / Portal'?<g stroke={'url(#'+id+'-metal)'}>{[0,1,2,3,4].map(i=><rect key={i} x={112+i*28} y={92+i*36} width={416-i*56} height={456-i*72} rx="2" strokeWidth={i===0?7:3} transform={`rotate(${i*5} 320 320)`}/>)}<circle cx="320" cy="320" r="40" fill={'url(#'+id+'-hub)'}/></g>:mode==='Liquid Flux'?<g stroke={'url(#'+id+'-metal)'}>{Array.from({length:14},(_,i)=><path key={i} d={`M${240+i*3} 142C${560-i*5} 95 ${442+i*4} 306 ${487-i*3} 414C${525-i*4} 569 ${186+i*4} 564 ${183+i*2} 395C${178-i*2} 260 ${408-i*4} 290 ${349-i*2} 205C${316-i} 160 ${201+i*3} 238 ${240+i*3} 142Z`} strokeWidth="7"/>)}<ellipse cx="320" cy="330" rx="245" ry="92" transform="rotate(-30 320 330)" strokeWidth="1"/></g>:<g>
   <ellipse cx="320" cy="338" rx="252" ry="87" transform="rotate(-34 320 338)" stroke={'url(#'+id+'-metal)'} strokeWidth="12"/>
   <ellipse cx="320" cy="320" rx="226" ry="158" transform="rotate(47 320 320)" stroke={'url(#'+id+'-metal)'} strokeWidth="3"/>
   <ellipse cx="320" cy="324" rx="125" ry="185" transform="rotate(25 320 324)" stroke={'url(#'+id+'-metal)'} strokeWidth="17"/>
   <circle cx="320" cy="320" r="70" fill={'url(#'+id+'-hub)'} stroke="#9ec1ad" strokeWidth="2"/>
   <circle cx="320" cy="320" r="87" stroke="#9ba98c" strokeWidth="6"/>
   <circle cx="320" cy="320" r="46" stroke="#e1f7df" strokeWidth="2"/>
   {[0,1,2,3,4,5,6,7].map(i=><rect key={i} x="311" y="211" width="18" height="25" rx="1" fill={'url(#'+id+'-metal)'} transform={`rotate(${i*45} 320 320)`}/>)}
   <circle cx="124" cy="447" r="4" fill="#d7e7bf"/><circle cx="511" cy="220" r="4" fill="#d7e7bf"/>
   <ellipse cx="320" cy="550" rx="164" ry="13" stroke="#719d83" strokeOpacity=".32"/>
  </g>}
 </svg>;
}

export function FluxHero({config,events,settings,paused}:{config:Edition;events:ManagedEvent[];settings:LandingSettings;paused:boolean}){
 const root=useRef<HTMLElement>(null),pointer=useRef<FluxPointer>({x:0,y:0}),graphicId=useId().replace(/:/g,'');
 const small=useMatch('(max-width:767px)'),osReduced=useMatch('(prefers-reduced-motion:reduce)');
 const [mode,setMode]=useState<FluxMode>(()=>previewMode(settings.fluxHero));
 const [visible,setVisible]=useState(true),[hidden,setHidden]=useState(document.hidden),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const staticMode=paused||osReduced||!settings.motionEnabled||settings.fluxQuality==='Static';
 const low=small||settings.fluxQuality==='Reduced';
 const canEnhance=mode!=='Technical Tracks'&&!staticMode;
 const active=canEnhance&&visible&&!hidden;
 const onReady=useCallback(()=>setReady(true),[]),onFail=useCallback(()=>setFailed(true),[]);
 useEffect(()=>{const next=previewMode(settings.fluxHero);if(next!==mode){setReady(false);setFailed(false);setMode(next)}},[settings.fluxHero]);
 useEffect(()=>{
  const region=root.current;if(!region)return;
  const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);
  const observer='IntersectionObserver' in window?new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'120px'}):null;
  observer?.observe(region);return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',visibility)};
 },[]);
 useEffect(()=>{setFailed(false);if(!canEnhance)setReady(false);pointer.current={x:0,y:0}},[mode,settings.fluxQuality,staticMode]);
 useEffect(()=>{if(!canEnhance||ready||failed||!visible||hidden)return;const timer=setTimeout(()=>setFailed(true),6000);return()=>clearTimeout(timer)},[canEnhance,ready,failed,visible,hidden,mode]);
 const chooseMode=(next:FluxMode)=>{if(next!==mode){setReady(false);setFailed(false);setMode(next)}const url=new URL(location.href);url.searchParams.set('variant',modeCodes[next]);history.replaceState(null,'',url)};
 const tracks=getFluxTracks(events);
 const visualState=mode==='Technical Tracks'?'tracks':staticMode?'static':failed?'fallback':!visible||hidden?'paused':ready?'ready':'loading';
 return <section ref={root} className="flux-hero" data-flux-mode={mode} data-scene-state={visualState} data-webgl={visualState} data-scene-quality={staticMode?'static':low?'reduced':'full'} onPointerMove={event=>{if(!active||small||event.pointerType!=='mouse')return;const box=event.currentTarget.getBoundingClientRect();pointer.current={x:(event.clientX-box.left)/box.width*2-1,y:1-(event.clientY-box.top)/box.height*2}}} onPointerLeave={()=>{pointer.current={x:0,y:0}}} aria-labelledby="flux-title">
  {mode!=='Technical Tracks'&&<div className={'flux-stage '+(ready&&!failed&&canEnhance?'flux-stage-ready':'')} aria-hidden="true"><StillObject mode={mode} id={graphicId}/>{canEnhance&&!failed&&<div className="flux-live-object"><VisualBoundary key={mode+'-'+low+'-'+staticMode} onFail={onFail}><Suspense fallback={null}><LiveScene mode={mode as FluxSceneMode} low={low} active={active} pointer={pointer} onReady={onReady} onFail={onFail}/></Suspense></VisualBoundary></div>}</div>}
  <div className="flux-hero-content">
   <div className="flux-identity"><p className="flux-hero-tagline">{config.tagline}</p><h1 id="flux-title">FESTRONI<span>X</span></h1><span className="flux-edition">{config.label}</span></div>
   <h2>{config.heroTitle}</h2><p className="flux-hero-description">{config.heroBody}</p>
   <dl className="flux-hero-facts"><div><dt>When</dt><dd>{editionDates(config)}</dd></div><div><dt>Where</dt><dd>{config.location}</dd></div></dl>
   <div className="flux-hero-actions"><a className="fl-button" href={href('events','Flux')}>{settings.primaryCta}<Arrow/></a><a className="fl-inline-link" href={href('schedule','Flux')}>{settings.secondaryCta}<Arrow/></a></div>
  </div>
  {mode==='Technical Tracks'&&<aside className="flux-programme" aria-label="Explore the event programme">
   <div className="flux-programme-top"><span>PROGRAMME / {config.label}</span><span>{events.length.toString().padStart(2,'0')} {events.length===1?'EVENT':'EVENTS'}</span></div>
   <div className="flux-programme-identity"><span className="flux-programme-monogram" aria-hidden="true">F<span>×</span></span><h3>{settings.eventsTitle}</h3></div>
   {tracks.length?<nav className="flux-track-links" aria-label="Browse events by category">{tracks.map((track,index)=><a href={href('events','Flux',{category:track.name})} key={track.name}><span className="flux-track-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><span className="flux-track-name">{track.name}<small>{track.count} {track.count===1?'event':'events'}</small></span><span aria-hidden="true">↗</span></a>)}</nav>:<p className="flux-programme-empty">The programme is taking shape. Faculty-approved events will appear here when published.</p>}
   <a className="flux-programme-all" href={href('events','Flux')}>View all events <Arrow/></a>
  </aside>}
  <details className="flux-mode-control"><summary>Visual experiment <span>{modeCodes[mode]} / {mode}</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></summary><div className="flux-mode-options" role="group" aria-label="Flux hero experiment">{modeChoices.map(option=><button key={option} type="button" aria-pressed={mode===option} onClick={()=>chooseMode(option)}>{modeCodes[option]} / {option}</button>)}<p>Preview only. The published choice is managed in website settings.</p>{(failed||staticMode)&&mode!=='Technical Tracks'&&<p role="status">Static artwork. All festival information remains available.</p>}</div></details>
 </section>;
}
