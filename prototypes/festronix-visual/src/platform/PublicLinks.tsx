import {href,type VisualTheme} from './model';
import {useFestival} from './store';
import './public-links.css';
export function WorkspaceLinks({theme}:{theme:VisualTheme}){return <nav className="platform-links" aria-label="Workspace previews"><span>Interactive role previews · sample data</span><div><a href={href('participant',theme)}>Participant ↗</a><a href={href('coordinator',theme)}>Coordinator ↗</a><a href={href('admin',theme)}>Admin ↗</a></div></nav>}
export function PublicNotices({theme}:{theme:VisualTheme}){const {config}=useFestival();return <section className="platform-notices"><div><p className="platform-label">{config.phase==='Upcoming'?'PRIVATE NEXT-EDITION PREVIEW · REGISTRATION CLOSED':'FESTIVAL INFORMATION'}</p><h2>Technical challenges.<br/>A shared programme.</h2><p>{config.intro}</p></div><div>{config.announcements.map((s,i)=><p key={i}>{s}</p>)}<p>{config.contact}</p><a href={href('events',theme)}>View all events & register ↗</a></div></section>}
