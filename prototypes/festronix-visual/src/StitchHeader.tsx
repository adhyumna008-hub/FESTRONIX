import {useState} from 'react';
import {useFestival} from './platform/store';
import {href} from './platform/model';
import {canOpenView} from './platform/demoAuth';
import {Modal} from './platform/ui';
import {designs,type StitchTheme} from './designCatalogue';

export function StitchHeader({theme,view,onLogin}:{theme:StitchTheme;view:string;onLogin:()=>void}){
 const {config,actor}=useFestival(),[menu,setMenu]=useState(false);
 const links=[['home','Overview'],['events','Events'],['schedule','Schedule'],['help','Visit & help']];
 const featureLinks=[
  {view:'participant',label:'My registrations & passes',url:href('participant',theme)},
  {view:'coordinator',label:'Event management',url:href('coordinator',theme)},
  {view:'admin',label:'Admin & faculty',url:href('admin',theme)},
 ].filter(item=>actor&&canOpenView(actor,item.view));
 if(actor?.role==='Owner')featureLinks.push({view:'admin',label:'Design gallery',url:href('admin',theme,{section:'design'})});
 return <><header className="st-nav"><a className="st-brand" href={href('home',theme)} aria-label="FESTRONIX home"><span className="st-logos"><img src="/wardhaman-college-of-engineering.png" alt="Vardhaman College of Engineering" width="46" height="46"/><img src="/sac-logo.png" alt="Students Activity Council" width="40" height="40"/></span><span>FESTRONI<b>X</b><small>VARDHAMAN / {config.label}</small></span></a><nav aria-label="Main navigation">{links.map(([key,label])=><a key={key} href={href(key,theme)} aria-current={key===view?'page':undefined}>{label}</a>)}</nav><div className="st-nav-actions"><button onClick={onLogin}>{actor?'Account':'Log in'} <span aria-hidden="true">↗</span></button><button aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>setMenu(true)}>Menu <span aria-hidden="true">☰</span></button></div></header>{menu&&<Modal title="Explore FESTRONIX" onClose={()=>setMenu(false)}><nav className="st-menu" aria-label="Expanded navigation">{links.map(([key,label],index)=><a key={key} href={href(key,theme)} aria-current={key===view?'page':undefined}><small>0{index+1}</small><span>{label}</span><b aria-hidden="true">↗</b></a>)}{!actor&&<a href={href('participant',theme)}><small>05</small><span>My registrations & passes</span><b aria-hidden="true">↗</b></a>}{featureLinks.length>0&&<><span className="st-menu-label">YOUR WORKSPACE</span>{featureLinks.map((item,index)=><a key={item.label} href={item.url}><small>{String(index+5).padStart(2,'0')}</small><span>{item.label}</span><b aria-hidden="true">↗</b></a>)}</>}</nav><p className="st-menu-note">{designs[theme].name} · FESTRONIX {config.label}</p></Modal>}</>;
}
