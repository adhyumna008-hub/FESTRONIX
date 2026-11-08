import {useEffect,useRef,useState} from 'react';
import {useFestival} from './platform/store';
import {href} from './platform/model';
import {workspaceFor} from './platform/demoAuth';
import './festival-landing.css';

export function FestivalHeader({theme,view='home',onLogin}:{theme:'Pulse'|'Flux';view?:string;onLogin:()=>void}){
 const {config,actor}=useFestival();
 const [open,setOpen]=useState(false);
 const navigation=useRef<HTMLElement>(null),menu=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(open)navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus()},[open]);
 return <header className="fl-header" onKeyDown={e=>{if(e.key==='Escape'&&open){setOpen(false);menu.current?.focus()}}}>
  <a className="fl-brand" href={href('home',theme)} aria-label="FESTRONIX home"><span className="fl-institutions"><img src="/wardhaman-college-of-engineering.png" alt="Vardhaman College of Engineering"/><img src="/sac-logo.png" alt="Students Activity Council"/></span><span>FESTRONI<b>X</b><small>VARDHAMAN · {config.label}</small></span></a>
  <nav ref={navigation} className={open?'fl-navigation is-open':'fl-navigation'} id="festival-navigation" aria-label="Main navigation">
   {([['home','Home'],['events','Events'],['schedule','Schedule'],['help','Visit & help']] as const).map(([key,label])=><a key={key} href={href(key,theme)} aria-current={view===key?'page':undefined} onClick={()=>setOpen(false)}>{label}</a>)}
  </nav>
  <div className="fl-header-actions">{actor?<a className="fl-account" href={href(workspaceFor(actor),theme)}>My workspace <span aria-hidden="true">↗</span></a>:<button className="fl-account" onClick={onLogin} aria-haspopup="dialog">Log in <span aria-hidden="true">↗</span></button>}<button ref={menu} id="festival-menu" className="fl-menu" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="festival-navigation" onClick={()=>setOpen(!open)}><span>{open?'Close':'Menu'}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d={open?'M4 4l12 12M16 4 4 16':'M2 6h16M2 14h16'} fill="none" stroke="currentColor" strokeWidth="1.4"/></svg></button></div>
 </header>;
}
