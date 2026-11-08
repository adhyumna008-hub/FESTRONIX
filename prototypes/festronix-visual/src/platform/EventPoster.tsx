import {useEffect,useMemo,useState} from 'react';
import {safeEventArtwork} from './eventArtwork';
import type {ManagedEvent} from './model';
import '../event-artwork.css';
/** Event artwork is replaceable; every theme shares a neutral, seed-independent fallback. */
export function EventPoster({event}:{event:ManagedEvent;neutral?:boolean}){
 const artwork=useMemo(()=>safeEventArtwork(event.banner),[event.banner]);
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[artwork?.dataUrl]);
 if(artwork&&!failed)return <div className="event-art event-art-uploaded" aria-hidden="true" style={{background:'var(--fl-surface,var(--op-card,#101c20))',display:'grid',placeItems:'center'}}><img src={artwork.dataUrl} alt="" loading="lazy" decoding="async" onError={()=>setFailed(true)} style={{display:'block',width:'100%',height:'100%',maxHeight:'inherit',objectFit:'contain',objectPosition:'center'}}/></div>;
 return <div className="event-art event-art-neutral" aria-hidden="true"><svg viewBox="0 0 600 320" fill="none"><path d="M40 40h520v240H40zM40 160h520M300 40v240" stroke="currentColor" opacity=".15"/><path d="M237 225V95h91v25h-64v30h56v25h-56v50z" fill="currentColor"/><path d="m348 170 42 42m0-42-42 42" stroke="currentColor" strokeWidth="15"/></svg></div>;
}
