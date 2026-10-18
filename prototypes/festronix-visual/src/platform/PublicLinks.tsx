import {href,type VisualTheme} from './model';
import {useFestival} from './store';
import {workspaceFor} from './demoAuth';
import './public-links.css';
export function WorkspaceLinks({theme}:{theme:VisualTheme}){const {actor}=useFestival();return <nav className="platform-links" aria-label="Festival workspaces"><span>FESTRONIX · test edition</span><div><a href={href('events',theme)}>Events ↗</a><a href={href('schedule',theme)}>Schedule ↗</a><a href={href(actor?workspaceFor(actor):'participant',theme)}>{actor?'My workspace':'Demo sign-in'} ↗</a></div></nav>}
export function PublicNotices({theme}:{theme:VisualTheme}){const {config}=useFestival();return <section className="platform-notices"><div><p className="platform-label">{config.phase==='Upcoming'?'PRIVATE NEXT-EDITION PREVIEW · REGISTRATION CLOSED':'FESTIVAL INFORMATION'}</p><h2>Technical challenges.<br/>A shared programme.</h2><p>{config.intro}</p></div><div>{config.announcements.map((s,i)=><p key={i}>{s}</p>)}<p>{config.contact}</p><a href={href('events',theme)}>View all events & register ↗</a></div></section>}
