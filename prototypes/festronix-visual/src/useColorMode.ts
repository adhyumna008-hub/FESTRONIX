import {useEffect,useState} from 'react';
import type {VisualTheme} from './themes';
export type ColorMode='light'|'dark';
export function readColorModePreference(theme:VisualTheme,storage?:Pick<Storage,'getItem'>):ColorMode{
 try{const saved=(storage??localStorage).getItem(`festronix-color-mode-${theme.toLowerCase()}`);if(saved==='light'||saved==='dark')return saved}catch{/* Theme defaults remain usable when browser storage is blocked. */}
 return theme==='Blueprint'?'dark':'light';
}
export function useColorMode(theme:VisualTheme){
 const key=`festronix-color-mode-${theme.toLowerCase()}`;
 const read=()=>readColorModePreference(theme);
 const [mode,setMode]=useState<ColorMode>(read);
 useEffect(()=>{setMode(read());const sync=(e:StorageEvent)=>{if(e.key===key||e.key===null)setMode(read())};addEventListener('storage',sync);return()=>removeEventListener('storage',sync)},[key]);
 const toggle=()=>setMode(current=>{const next=current==='light'?'dark':'light';try{localStorage.setItem(key,next)}catch{/* The current view can still switch. */}return next});
 return {mode,toggle};
}
