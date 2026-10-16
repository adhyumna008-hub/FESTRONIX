import {useEffect,useId,useRef,useState,type FormEvent} from 'react';
import './login-panel.css';

/** Sign-in entry shared by every visual theme. Never creates a mock session. */
export function LoginPanel({titleId,eventTitle,onClose}:{titleId:string;eventTitle?:string;onClose:()=>void}) {
 const [message,setMessage]=useState('');
 const emailId=useId();
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  heading.current?.focus({preventScroll:true});
  const dialog=heading.current?.closest('dialog');
  if(!dialog)return;
  const containFocus=(event:KeyboardEvent)=>{
   if(event.key!=='Tab'||event.defaultPrevented)return;
   const controls=Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href],[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
   const first=controls[0],last=controls.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  };
  dialog.addEventListener('keydown',containFocus);
  return()=>dialog.removeEventListener('keydown',containFocus);
 },[]);
 const email=(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  setMessage('Email sign-in is not configured yet. No link has been sent and no account has been created.');
 };
 return <div className="auth-panel">
  <p className="auth-eyebrow">FESTRONIX / YOUR SPACE</p>
  <h2 id={titleId} tabIndex={-1} ref={heading}>{eventTitle?'Log in to register.':'Good to see you.'}</h2>
  {eventTitle?<div className="auth-event"><span>YOU’RE JOINING</span><strong>{eventTitle}</strong><p>Sign in first. Your event stays selected while you choose how to continue.</p></div>:<p className="auth-intro">Your events. Your team. Your FESTRONIX.</p>}
  <p className="auth-notice">Sign-in preview · Account services are not connected yet.</p>
  <button type="button" className="auth-google" onClick={()=>setMessage('Google sign-in is not configured yet. No account or registration has been created.')}><span className="auth-google-mark" aria-hidden="true">G</span>Continue with Google<span aria-hidden="true">↗</span></button>
  <div className="auth-or"><span/>or continue with email<span/></div>
  <form onSubmit={email}>
   <label htmlFor={emailId}>Email address</label>
   <input id={emailId} type="email" name="email" autoComplete="email" placeholder="you@college.edu" required aria-describedby={message?emailId+'-message':undefined}/>
   <button className="auth-primary" type="submit">Continue with email<span aria-hidden="true">→</span></button>
  </form>
  <p className="auth-feedback" id={emailId+'-message'} role="status" aria-live="polite">{message}</p>
  <button className="auth-back" type="button" onClick={onClose}>Keep exploring<span aria-hidden="true">↗</span></button>
 </div>;
}
