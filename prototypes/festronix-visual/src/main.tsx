import {StrictMode,Suspense,lazy} from 'react';
import {createRoot} from 'react-dom/client';
import GlassHome from './GlassHome';
import './interaction-polish.css';

const LegacyApp=lazy(()=>import('./LegacyApp'));
const requestedTheme=new URLSearchParams(location.search).get('theme');
const legacy=requestedTheme!==null&&requestedTheme!=='Campus';
createRoot(document.getElementById('root')!).render(<StrictMode>{legacy?<Suspense fallback={<p role="status" style={{padding:32,fontFamily:'sans-serif'}}>Opening FESTRONIX…</p>}><LegacyApp/></Suspense>:<GlassHome/>}</StrictMode>);
