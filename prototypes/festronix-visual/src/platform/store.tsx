import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {execute,type Command} from './commands';
import {upgradeState} from './attendance';
import {authenticateDemo,sessionActor,SESSION_KEY,type DemoSession} from './demoAuth';
import {editionDates,seedState,type FestivalState} from './model';
const KEY='festronix-operational-preview-v2';
const Store=createContext<ReturnType<typeof useStore>|null>(null);
function useStore(){
 const [state,setState]=useState<FestivalState>(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.version===1&&Array.isArray(s.editions)&&s.editions.some((x:{id:string})=>x.id===s.activeEditionId)&&Array.isArray(s.staff)&&Array.isArray(s.events)&&Array.isArray(s.entries))return upgradeState(s);}}catch{}return seedState()});
 const [session,setSession]=useState<DemoSession|null>(()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch{return null}});
 const [,tick]=useState(0);useEffect(()=>{const t=setInterval(()=>tick(n=>n+1),30000);return()=>clearInterval(t)},[]);
 const currentSession=useRef(session);currentSession.current=session;const actor=sessionActor(state,session);
 useEffect(()=>{if(session&&!sessionActor(state,session)){sessionStorage.removeItem(SESSION_KEY);currentSession.current=null;setSession(null)}},[state,session]);
 const signIn=(username:string,password:string)=>{const next=authenticateDemo(current.current,username,password);sessionStorage.setItem(SESSION_KEY,JSON.stringify(next));currentSession.current=next;setSession(next);return sessionActor(current.current,next)!};
 const signOut=()=>{sessionStorage.removeItem(SESSION_KEY);currentSession.current=null;setSession(null)};
 const current=useRef(state);current.current=state;
 useEffect(()=>{const receive=(event:StorageEvent)=>{if(event.key!==KEY||!event.newValue)return;try{const incoming=JSON.parse(event.newValue);if(incoming.version===1&&Array.isArray(incoming.entries)&&Array.isArray(incoming.staff)&&JSON.stringify(current.current)!==event.newValue){const next=upgradeState(incoming);current.current=next;setState(next)}}catch{}};window.addEventListener('storage',receive);return()=>window.removeEventListener('storage',receive)},[]);
 const [storageWarning,setStorageWarning]=useState('');
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{setStorageWarning('Browser storage is unavailable. Preview changes will be lost on reload.')}},[state]);
 const run=(actorId:string,command:Command)=>{try{const next=structuredClone(current.current);const actor=sessionActor(next,currentSession.current);if(!actor||actor.id!==actorId)throw new Error('Sign in with an active demo account to continue.');const message=execute(next,actor,command);next.audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor:actor.name,action:command.type+' · '+message});next.audit=next.audit.slice(0,150);current.current=next;setState(next);return {ok:true,message};}catch(error){return {ok:false,message:error instanceof Error?error.message:'Could not apply this action.'}}};
 const reset=()=>{const s=seedState();current.current=s;setState(s)};
 const query=new URLSearchParams(location.search);const preview=query.get('preview');const publicView=!query.get('view')||['events','schedule','help'].includes(query.get('view')??'');const config=state.editions.find(x=>publicView&&preview?x.id===preview:x.id===state.activeEditionId)??state.editions.find(x=>x.id===state.activeEditionId)!;
 const publicEvents=state.events.filter(x=>x.editionId===config.id&&['Published','Live'].includes(x.state));
 const edition={label:config.label,year:config.year,dates:editionDates(config),college:'Vardhaman College of Engineering',location:config.location,tagline:config.tagline};
 const scheduleDays=[...new Set(publicEvents.map(e=>e.day))].sort((a,b)=>a-b);if(!scheduleDays.length)scheduleDays.push(Number(config.startDate.slice(8)));return {state,actor,signIn,signOut,config,edition,events:publicEvents,faqs:config.faqs,scheduleDays,run,reset,storageWarning};
}
export function FestivalProvider({children}:{children:ReactNode}){const value=useStore();return <Store.Provider value={value}>{children}</Store.Provider>}
export function useFestival(){const value=useContext(Store);if(!value)throw new Error('FestivalProvider is required');return value}
