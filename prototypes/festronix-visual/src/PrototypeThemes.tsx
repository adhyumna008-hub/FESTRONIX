import {designChoices,designs} from './designCatalogue';
import {visualThemes,type VisualTheme} from './themes';
import './prototype-themes.css';
export type PrototypeTheme=VisualTheme;
/** A URL-only preview; this never changes the edition's published theme. */
export function PrototypeThemes({active,onSelect}:{active:PrototypeTheme;onSelect:(theme:PrototypeTheme)=>void}) {
 return <details className="prototype-test-switcher" onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus()}}}>
  <summary><span>Theme preview <small>Testing only</small></span><strong>{designs[active].short}</strong></summary>
  <div className="prototype-test-content"><label htmlFor="prototype-test-theme">Preview theme</label><select id="prototype-test-theme" value={active} onChange={event=>onSelect(event.target.value as PrototypeTheme)}>{(active==='Flux'?visualThemes:designChoices).map(theme=><option key={theme} value={theme}>{designs[theme].name}</option>)}</select><p>Changes this preview only. Published edition settings stay the same.</p></div>
 </details>;
}
