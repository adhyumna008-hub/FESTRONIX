import {useEffect, useState} from 'react';
export type Theme = 'Pulse' | 'Panel' | 'Flux';
export type Quality = 'FULL' | 'REDUCED' | 'STATIC';
export type FluxVariant = 'A' | 'B' | 'C';
export type Viewport = 'desktop' | 'tablet' | 'phone';
export const variantNames = {A:'Club Symbols', B:'Liquid Flux', C:'Network / Portal'};
export const chapters = ['Arrival','FESTRONIX Reveal','Activation','Event Universe','Information Transition'];
export function chapterAt(p:number) { return p<.1?0:p<.28?1:p<.5?2:p<.78?3:4; }
export function smooth(a:number,b:number,p:number) {const t=Math.min(1,Math.max(0,(p-a)/(b-a)));return t*t*(3-2*t);}
export function useMedia(query:string) {const [value,setValue]=useState(()=>matchMedia(query).matches);useEffect(()=>{const media=matchMedia(query);const update=()=>setValue(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[query]);return value;}
export function useViewport():Viewport {const phone=useMedia('(max-width:639px)');const tablet=useMedia('(max-width:1023px)');return phone?'phone':tablet?'tablet':'desktop';}
export function useThemeFont(theme:Theme) {useEffect(()=>{const families={Pulse:'Space+Grotesk:wght@500;600;700',Panel:'Barlow+Condensed:wght@600;700;800',Flux:'Sora:wght@500;600;700'};const link=document.createElement('link');link.rel='stylesheet';link.href=`https://fonts.googleapis.com/css2?family=${families[theme]}&display=swap`;document.head.append(link);return()=>link.remove()},[theme]);}
export interface FrameRecord {progress:number;pointerX:number;pointerY:number;lastInput:number;signal:number;anchorX:number;anchorY:number;anchorVisible:boolean;active:boolean;pulseAt:number;}
export function frameRecord():FrameRecord {return {progress:0,pointerX:0,pointerY:0,lastInput:performance.now(),signal:-1,anchorX:0,anchorY:0,anchorVisible:false,active:true,pulseAt:-Infinity};}
