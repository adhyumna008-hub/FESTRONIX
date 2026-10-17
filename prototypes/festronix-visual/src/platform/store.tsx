import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {execute,type Command} from './commands';
import {editionDates,seedState,type FestivalState} from './model';
const KEY='festronix-operational-preview-v2';
const Store=createContext<ReturnType<typeof useStore>|null>(null);
function useStore(){
 const [state,setState]=useState<FestivalState>(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.version===1&&Array.isArray(s.editions)&&s.editions.some((x:{id:string})=>x.id===s.activeEditionId)&&Array.isArray(s.staff)&&Array.isArray(s.events)&&Array.isArray(s.entries))return s;}}catch{}return seedState()});
 const current=useRef(state);current.current=state;
 const [storageWarning,setStorageWarning]=useState('');
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{setStorageWarning('Browser storage is unavailable. Preview changes will be lost on reload.')}},[state]);
 const run=(actorId:string,command:Command)=>{try{const next=structuredClone(current.current);const actor=next.staff.find(x=>x.id===actorId);if(!actor)throw new Error('Choose an active preview account.');const message=execute(next,actor,command);next.audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor:actor.name,action:command.type+' · '+message});next.audit=next.audit.slice(0,150);current.current=next;setState(next);return {ok:true,message};}catch(error){return {ok:false,message:error instanceof Error?error.message:'Could not apply this action.'}}};
 const reset=()=>{const s=seedState();current.current=s;setState(s)};
 const query=new URLSearchParams(location.search);const preview=query.get('preview');const publicView=!query.get('view')||query.get('view')==='events';const config=state.editions.find(x=>publicView&&preview?x.id===preview:x.id===state.activeEditionId)??state.editions.find(x=>x.id===state.activeEditionId)!;
 const publicEvents=state.events.filter(x=>x.editionId===config.id&&['Published','Live'].includes(x.state));
 const edition={label:config.label,year:config.year,dates:editionDates(config),college:'Vardhaman College of Engineering',location:config.location,tagline:config.tagline};
 const scheduleDays=[...new Set(publicEvents.map(e=>e.day))].sort((a,b)=>a-b);if(!scheduleDays.length)scheduleDays.push(Number(config.startDate.slice(8)));return {state,config,edition,events:publicEvents,faqs:config.faqs,scheduleDays,run,reset,storageWarning};
}
export function FestivalProvider({children}:{children:ReactNode}){const value=useStore();return <Store.Provider value={value}>{children}</Store.Provider>}
export function useFestival(){const value=useContext(Store);if(!value)throw new Error('FestivalProvider is required');return value}
