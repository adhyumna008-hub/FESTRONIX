import {StrictMode,Suspense,lazy,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import GlassHome from './GlassHome';
import './interaction-polish.css';
import {FestivalProvider,useFestival} from './platform/store';
import {isVisualTheme,isEditionTheme} from './themes';
import {isStitchTheme} from './designCatalogue';
import {PrototypeThemes} from './PrototypeThemes';

const LegacyApp=lazy(()=>import('./LegacyApp'));
const FestivalLanding=lazy(()=>import('./FestivalLanding'));
const Portal=lazy(()=>import('./platform/Portal'));
function Router(){const {config}=useFestival();const query=new URLSearchParams(location.search);const requested=query.get('theme');const theme=(isVisualTheme(requested)?requested:config.theme);const view=query.get('view');useEffect(()=>{document.title=`FESTRONIX ${config.label} — Technology Festival`},[config.label]);return <><Suspense fallback={<p role="status" style={{padding:32,fontFamily:'sans-serif'}}>Opening FESTRONIX…</p>}>{view&&['events','schedule','help','admin','coordinator','participant'].includes(view)?<Portal view={view} theme={theme}/>:isStitchTheme(theme)||isEditionTheme(theme)?<Portal view="home" theme={theme}/>:theme==='Campus'?<GlassHome/>:theme==='Flux'?<FestivalLanding theme={theme}/>:<LegacyApp initialTheme={theme}/>}</Suspense><PrototypeThemes active={theme} onSelect={next=>{if(next===theme)return;const preview=new URL(location.href);preview.searchParams.set('theme',next);location.assign(preview.href)}}/></>}
createRoot(document.getElementById('root')!).render(<StrictMode><FestivalProvider><Router/></FestivalProvider></StrictMode>);
