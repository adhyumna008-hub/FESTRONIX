import {useEffect,useRef,useState} from 'react';
import {useFestival} from './store';
import type {ManagedEvent} from './model';
import {Panel,useAction} from './ui';
interface Detector {detect:(video:HTMLVideoElement)=>Promise<{rawValue:string}[]>}
type DetectorClass={new(options:{formats:string[]}):Detector;getSupportedFormats:()=>Promise<string[]>};
export function Scanner({event}:{event:ManagedEvent}){
 const {state}=useFestival(),act=useAction();const [token,setToken]=useState(''),[camera,setCamera]=useState(false),[starting,setStarting]=useState(false),[message,setMessage]=useState('');
 const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),frame=useRef(0),generation=useRef(0);
 const stop=()=>{generation.current++;cancelAnimationFrame(frame.current);stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setCamera(false);setStarting(false)};
 useEffect(()=>()=>{generation.current++;cancelAnimationFrame(frame.current);stream.current?.getTracks().forEach(t=>t.stop())},[]);
 useEffect(()=>{stop();setToken('');setMessage('')},[event.id,event.state]);
 useEffect(()=>{const hide=()=>{if(document.hidden)stop()};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[]);
 const start=async()=>{
  if(!navigator.mediaDevices?.getUserMedia){setMessage('Camera requires HTTPS and a supported browser. Paste a personal demo token below.');return}
  const id=++generation.current;setStarting(true);setMessage('Preparing scanner…');
  try{
   const Detector=(window as unknown as {BarcodeDetector?:DetectorClass}).BarcodeDetector;
   let detector:Detector|undefined;try{if(Detector&&(await Detector.getSupportedFormats()).includes('qr_code'))detector=new Detector({formats:['qr_code']})}catch{}
   const decode=detector?null:(await import('jsqr')).default;
   if(id!==generation.current)return;
   const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:720},height:{ideal:720}},audio:false});
   if(id!==generation.current){media.getTracks().forEach(t=>t.stop());return}
   stream.current=media;setCamera(true);setStarting(false);setMessage('Point at a personal event QR. The camera stops after one result.');
   const canvas=document.createElement('canvas');const context=canvas.getContext('2d',{willReadFrequently:true});let last=0;
   const loop=async(time:number)=>{
    if(id!==generation.current)return;
    const target=video.current;
    if(!target){frame.current=requestAnimationFrame(t=>void loop(t));return}
    try{
     if(target.srcObject!==media){target.srcObject=media;await target.play()}
     if(id!==generation.current)return;
     if(time-last>180&&target.readyState>=2){last=time;let value='';
      if(detector)value=(await detector.detect(target))[0]?.rawValue??'';
      else if(context&&decode&&target.videoWidth){const scale=Math.min(1,640/target.videoWidth);canvas.width=Math.round(target.videoWidth*scale);canvas.height=Math.round(target.videoHeight*scale);context.drawImage(target,0,0,canvas.width,canvas.height);value=decode(context.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,{inversionAttempts:'dontInvert'})?.data??''}
      if(id!==generation.current)return;
      if(value){setToken(value);const ok=act({type:'scan',eventId:event.id,token:value});stop();setMessage(ok?'Attendance saved. Start scanning for the next attendee.':'Pass not accepted. Read the reason above; attendance was not changed.');return}
     }
     frame.current=requestAnimationFrame(t=>void loop(t));
    }catch{stop();setMessage('Unable to read camera frames. Paste the personal token or use checked manual attendance.')}
   };
   frame.current=requestAnimationFrame(t=>void loop(t));
  }catch(error){if(id===generation.current){stop();setMessage(error instanceof Error?error.message:'Camera unavailable. Manual entry remains available.')}}
 };
 const candidates=state.entries.filter(r=>r.eventId===event.id&&r.status==='CONFIRMED').flatMap(r=>r.attendees);const sample=candidates.find(a=>!a.checkedAt)??candidates[0];
 return <Panel title="Event check-in" kicker="ONE PERSON / ONE EVENT PASS"><p>Selected event: <strong>{event.title}</strong></p><p className="op-notice">Start the event before scanning. Only confirmed personal passes for this event are accepted. This browser-local demo does not synchronize with another phone or browser.</p><div className="op-actions"><button onClick={()=>void start()} disabled={starting||camera||event.state!=='Live'}>{starting?'Opening camera…':'Start camera scanner'}</button>{(camera||starting)&&<button onClick={stop}>Stop camera</button>}</div>{camera&&<video className="op-camera" ref={video} muted playsInline aria-label="QR scanner camera preview"/>}<p className="op-muted" role="status">{message}</p><form className="op-form" onSubmit={e=>{e.preventDefault();const ok=act({type:'scan',eventId:event.id,token});setMessage(ok?'Personal attendance recorded.':'Pass rejected; check the reason above.')}}><label className="op-field"><span>Personal demo QR token</span><input value={token} onChange={e=>setToken(e.target.value)} placeholder="FESTRONIX-DEMO:…" required autoComplete="off"/></label><button className="op-primary" disabled={event.state!=='Live'}>Verify & check in</button></form><details><summary>Try sample scan outcomes</summary><div className="op-actions"><button onClick={()=>setToken(sample?.token??'FESTRONIX-DEMO:no-confirmed-entry')}>Load {sample?.checkedAt?'duplicate':'confirmed'} token</button><button onClick={()=>setToken(candidates.find(a=>a.checkedAt)?.token??'FESTRONIX-DEMO:no-checked-in-person')}>Load already checked-in token</button><button onClick={()=>setToken(state.entries.find(r=>r.eventId!==event.id)?.attendees[0]?.token??'invalid')}>Load wrong-event token</button><button onClick={()=>setToken('INVALID-DEMO-QR')}>Load invalid token</button></div><p className="op-muted">Load a token, then Verify & check in. A repeated scan records no additional attendance.</p></details></Panel>;
}
