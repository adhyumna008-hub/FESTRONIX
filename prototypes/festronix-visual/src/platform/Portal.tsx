import {useEffect,useState} from 'react';
import {displayFonts,isEditionTheme} from '../themes';
import {useColorMode} from '../useColorMode';
import {isStitchTheme} from '../designCatalogue';
import StitchHome from '../StitchHome';
import {StitchHeader} from '../StitchHeader';
import EditionHome from '../EditionHome';
import ComicPowers from '../ComicPowers';
import '../edition-themes.css';

import {useFestival} from './store';
import {href,type VisualTheme} from './model';
import {canOpenView,workspaceFor} from './demoAuth';
import {LoginPanel} from '../LoginPanel';
import {CampusHeader} from '../CampusHeader';
import {FestivalHeader} from '../FestivalHeader';
import {getLandingSettings} from './landingSettings';
import {Actions,Confirm,Modal,FeedbackContext} from './ui';
import {Admin} from './Admin';
import {Coordinator} from './Coordinator';
import {Participant} from './Participant';
import {Events} from './Events';
import {FestivalInfo} from './FestivalInfo';
import './portal.css';
import './events-directory.css';
import './public-composition.css';
import '../stitch-designs.css';
export default function Portal({view,theme}:{view:string;theme:VisualTheme}){
 const {state,config,actor,signOut,storageWarning,run,reset}=useFestival();
 const [feedback,setFeedback]=useState<{ok:boolean;message:string}|null>(null),[resetting,setResetting]=useState(false),[login,setLogin]=useState(false);
 const publicView=['home','events','schedule','help'].includes(view);
 const {mode,toggle}=useColorMode(theme);
 useEffect(()=>{const fonts=displayFonts;const link=document.createElement('link');link.rel='stylesheet';link.href=`https://fonts.googleapis.com/css2?family=${fonts[theme]}&display=swap`;document.head.append(link);document.title=`FESTRONIX ${config.label} · ${view}`;return()=>link.remove()},[theme,config.label,view]);
 return <FeedbackContext.Provider value={feedback}><div data-color-mode={mode} data-landing-accent={getLandingSettings(config).pulseAccent} className={'op-app op-theme-'+theme.toLowerCase()+' op-view-'+view+(publicView?' op-public':'')+(isStitchTheme(theme)?' st-design':'')}><a className="op-skip" href="#workspace">Skip to content</a>{isStitchTheme(theme)?<StitchHeader theme={theme} view={view} onLogin={()=>setLogin(true)}/>:theme==='Campus'?<CampusHeader view={view} onLogin={()=>setLogin(true)}/>:theme==='Flux'?<FestivalHeader theme={theme} view={view} onLogin={()=>setLogin(true)}/>:<header className="op-header"><a className="op-brand" href={href('home',theme)}>FESTRONI<span>X</span><small>{config.label} / TECHNOLOGY FESTIVAL</small></a><nav aria-label="Main navigation">{[['home','Home'],['events','Events'],['schedule','Schedule'],['help','Visit & FAQ']].map(([key,label])=><a key={key} aria-current={view===key?'page':undefined} href={href(key,theme)}>{label}</a>)}{actor&&<a href={href(workspaceFor(actor),theme)}>My workspace</a>}</nav><button className="op-login" onClick={()=>setLogin(true)}>{actor?'Account':'Log in'} ↗</button>{isEditionTheme(theme)&&<button className="op-color-mode" aria-label={`Switch to ${mode==='light'?'dark':'light'} mode`} onClick={toggle}>{mode==='light'?'Dark':'Light'} mode</button>}</header>}
 <div className="op-preview-banner"><strong>TEST EDITION</strong><span>Fictional data · browser-local sign-in, passes and reports · no real payment or admission</span></div><div className="op-shell">{!publicView&&<aside className="op-sidebar"><p className="op-kicker">FESTRONIX WORKSPACE</p><nav aria-label="Workspace navigation">{[['events','Events directory'],['participant','My registrations'],['coordinator','Event management'],['admin','Admin & faculty']].filter(([key])=>key==='events'||actor&&canOpenView(actor,key)).map(([key,label])=><a key={key} href={href(key,theme)} aria-current={view===key?'page':undefined}>{label}<b aria-hidden="true">↗</b></a>)}</nav><div className="op-sidebar-note"><span className="op-cross" aria-hidden="true">×</span><p>Build. Break.<br/>Discover.</p><small>Event-scoped workspaces.<br/>One shared festival programme.</small></div></aside>}<main id="workspace" className="op-main">
 {actor&&!publicView&&<div className="op-actor"><div><strong>{actor.name}</strong><p className="op-muted">{actor.role} · temporary demo session</p></div><div className="op-actions"><button onClick={()=>{signOut();setFeedback(null)}}>Sign out</button>{actor.role==='Owner'&&<button onClick={()=>setResetting(true)}>Reset sample data</button>}</div></div>}
 {storageWarning&&<p className="op-notice">{storageWarning}</p>}{feedback&&<div className={'op-feedback '+(feedback.ok?'op-success':'op-error')} role={feedback.ok?'status':'alert'}><span>{feedback.ok?'Done':'Action not applied'}</span><p>{feedback.message}</p><button aria-label="Dismiss feedback" onClick={()=>setFeedback(null)}>×</button></div>}
 <Actions.Provider value={command=>{if(!actor){setLogin(true);return false}const result=run(actor.id,command);setFeedback(result);return result.ok}}>
 {view==='home'&&isStitchTheme(theme)?<StitchHome theme={theme}/>:view==='home'&&isEditionTheme(theme)?<EditionHome theme={theme}/>:view==='events'?<Events actor={actor} directory/>:view==='schedule'||view==='help'?<FestivalInfo view={view} theme={theme}/>:!actor?<section className="op-signin">{login?<p className="op-notice">Use the sign-in dialog to open your workspace.</p>:<LoginPanel titleId="workspace-login" onClose={()=>location.assign(href('events',theme))}/>}</section>:!canOpenView(actor,view)?<div className="op-empty"><h1>Your account has a different workspace.</h1><p>Sign in with an assigned staff account to manage events. Participant accounts cannot open administration or scanning tools.</p><a className="op-link" href={href(workspaceFor(actor),theme)}>Open my workspace ↗</a></div>:view==='admin'?<Admin key={actor.id} actor={actor} theme={theme}/>:view==='coordinator'?<Coordinator key={actor.id} actor={actor}/>:<Participant key={actor.id} actor={actor}/>}
 </Actions.Provider>
 <footer className="op-footer"><p>FESTRONIX {config.label} · {config.location}</p><div><a href={href('events',theme)}>Events</a> · <a href={href('schedule',theme)}>Schedule</a> · <a href={href('help',theme)}>Help & FAQs</a></div></footer></main></div>
 {login&&<Modal title="FESTRONIX account" onClose={()=>setLogin(false)}><LoginPanel titleId="portal-login" onClose={()=>setLogin(false)}/></Modal>}{resetting&&<Confirm title="Reset local sample data?" label="Reset preview" onClose={()=>setResetting(false)} action={()=>{reset();setFeedback({ok:true,message:'The original fictional dataset has been restored in this browser.'})}}><p>This restores only this browser’s demonstration. Your server and other visitors are unaffected.</p></Confirm>}
 {theme==='Comic'&&publicView&&!isStitchTheme(theme)&&<ComicPowers/>}</div></FeedbackContext.Provider>;
}
