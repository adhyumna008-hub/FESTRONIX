import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {visualThemes,isVisualTheme,isEditionTheme,displayFonts} from '../src/themes';
import {readColorModePreference} from '../src/useColorMode';
import {seedState,href,type FestivalState,type VisualTheme} from '../src/platform/model';
import {execute} from '../src/platform/commands';

const staff=(state:FestivalState,id:string)=>state.staff.find(person=>person.id===id)!;

test('theme catalogue retains existing presentations and routes only supported additions to the new homes',()=>{
 assert.deepEqual(visualThemes,['Campus','Pulse','Panel','Flux','Comic','Studio','Blueprint']);
 assert.deepEqual(visualThemes.filter(isEditionTheme),['Comic','Studio','Blueprint']);
 for(const theme of visualThemes){assert.equal(isVisualTheme(theme),true);assert.ok(displayFonts[theme]?.includes(':wght@'),`${theme} needs a usable display-font request`)}
 for(const invalid of ['comic','Comic<script>','constructor','toString','',null,42,{}])assert.equal(isVisualTheme(invalid),false);
});

test('theme navigation preserves event registration context and future edition preview without carrying it into staff workspaces',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'location');
 Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?preview=edition-preset-2030&theme=Campus'}});
 try{
  for(const theme of visualThemes){
   const registration=new URL(href('events',theme,{event:'quantum',register:'1'}),'http://localhost');
   assert.equal(registration.searchParams.get('event'),'quantum');assert.equal(registration.searchParams.get('register'),'1');
   assert.equal(registration.searchParams.get('theme'),theme);assert.equal(registration.searchParams.get('preview'),'edition-preset-2030');
   for(const view of ['admin','coordinator','participant']){
    const destination=new URL(href(view,theme),'http://localhost');assert.equal(destination.searchParams.get('theme'),theme);assert.equal(destination.searchParams.has('preview'),false);
   }
  }
 }finally{if(previous)Object.defineProperty(globalThis,'location',previous);else Reflect.deleteProperty(globalThis,'location');}
});

test('saving every supported active-edition theme changes presentation only, retaining registrations, pass credentials and staff scope',()=>{
 const state=seedState(),before=structuredClone(state),edition=state.editions.find(e=>e.id===state.activeEditionId)!;
 // Seeded confirmed/pending entries already have individual QR credentials: theme changes must retain them exactly.
 for(const theme of visualThemes){
  execute(state,staff(state,'primary'),{type:'settings',edition:{...edition,theme}});
  assert.equal(edition.theme,theme);
  const normalized=structuredClone(state);normalized.editions.find(e=>e.id===edition.id)!.theme=before.editions.find(e=>e.id===edition.id)!.theme;
  assert.deepEqual(normalized,before,`${theme} changed business data while publishing its visual layer`);
 }
});

test('saving a future-edition theme leaves the active website, event programme and registration data untouched',()=>{
 const state=seedState(),before=structuredClone(state),future=state.editions.find(e=>e.year===2030)!;
 for(const theme of ['Comic','Studio','Blueprint'] as const){
  execute(state,staff(state,'primary'),{type:'settings',edition:{...future,theme}});
  assert.equal(future.theme,theme);assert.equal(future.phase,'Upcoming');assert.equal(future.registrationOpen,false);
  const normalized=structuredClone(state);normalized.editions.find(e=>e.id===future.id)!.theme=before.editions.find(e=>e.id===future.id)!.theme;
  assert.deepEqual(normalized,before,`${theme} leaked a preview change into the active edition`);
 }
});

test('presentation choices never give participants, helpers, coordinators or approvers publishing authority',()=>{
 for(const id of ['participant','helper-dev','dev','approver']){
  const state=seedState(),before=structuredClone(state);
  assert.throws(()=>execute(state,staff(state,id),{type:'settings',edition:{...state.editions[0],theme:'Comic'}}),/faculty owner/i);
  assert.deepEqual(state,before);
 }
});

test('unknown themes are rejected at the settings boundary without modifying the edition',()=>{
 const state=seedState(),before=structuredClone(state);
 assert.throws(()=>execute(state,staff(state,'primary'),{type:'settings',edition:{...state.editions[0],theme:'UnregisteredTheme' as VisualTheme}}),/theme/i);
 assert.deepEqual(state,before);
});

test('color preferences remain independent per theme, tolerate invalid or inaccessible storage, and retain deliberate defaults',()=>{
 const saved=new Map([['festronix-color-mode-comic','dark'],['festronix-color-mode-studio','light'],['festronix-color-mode-blueprint','light']]);
 const storage={getItem:(key:string)=>saved.get(key)??null};
 assert.equal(readColorModePreference('Comic',storage),'dark');assert.equal(readColorModePreference('Studio',storage),'light');assert.equal(readColorModePreference('Blueprint',storage),'light');
 saved.delete('festronix-color-mode-comic');assert.equal(readColorModePreference('Comic',storage),'light');
 saved.set('festronix-color-mode-blueprint','unexpected');assert.equal(readColorModePreference('Blueprint',storage),'dark');
 const blocked={getItem:()=>{throw new Error('Storage denied')}};
 assert.equal(readColorModePreference('Comic',blocked),'light');assert.equal(readColorModePreference('Blueprint',blocked),'dark');
});

test('new theme light/dark token pairs keep body, form, card, notice and primary-button text above 4.5:1',()=>{
 const css=readFileSync(new URL('../src/edition-themes.css',import.meta.url),'utf8');
 function tokens(selector:string){
  const start=css.indexOf(selector+'{');assert.notEqual(start,-1,`Missing ${selector}`);
  const body=css.slice(start,css.indexOf('}',start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*(#[\da-f]{3,6})\s*(?:;|$)/gi)].map(match=>[match[1],match[2]]));
 }
 function luminance(hex:string){const digits=hex.slice(1),rgb=digits.length===3?[...digits].map(c=>parseInt(c+c,16)):[0,2,4].map(i=>parseInt(digits.slice(i,i+2),16));return rgb.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)}
 function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
 for(const theme of ['comic','studio','blueprint'])for(const mode of ['light','dark']){
  const base=`.op-app.op-theme-${theme}`,palette=tokens(base);
  if((theme==='blueprint'&&mode==='light')||(theme!=='blueprint'&&mode==='dark'))Object.assign(palette,tokens(`${base}[data-color-mode=${mode}]`));
  for(const [text,background] of [['--op-ink','--op-bg'],['--op-ink','--op-card'],['--op-muted','--op-card'],['--op-muted','--op-soft'],['--op-on-accent','--op-accent']]){
   const ratio=contrast(palette[text],palette[background]);assert.ok(ratio>=4.5,`${theme}/${mode} ${text} on ${background}: ${ratio.toFixed(2)}:1`);
  }
 }
});
