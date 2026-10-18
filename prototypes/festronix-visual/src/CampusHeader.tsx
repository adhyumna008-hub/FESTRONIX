import {useEffect,useId,useRef,useState} from 'react';
import {useFestival} from './platform/store';
import {href,type VisualTheme} from './platform/model';
import {workspaceFor} from './platform/demoAuth';
import './campus-header.css';

/** One Campus navigation shell for the landing page and every public/staff route. */
export function CampusHeader({view='home',onLogin,onMenuChange}:{view?:string;onLogin:()=>void;onMenuChange?:(open:boolean)=>void}){
 const {config,actor}=useFestival();
 const [open,setOpen]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),toggle=useRef<HTMLButtonElement>(null);
 const title=useId();
 useEffect(()=>{
  if(!open)return;
  const node=dialog.current!;const previous=document.body.style.overflow;
  node.showModal();document.body.style.overflow='hidden';
  return()=>{node.close();document.body.style.overflow=previous;toggle.current?.focus({preventScroll:true})};
 },[open]);
 const change=(value:boolean)=>{setOpen(value);onMenuChange?.(value)};
 const links=[['home','Home'],['events','Events'],['schedule','Schedule'],['help','Visit & FAQ']];
 return <>
  <header className="campus-nav">
   <a className="campus-nav-brand" href={href('home','Campus')} aria-label="FESTRONIX home"><span className="campus-nav-institutions"><img src="/wardhaman-college-of-engineering.png" alt="Vardhaman College of Engineering"/><img src="/sac-logo.png" alt="Students Activity Council"/></span><span>FESTRONI<span className="campus-nav-x">X</span><small>VARDHAMAN · {config.label}</small></span></a>
   <nav className="campus-nav-actions" aria-label="Main navigation">
    <a className="campus-nav-tab" href={href('events','Campus')} aria-current={view==='events'?'page':undefined}>Events</a>
    <a className="campus-nav-tab campus-nav-schedule" href={href('schedule','Campus')} aria-current={view==='schedule'?'page':undefined}>Schedule</a>
    <button className="campus-nav-login" onClick={onLogin} aria-haspopup="dialog">{actor?'Account':'Log in'} <span aria-hidden="true">↗</span></button>
    <button ref={toggle} className="campus-nav-explore" onClick={()=>change(true)} aria-haspopup="dialog" aria-expanded={open}>Explore <span aria-hidden="true"><i/><i/></span></button>
   </nav>
  </header>
  <dialog ref={dialog} className="campus-nav-menu" aria-labelledby={title} onCancel={()=>change(false)} onClick={e=>{if(e.target===dialog.current)change(false)}}>
   <div className="campus-nav-menu-top"><h2 id={title}>Explore FESTRONIX</h2><button onClick={()=>change(false)} aria-label="Close navigation">Close ×</button></div>
   <nav aria-label="Festival directory">{links.map(([key,label],index)=><a key={key} href={href(key,'Campus')} aria-current={view===key?'page':undefined}><small>0{index+1}</small><span>{label}</span><span aria-hidden="true">↗</span></a>)}{actor&&<a href={href(workspaceFor(actor),'Campus')}><small>05</small><span>My workspace</span><span aria-hidden="true">↗</span></a>}</nav>
   <div className="campus-nav-menu-bottom"><label>UI theme<select aria-label="UI theme" value="Campus" onChange={e=>location.assign(href(view,e.target.value as VisualTheme))}>{['Campus','Pulse','Panel','Flux'].map(theme=><option key={theme}>{theme}</option>)}</select></label><button onClick={()=>{change(false);onLogin()}}>{actor?'My account':'Log in'} ↗</button></div>
  </dialog>
 </>;
}
