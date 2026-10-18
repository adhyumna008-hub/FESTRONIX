import {useEffect,useRef,useState} from 'react';
import './login-panel.css';
import {href,type VisualTheme} from './platform/model';
import {useFestival} from './platform/store';
import {DEMO_ACCOUNTS,workspaceFor,canOpenView} from './platform/demoAuth';

export function LoginPanel({titleId,eventTitle,onClose}:{titleId:string;eventTitle?:string;onClose:()=>void}){
 const {state,actor,signIn,signOut,config}=useFestival();
 const [message,setMessage]=useState('');const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[]);
 const theme=(new URLSearchParams(location.search).get('theme')??config.theme) as VisualTheme;
 const go=(person:NonNullable<typeof actor>)=>{
  const event=state.events.find(e=>e.title===eventTitle&&e.editionId===config.id);
  const current=new URLSearchParams(location.search).get('view');
  location.assign(event&&person.role==='Participant'?href('events',theme,{event:event.id,register:'1'}):href(current&&canOpenView(person,current)?current:workspaceFor(person),theme));
 };
 return <div className="auth-panel">
  <p className="auth-eyebrow">FESTRONIX / TEST ACCESS</p>
  <h2 id={titleId} ref={heading} tabIndex={-1}>{actor?'Your FESTRONIX workspace.':'Try the complete journey.'}</h2>
  {eventTitle&&<div className="auth-event"><span>SELECTED EVENT</span><strong>{eventTitle}</strong></div>}
  <p className="auth-notice">Temporary demo sign-in · fictional data saved in this browser only. These public test accounts cannot access the real platform. Use the same browser to test registration, staff check-in and reports.</p>
  {actor?<><p className="auth-intro">Signed in as <strong>{actor.name}</strong> · {actor.role}</p><button className="auth-primary" onClick={()=>go(actor)}>{eventTitle&&actor.role==='Participant'?'Continue registration':'Open workspace'} ↗</button><button className="auth-back" onClick={()=>{signOut();setMessage('Signed out. Choose another test account.')}}>Switch account / sign out</button></>:<form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);try{const person=signIn(String(data.get('username')),String(data.get('password')));go(person)}catch(err){setMessage(err instanceof Error?err.message:'Unable to sign in.')}}}>
   <label htmlFor={titleId+'-user'}>Demo username</label><input id={titleId+'-user'} name="username" required autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="admin or user1–user6"/>
   <label htmlFor={titleId+'-password'}>Demo password</label><input id={titleId+'-password'} name="password" type="password" required autoComplete="off"/>
   <button className="auth-primary" type="submit">Sign in to demo <span aria-hidden="true">→</span></button>
  </form>}
  <p className="auth-feedback" role="status">{message}</p>
  <details className="auth-accounts"><summary>Test accounts & what to try</summary><div className="auth-account-list">{DEMO_ACCOUNTS.map(a=><div key={a.username}><strong>{a.username} / {a.password}</strong><span>{a.purpose}</span></div>)}</div><p>Register as user1, approve a paid entry and start the event as user3, scan as user5, then export as user3 or admin. Log out before changing accounts. All six user passwords match their usernames.</p></details>
  <button className="auth-back" onClick={onClose}>Keep exploring ↗</button>
 </div>;
}
