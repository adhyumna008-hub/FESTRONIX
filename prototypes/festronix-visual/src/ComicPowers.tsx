import {useEffect,useRef,useState} from 'react';
import './comic-powers.css';

type Burst={x:number;y:number;at:number;kind:number;turn:number};
const TAU=Math.PI*2,DURATION=850;
const effectNames=['web','lightning','repulsor','manga-slash','chakra-spiral','flame-sweep','void-orbit','water-ripple'];
const line=(ctx:CanvasRenderingContext2D,points:number[][])=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));};

/** Short original comic power marks: no images, sound, network requests or idle animation. */
function paint(ctx:CanvasRenderingContext2D,b:Burst,elapsed:number,compact:boolean){
 const progress=Math.min(1,elapsed/DURATION),arrival=1-Math.pow(1-Math.min(1,progress*3),3);
 const size=(compact?79:112)*(.5+arrival*.5),fade=Math.pow(1-progress,1.1);
 ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.turn);ctx.globalAlpha=fade;
 ctx.lineJoin='round';ctx.lineCap='round';
 if(b.kind===0){
  // Curved web mesh with ten clean spokes and a dark registration underprint.
  const draw=()=>{for(let i=0;i<10;i++){const a=i*TAU/10;line(ctx,[[Math.cos(a)*8,Math.sin(a)*8],[Math.cos(a)*size,Math.sin(a)*size]]);ctx.stroke();}
   for(let band=1;band<=3;band++){const r=size*band/3;ctx.beginPath();for(let i=0;i<10;i++){const a=i*TAU/10,next=(i+1)*TAU/10,mid=(a+next)/2;ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.quadraticCurveTo(Math.cos(mid)*r*.66,Math.sin(mid)*r*.66,Math.cos(next)*r,Math.sin(next)*r);}ctx.stroke();}};
  ctx.strokeStyle='#142637';ctx.lineWidth=4.5;draw();ctx.strokeStyle='#e5f4ff';ctx.lineWidth=1.65;draw();
  ctx.fillStyle='#e5f4ff';for(let i=0;i<10;i++){const a=i*TAU/10;ctx.beginPath();ctx.arc(Math.cos(a)*size,Math.sin(a)*size,2.3,0,TAU);ctx.fill();}
 }else if(b.kind===1){
  // Four branched amber strokes: one outward movement, no flashing.
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4);const r=size*(i%2?.78:1);
   const points=[[3,4],[r*.27,-r*.13],[r*.21,r*.1],[r*.57,-r*.21],[r*.49,-r*.01],[r,-r*.3]];
   line(ctx,points);ctx.strokeStyle='#402919';ctx.lineWidth=9;ctx.stroke();ctx.strokeStyle='#ffba32';ctx.lineWidth=5.6;ctx.shadowColor='#ffb52d';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#fff8c7';ctx.lineWidth=1.8;ctx.stroke();
   line(ctx,[[r*.57,-r*.21],[r*.64,-r*.43],[r*.79,-r*.4]]);ctx.strokeStyle='#ffce62';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
 }else if(b.kind===2){
  // Technical repulsor rings with separated arcs, a small iris and radial ticks.
  ctx.shadowColor='#63edff';ctx.shadowBlur=7;
  for(let band=0;band<3;band++){const r=size*(.26+band*.25);ctx.strokeStyle=band===1?'#f5feff':'#49daf5';ctx.lineWidth=band===1?3.5:2;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,0,r,i*TAU/6+.1+progress*.35,i*TAU/6+.83+progress*.35);ctx.stroke();}}
  ctx.shadowBlur=0;for(let i=0;i<18;i++){const a=i*TAU/18;line(ctx,[[Math.cos(a)*size*.84,Math.sin(a)*size*.84],[Math.cos(a)*size,Math.sin(a)*size]]);ctx.strokeStyle='#7aeafb';ctx.lineWidth=i%3===0?2.8:1.1;ctx.stroke();}
  ctx.beginPath();for(let i=0;i<=6;i++){const a=i*TAU/6;const x=Math.cos(a)*size*.11,y=Math.sin(a)*size*.11;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#e6ffff';ctx.lineWidth=2;ctx.stroke();
 }else if(b.kind===3){
  // Three crisp manga slashes with paper highlights and directional fragments.
  for(let i=0;i<3;i++){ctx.save();ctx.translate((i-1)*size*.34,(i-1)*size*.13);ctx.rotate(-.49);const length=size*(i===1?1.22:.95),width=size*.095;
   line(ctx,[[-width*.4,length],[width,-length*.96],[width*.15,-length*.47],[-width,length*.66]]);ctx.closePath();ctx.fillStyle='#ef4138';ctx.strokeStyle='#371b24';ctx.lineWidth=2.5;ctx.fill();ctx.stroke();
   line(ctx,[[0,length*.55],[width*.62,-length*.66]]);ctx.strokeStyle='#fff1d1';ctx.lineWidth=1.9;ctx.stroke();ctx.restore();}
  for(let i=0;i<5;i++){const a=(i/5)*TAU;ctx.save();ctx.translate(Math.cos(a)*size*.93,Math.sin(a)*size*.8);ctx.rotate(a);line(ctx,[[0,0],[12,2],[4,6]]);ctx.closePath();ctx.fillStyle=i%2?'#ffe0a1':'#e83a32';ctx.fill();ctx.restore();}
 }else if(b.kind===4){
  // Chakra-like filaments converge into a compact spiral, then gently disperse.
  ctx.shadowColor='#67c7ff';ctx.shadowBlur=6;
  for(let strand=0;strand<5;strand++){ctx.beginPath();for(let i=0;i<=65;i++){const t=i/65,a=t*TAU*1.4+strand*TAU/5+progress*1.7,r=size*(.08+t*.8);const x=Math.cos(a)*r,y=Math.sin(a)*r*.78;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=strand%2?'#daf8ff':'#429be9';ctx.lineWidth=strand%2?1.4:2.6;ctx.stroke();}
  ctx.shadowBlur=0;ctx.beginPath();ctx.arc(0,0,size*.13,0,TAU);ctx.fillStyle='#d7faff';ctx.fill();
 }else if(b.kind===5){
  // A single flame crescent with tapered tongues and drifting embers.
  ctx.rotate(-.5+progress*.4);
  for(let layer=0;layer<3;layer++){ctx.beginPath();const outer=size*(1-layer*.17),inner=outer*.63;ctx.arc(0,0,outer,-2.6,.5);ctx.quadraticCurveTo(outer*.5,outer*.2,outer*.65,-outer*.08);ctx.arc(0,0,inner,.05,-2.5,true);ctx.closePath();ctx.fillStyle=['#b22e25','#f37930','#ffe4a1'][layer];ctx.fill();}
  for(let i=0;i<9;i++){const a=-2.6+i*.36,r=size*(.85+progress*.3);ctx.save();ctx.translate(Math.cos(a)*r,Math.sin(a)*r);ctx.rotate(a);line(ctx,[[0,-4],[14+progress*10,0],[0,4]]);ctx.fillStyle=i%2?'#ffbd60':'#ed6332';ctx.fill();ctx.restore();}
 }else if(b.kind===6){
  // Paired blue/purple orbits inspired by spatial powers; no full-screen flash.
  ctx.shadowColor='#9781ff';ctx.shadowBlur=7;
  for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*Math.PI/3+progress*.9);ctx.beginPath();ctx.ellipse(0,0,size*.84,size*.3,0,0,TAU);ctx.strokeStyle=i===1?'#8be9ff':'#b597ff';ctx.lineWidth=i===1?2.5:1.5;ctx.stroke();ctx.restore();}
  for(let i=0;i<2;i++){const a=progress*2+i*Math.PI;ctx.beginPath();ctx.arc(Math.cos(a)*size*.64,Math.sin(a)*size*.35,size*.08,0,TAU);ctx.fillStyle=i?'#f39ede':'#75ceff';ctx.fill();}
  ctx.shadowBlur=0;ctx.beginPath();ctx.arc(0,0,size*.16,0,TAU);ctx.fillStyle='#39305d';ctx.fill();ctx.strokeStyle='#ddcaff';ctx.lineWidth=1.7;ctx.stroke();
 }else{
  // Soft water rings with rounded droplets, matching the small slime cameo.
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,size*.2,size*(.35+i*.25),size*(.1+i*.08),0,0,TAU);ctx.strokeStyle=i===1?'#e2fbff':'#4db4dc';ctx.lineWidth=2.2-i*.4;ctx.stroke();}
  for(let i=0;i<7;i++){const a=i*TAU/7,r=size*(.3+arrival*.48),x=Math.cos(a)*r,y=Math.sin(a)*r*.7-progress*size*.2;ctx.beginPath();ctx.moveTo(x,y-9);ctx.bezierCurveTo(x+13,y+5,x+8,y+14,x,y+14);ctx.bezierCurveTo(x-8,y+14,x-13,y+5,x,y-9);ctx.fillStyle=i%2?'#76c7ec':'#b5e8f9';ctx.fill();ctx.strokeStyle='#347a9f';ctx.lineWidth=1;ctx.stroke();}
 }
 ctx.restore();
}

export default function ComicPowers(){
 const canvas=useRef<HTMLCanvasElement>(null),toggle=useRef<HTMLButtonElement>(null);
 const [enabled,setEnabled]=useState(true),[reduced,setReduced]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update)},[]);
 useEffect(()=>{
  const surface=canvas.current,root=surface?.closest('.op-theme-comic');if(!surface||!root||!enabled||reduced)return;
  const ctx=surface.getContext('2d');if(!ctx)return;
  let bursts:Burst[]=[],frame=0,sequence=0,last=-Infinity,down:{x:number;y:number;id:number}|null=null;
  const hoverTimes=new WeakMap<Element,number>();
  const clear=()=>{cancelAnimationFrame(frame);frame=0;bursts=[];surface.dataset.activeEffects='0';ctx.clearRect(0,0,surface.width,surface.height)};
  const resize=()=>{clear();const dpr=Math.min(window.devicePixelRatio||1,1.5);surface.width=Math.ceil(innerWidth*dpr);surface.height=Math.ceil(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
  const render=(time:number)=>{ctx.clearRect(0,0,innerWidth,innerHeight);bursts=bursts.filter(b=>time-b.at<DURATION);surface.dataset.activeEffects=String(bursts.length);bursts.forEach(b=>paint(ctx,b,time-b.at,innerWidth<600));frame=bursts.length?requestAnimationFrame(render):0;};
  const permitted=(target:EventTarget|null)=>{
   if(!(target instanceof Element)||target.closest('form,dialog,input,textarea,select,summary,details,footer,[contenteditable],.comic-power-toggle'))return false;
   const action=target.closest('button,a');if(action){if(action.matches(':disabled,[aria-disabled="true"]'))return false;return action.tagName==='BUTTON'||action.matches('a.edition-cta[href^="#"]');}
   return !!target.closest('main')&&target.matches('main,section,article,div');
  };
  const spawn=(x:number,y:number,chosen?:number)=>{const time=performance.now();if(time-last<160||document.hidden)return;last=time;const kind=chosen??sequence%effectNames.length;surface.dataset.lastEffect=effectNames[kind];surface.dataset.effectCount=String(Number(surface.dataset.effectCount??0)+1);bursts=[...bursts,{x,y,at:time,kind,turn:((sequence++%5)-2)*.12}].slice(-3);if(!frame)frame=requestAnimationFrame(render)};
  const characterKind=(target:EventTarget|null)=>target instanceof Element?Number(target.closest('[data-comic-power]')?.getAttribute('data-comic-power')??NaN):NaN;
  const hover=(ev:Event)=>{const e=ev as PointerEvent;if(e.pointerType==='touch'||!(e.target instanceof Element))return;const cutout=e.target.closest('[data-comic-power]');if(!cutout||e.relatedTarget instanceof Node&&cutout.contains(e.relatedTarget))return;const time=performance.now();if(time-(hoverTimes.get(cutout)??-Infinity)<1200)return;hoverTimes.set(cutout,time);const r=cutout.getBoundingClientRect();spawn(r.left+r.width/2,r.top+r.height*.45,characterKind(cutout))};
  const start=(ev:Event)=>{const e=ev as PointerEvent;if(e.isPrimary&&e.button===0)down={x:e.clientX,y:e.clientY,id:e.pointerId}};
  const finish=(ev:Event)=>{const e=ev as PointerEvent;const original=down;down=null;if(!original||original.id!==e.pointerId||Math.hypot(e.clientX-original.x,e.clientY-original.y)>8||!permitted(e.target)||getSelection()?.toString())return;const kind=characterKind(e.target);spawn(e.clientX,e.clientY,Number.isNaN(kind)?undefined:kind)};
  const cancel=()=>{down=null};
  const keyboard=(ev:Event)=>{const e=ev as KeyboardEvent;if(e.repeat||!['Enter',' '].includes(e.key)||!permitted(e.target)||!(e.target instanceof Element)||!e.target.closest('button,a'))return;const r=e.target.getBoundingClientRect(),kind=characterKind(e.target);spawn(r.left+r.width/2,r.top+r.height/2,Number.isNaN(kind)?undefined:kind)};
  const hide=()=>{if(document.hidden)clear()};
  resize();root.addEventListener('pointerover',hover,{passive:true});root.addEventListener('pointerdown',start,{passive:true});root.addEventListener('pointerup',finish,{passive:true});root.addEventListener('pointercancel',cancel,{passive:true});root.addEventListener('keyup',keyboard);window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',hide);
  return()=>{clear();root.removeEventListener('pointerover',hover);root.removeEventListener('pointerdown',start);root.removeEventListener('pointerup',finish);root.removeEventListener('pointercancel',cancel);root.removeEventListener('keyup',keyboard);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',hide)};
 },[enabled,reduced]);
 return <><canvas className="comic-power-canvas" ref={canvas} aria-hidden="true"/><button ref={toggle} className="comic-power-toggle" type="button" aria-pressed={enabled&&!reduced} disabled={reduced} onClick={()=>setEnabled(value=>!value)} title={reduced?'Your reduced-motion preference disables power effects.':'Brief comic effects on buttons and empty space. No sound.'}><span aria-hidden="true">ϟ</span>{reduced?'Motion reduced':`Power effects ${enabled?'on':'off'}`}</button></>;
}
