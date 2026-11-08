import test from 'node:test';
import assert from 'node:assert/strict';
import {execute} from '../src/platform/commands';
import {href,seedState} from '../src/platform/model';
import {artworkBytes,MAX_EVENT_ARTWORK_BYTES,safeEventArtwork,validateEventArtwork} from '../src/platform/eventArtwork';

const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF9sAAAAASUVORK5CYII=';
const banner={name:'A completely different event.png',dataUrl:'data:image/png;base64,'+png};

test('event artwork is optional, bounded raster data; old records and invalid stored art have safe fallbacks',()=>{
 assert.equal(validateEventArtwork(undefined),undefined);
 assert.deepEqual(validateEventArtwork(banner),banner);
 assert.equal(artworkBytes(banner),Buffer.from(png,'base64').length);
 assert.equal(safeEventArtwork({name:'bad',dataUrl:'https://example.com/image.png'}),undefined);
 for(const dataUrl of ['https://example.com/image.png','data:image/svg+xml;base64,PHN2Zy8+','data:text/html;base64,PGh0bWw+','data:image/jpeg;base64,'+png,'data:image/webp;base64,'+png,'data:image/png;base64,bm90IGFuIGltYWdl','data:image/png;base64,@@'])assert.throws(()=>validateEventArtwork({name:'banner',dataUrl}));
 assert.throws(()=>validateEventArtwork({...banner,script:'alert(1)'}));
 assert.throws(()=>validateEventArtwork({...banner,name:'bad\u0000name'}));
});

test('oversized or implausibly large artwork fails validation before a command changes state',()=>{
 const bytes=Buffer.from(png,'base64');bytes.writeUInt32BE(20000,16);
 assert.throws(()=>validateEventArtwork({...banner,dataUrl:'data:image/png;base64,'+bytes.toString('base64')}),/pixels|megapixels/);
 const oversized={...banner,dataUrl:'data:image/png;base64,'+Buffer.alloc(MAX_EVENT_ARTWORK_BYTES+1).toString('base64')};
 assert.throws(()=>validateEventArtwork(oversized),/300 KiB/);
 const state=seedState(),before=structuredClone(state),event=state.events.find(e=>e.id==='signal')!,actor=state.staff.find(s=>s.id==='dev')!;
 assert.throws(()=>execute(state,actor,{type:'event',event:{...event,banner:oversized}}),/300 KiB/);
 assert.deepEqual(state,before);
});

test('assigned staff can save and remove a banner only through the existing draft/reapproval path',()=>{
 const state=seedState(),event=state.events.find(e=>e.id==='signal')!,actor=state.staff.find(s=>s.id==='dev')!;
 event.time='10:00';
 execute(state,actor,{type:'event',event:{...event,banner}});
 assert.deepEqual(event.banner,banner);assert.equal(event.state,'Draft');assert.equal(event.ownerId,'dev');
 const {banner:omitted,...unrelatedEdit}=event;
 execute(state,actor,{type:'event',event:{...unrelatedEdit,title:'Another workshop title'}});
 assert.deepEqual(event.banner,banner);
 execute(state,actor,{type:'event',event:{...event,banner:undefined}});assert.equal(event.banner,undefined);
});

test('banner changes never bypass event scope, helper limits or registration/live locks',()=>{
 for(const staffId of ['engineering','helper-dev','participant']){
  const state=seedState(),before=structuredClone(state),event=state.events.find(e=>e.id==='signal')!,actor=state.staff.find(s=>s.id===staffId)!;
  assert.throws(()=>execute(state,actor,{type:'event',event:{...event,banner}}));assert.deepEqual(state,before);
 }
 for(const id of ['quantum','signal']){
  const state=seedState(),event=state.events.find(e=>e.id===id)!,actor=state.staff.find(s=>s.id==='dev')!;
  if(id==='signal')event.state='Live';const before=structuredClone(state);
  assert.throws(()=>execute(state,actor,{type:'event',event:{...event,banner}}),/Registrations exist|locked/);assert.deepEqual(state,before);
 }
});

test('Flux experiment navigation stays on public routes and never leaks into staff routes or another theme',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'location');
 try{
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?theme=Flux&variant=A&preview=edition-preset-2028'}});
  for(const view of ['home','events','schedule','help']){const url=new URL(href(view,'Flux'),'http://localhost');assert.equal(url.searchParams.get('variant'),'A');assert.equal(url.searchParams.get('preview'),'edition-preset-2028');}
  for(const view of ['admin','coordinator','participant'])assert.equal(new URL(href(view,'Flux'),'http://localhost').searchParams.has('variant'),false);
  assert.equal(new URL(href('events','Pulse'),'http://localhost').searchParams.has('variant'),false);
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?theme=Flux&variant=unknown'}});assert.equal(new URL(href('home','Flux'),'http://localhost').searchParams.has('variant'),false);
 }finally{if(previous)Object.defineProperty(globalThis,'location',previous);else Reflect.deleteProperty(globalThis,'location');}
});
