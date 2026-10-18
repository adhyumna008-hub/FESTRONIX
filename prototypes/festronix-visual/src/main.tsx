import {StrictMode,Suspense,lazy,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import GlassHome from './GlassHome';
import './interaction-polish.css';
import {FestivalProvider,useFestival} from './platform/store';
import type {VisualTheme} from './platform/model';

const LegacyApp=lazy(()=>import('./LegacyApp'));
const Portal=lazy(()=>import('./platform/Portal'));
function Router(){const {config}=useFestival();const query=new URLSearchParams(location.search);const requested=query.get('theme');const theme=(requested&&['Campus','Pulse','Panel','Flux'].includes(requested)?requested:config.theme) as VisualTheme;const view=query.get('view');useEffect(()=>{document.title=`FESTRONIX ${config.label} — Technology Festival`},[config.label]);return <Suspense fallback={<p role="status" style={{padding:32,fontFamily:'sans-serif'}}>Opening FESTRONIX…</p>}>{view&&['events','schedule','help','admin','coordinator','participant'].includes(view)?<Portal view={view} theme={theme}/>:theme==='Campus'?<GlassHome/>:<LegacyApp initialTheme={theme}/>}</Suspense>}
createRoot(document.getElementById('root')!).render(<StrictMode><FestivalProvider><Router/></FestivalProvider></StrictMode>);
