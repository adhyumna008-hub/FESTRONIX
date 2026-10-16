import type {Theme} from './experience';
export type PrototypeTheme=Theme|'Campus';
export function PrototypeThemes({active,onSelect}:{active:PrototypeTheme;onSelect:(theme:PrototypeTheme)=>void}) {
 return <div className="control-group prototype-theme-options" aria-label="Prototype theme" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8}}>
  {(['Pulse','Panel','Flux','Campus'] as const).map(theme=><button type="button" key={theme} aria-pressed={active===theme} onClick={()=>onSelect(theme)}>{theme}</button>)}
 </div>;
}
