import {Component,Suspense,lazy,useCallback,useEffect,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {HeroFacts,Identity} from './Heroes';
import {edition} from './data';
import {useMedia,useViewport,type Quality} from './experience';
import {clubs,machines,worldChapter,worldChapters,worldFrame,type ClubId} from './WorldExperience';
import './world.css';
gsap.registerPlugin(ScrollTrigger);
const WorldScene=lazy(()=>import('./WorldScene'));
class WorldBoundary extends Component<{children:ReactNode;onFail:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFail();}
  render(){return this.state.failed?null:this.props.children;}
}
type Props={quality:Quality;reduced:boolean;blocked:boolean;onCategory:(category:string)=>void;onDowngrade:()=>void};
export function WorldExpedition({quality,reduced,blocked,onCategory,onDowngrade}:Props){
  const viewport=useViewport(),short=useMedia('(max-height:540px)');
  const staticMode=quality==='STATIC'||reduced||short;
  const region=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),frame=useRef(worldFrame());
  const panel=useRef<HTMLElement>(null),inspectionTrigger=useRef<HTMLButtonElement|null>(null);
  const loadedAssets=useRef(new Set<ClubId>());
  const [chapter,setChapter]=useState(0),[selected,setSelected]=useState<ClubId|null>(null),[hovered,setHovered]=useState<ClubId|null>(null);
  const [ready,setReady]=useState(false),[assetReady,setAssetReady]=useState(false),[failed,setFailed]=useState(false);
  const [attempt,setAttempt]=useState(0),[mounted,setMounted]=useState(true),[needsReload,setNeedsReload]=useState(false);
  const [transfer,setTransfer]=useState({loaded:0,total:0}),[assetErrors,setAssetErrors]=useState<ClubId[]>([]);
  const awake=useCallback(()=>{frame.current.lastInput=performance.now();host.current?.dispatchEvent(new Event('world-frame'));},[]);
  const onReady=useCallback(()=>setReady(true),[]);
  const onFail=useCallback(()=>{setFailed(true);setReady(false);},[]);
  const onBoundaryFail=useCallback(()=>{setNeedsReload(true);onFail();},[onFail]);
  const engage=useCallback((id:ClubId)=>{
    if(frame.current.blocked)return;
    frame.current.engaged=frame.current.engaged===id?null:id;setSelected(frame.current.engaged);awake();
  },[awake]);
  const hover=useCallback((id:ClubId|null)=>{frame.current.hovered=id;setHovered(id);awake();},[awake]);
  const onLoad=useCallback((id:ClubId)=>{
    loadedAssets.current.add(id);
    if(host.current)host.current.dataset.loadedAssets=Array.from(loadedAssets.current).join(',');
    setAssetReady(true);setAssetErrors(previous=>previous.filter(value=>value!==id));awake();
  },[awake]);
  const onProgress=useCallback((id:ClubId,loaded:number,total:number)=>{if(id==='gaming')setTransfer({loaded,total});},[]);
  const onError=useCallback((id:ClubId)=>{
    if(id==='gaming'&&frame.current.progress<.27)onFail();
    else setAssetErrors(previous=>previous.includes(id)?previous:[...previous,id]);
  },[onFail]);
  useLayoutEffect(()=>{
    loadedAssets.current.clear();if(host.current)delete host.current.dataset.loadedAssets;
    setReady(false);setAssetReady(false);setFailed(false);setTransfer({loaded:0,total:0});setAssetErrors([]);
  },[quality,attempt,staticMode]);
  useEffect(()=>{
    frame.current.blocked=blocked;const bounds=region.current?.getBoundingClientRect();
    frame.current.active=!blocked&&!document.hidden&&!!bounds&&bounds.bottom>0&&bounds.top<innerHeight;
    if(blocked){frame.current.pointerX=0;frame.current.pointerY=0;hover(null);}awake();
  },[blocked,awake,hover]);
  useEffect(()=>{if(selected&&inspectionTrigger.current===document.activeElement)panel.current?.focus({preventScroll:true});},[selected]);
  useEffect(()=>{
    if(staticMode||failed||ready||!mounted)return;
    const timer=setTimeout(onFail,15000);return()=>clearTimeout(timer);
  },[staticMode,failed,ready,mounted,onFail,quality,attempt]);
  useEffect(()=>{
    const el=region.current;if(!el)return;let release:ReturnType<typeof setTimeout>|undefined;
    const update=()=>{
      const bounds=el.getBoundingClientRect(),visible=bounds.bottom>0&&bounds.top<innerHeight;
      frame.current.active=visible&&!document.hidden&&!frame.current.blocked;
      if(visible){clearTimeout(release);release=undefined;setMounted(true);awake();}
      else if(!release)release=setTimeout(()=>{setMounted(false);setReady(false);setAssetReady(false);release=undefined;},10000);
    };
    const observer=new IntersectionObserver(update);observer.observe(el);
    window.addEventListener('scroll',update,{passive:true});document.addEventListener('visibilitychange',update);update();
    return()=>{clearTimeout(release);observer.disconnect();window.removeEventListener('scroll',update);document.removeEventListener('visibilitychange',update);frame.current.active=false;};
  },[awake]);
  useLayoutEffect(()=>{
    const el=region.current;if(!el)return;let previous=-1;
    const sample=(progress:number)=>{
      frame.current.progress=progress;el.dataset.progress=progress.toFixed(4);
      const next=worldChapter(Math.min(1,progress+.012));el.dataset.chapter=worldChapters[next].label;
      if(next!==previous){previous=next;setChapter(next);
        if(frame.current.engaged&&next!==machines[frame.current.engaged].chapter&&!(next===0&&frame.current.engaged==='gaming')){frame.current.engaged=null;setSelected(null);}
        hover(null);
      }
      awake();
    };
    if(staticMode||failed){sample(0);return;}
    const trigger=ScrollTrigger.create({trigger:el,start:'top top',end:'bottom bottom',onUpdate:self=>sample(self.progress),onRefresh:self=>sample(self.progress)});
    sample(trigger.progress);let cancelled=false;const resize=()=>ScrollTrigger.refresh();
    window.addEventListener('resize',resize);document.fonts.ready.then(()=>{if(!cancelled)resize();});
    return()=>{cancelled=true;trigger.kill();window.removeEventListener('resize',resize);};
  },[staticMode,failed,viewport,awake,hover]);
  const pointer=(event:React.PointerEvent<HTMLElement>)=>{
    if(event.pointerType!=='mouse'||viewport!=='desktop'||blocked)return;
    frame.current.pointerX=(event.clientX/innerWidth-.5)*2;frame.current.pointerY=-(event.clientY/innerHeight-.5)*2;awake();
  };
  const reset=()=>{frame.current.pointerX=0;frame.current.pointerY=0;awake();};
  const close=()=>{frame.current.engaged=null;setSelected(null);inspectionTrigger.current?.focus({preventScroll:true});awake();};
  const visibleClub=selected||hovered,compact=staticMode||failed;
  const percent=transfer.total?Math.min(100,Math.round(transfer.loaded/transfer.total*100)):null;
  const retry=()=>{if(needsReload){location.reload();return;}setMounted(true);setAttempt(n=>n+1);};
  return <section ref={region} className={'world-expedition club-expedition'+(compact?' is-static':'')} onPointerMove={pointer} onPointerLeave={reset} data-world="festronix-clubs" data-chapter="Arrival">
    <div className="world-backdrop" aria-hidden="true">
      <div ref={host} className={'world-scene'+(ready?' is-ready':'')} data-state={staticMode?'static':failed?'failed':!mounted?'suspended':ready?'ready':'loading'} data-quality={staticMode?'STATIC':quality}>
        <img className="world-fallback" src="/models/clubs/posters/arrival.webp" alt="" width="1000" height="700"/>
        {!staticMode&&!failed&&mounted&&<WorldBoundary key={quality+'-'+attempt} onFail={onBoundaryFail}><Suspense fallback={null}><WorldScene key={quality+'-'+attempt} frame={frame} host={host} quality={quality==='FULL'?'FULL':'REDUCED'} viewport={viewport} chapter={chapter} ready={assetReady} onReady={onReady} onFail={onFail} onDowngrade={onDowngrade} onLoad={onLoad} onProgress={onProgress} onError={onError} onEngage={engage} onHover={hover}/></Suspense></WorldBoundary>}
      </div>
    </div>
    {!staticMode&&!failed&&!ready&&<div className="world-loading" role="status"><span className="world-loading-icon" aria-hidden="true">F×</span><div><strong>{percent===100?'PREPARING YOUR FIRST CLUB':'LOADING THE CLUB GALLERY'}</strong><span>{percent!==null?percent+'% · ':''}{Math.round(transfer.loaded/1024)} KB received</span><div className="world-load-track"><i style={{width:(percent??0)+'%'}}/></div></div><a href="#events">Browse events now →</a></div>}
    {failed&&<div className="world-loading"><strong>The gallery is unavailable. Club and event information is ready.</strong><button onClick={retry}>{needsReload?'Reload gallery ↻':'Retry gallery ↗'}</button></div>}
    <nav className="world-wayfinder" aria-label="FESTRONIX club gallery">{worldChapters.map((zone,i)=><a href={'#'+zone.id} key={zone.id} aria-current={!compact&&chapter===i?'step':undefined}><span>0{i}</span><b>{zone.label}</b></a>)}</nav>
    {visibleClub&&!compact&&<aside ref={panel} tabIndex={-1} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close();}}} data-machine={visibleClub} className={'world-object-panel'+(selected?' is-engaged':'')} aria-label="Club spotlight">
      <span>{selected?'MEET THE CLUB':'EXPLORE THE CLUB'}</span><h3>{machines[visibleClub].title}</h3>
      <p>{machines[visibleClub].description}</p>
      {selected&&<><p className="club-program-note">Club programs will appear here once confirmed.</p><a href="#events" onClick={()=>onCategory(machines[visibleClub].category)}>Browse festival events →</a><button aria-label="Close club spotlight" onClick={close}>Close ×</button></>}
    </aside>}
    <div className="world-flow">
      <section className="world-stage world-arrival" id="arrival"><div className="world-copy">
        <p className="world-kicker">VARDHAMAN COLLEGE OF ENGINEERING <span>ANNUAL TECHNOLOGY FESTIVAL / 2027</span></p><Identity/>
        <p className="world-eyebrow">MANY INTERESTS. ONE FESTRONIX.</p><h2>Find your<br/><em>people.</em></h2>
        <p className="world-description">Travel through the clubs that bring our campus together. Play, develop, write, film and discover.</p><HeroFacts/>
        <a className="world-travel" href="#gaming-club">Explore the club gallery <span>↓</span></a>
        <div className="club-directory" aria-label="Explore our clubs">{clubs.map(club=><a href={'#'+club.anchor} key={club.id}>{club.short}</a>)}</div>
      </div><div className="world-coordinate" aria-hidden="true">00 / THE CLUB GALLERY</div></section>
      {clubs.map((club,index)=><section key={club.id} className={'world-stage club-stage club-'+club.id+(index%2?' is-right':'')} id={club.anchor} aria-labelledby={club.id+'-title'}>
        <div className="world-copy">
          <p className="world-eyebrow">{'0'+(index+1)+' / '+club.title.toUpperCase()}</p>
          <h2 id={club.id+'-title'}>{club.heading[0]}<br/><em>{club.heading[1]}</em></h2>
          <p className="world-description">{club.description}</p>
          <div className="world-tags">{club.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
          <button className="world-inspect" aria-pressed={selected===club.id} onClick={event=>{inspectionTrigger.current=event.currentTarget;engage(club.id);}}>Meet {club.short==='SDC'?'SDC':club.title} <span aria-hidden="true">↗</span></button>
          <a className="world-category" href="#events" onClick={()=>onCategory(club.category)}>Browse festival events <span aria-hidden="true">→</span></a>
        </div>
        {compact&&<img className="club-still" src={'/models/clubs/posters/'+club.id+'.webp'} alt={club.artifact} loading="lazy" width="550" height="540"/>}
        <div className="world-coordinate" aria-hidden="true">{'0'+(index+1)+' / '+club.short.toUpperCase()}</div>
      </section>)}
      <section className="world-stage world-final" id="final-stage"><div className="world-copy">
        <p className="world-eyebrow">06 / YOUR NEXT CHAPTER</p><h2>Bring your<br/><em>curiosity.</em></h2>
        <p className="world-description">FESTRONIX {edition.label}. Many clubs. One shared invitation to make something.</p>
        <div className="world-final-actions"><a className="button primary" href="#events" onClick={()=>onCategory('All')}>Explore events <span>↗</span></a><a className="world-travel" href="#arrival">Replay the gallery ↺</a></div>
        <p className="world-demo">Club names supplied by the owner. Festival dates, events and archive editions remain fictional prototype content.</p>
      </div><div className="world-coordinate" aria-hidden="true">06 / FESTRONIX</div></section>
    </div>
    {assetErrors.length>0&&<div className="world-asset-status" role="status">A club object is unavailable. All club information remains accessible. <button onClick={retry}>Retry models ↗</button></div>}
  </section>;
}
