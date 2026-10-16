import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {WorldFrame} from './WorldExperience';
import {sampleWorldCamera} from './WorldCamera';
import type {Viewport} from './experience';

type Props = {
  frame:RefObject<WorldFrame>;
  host:RefObject<HTMLDivElement|null>;
  quality:'FULL'|'REDUCED';
  viewport:Viewport;
  chapter:number;
  ready:boolean;
  shaderFailed:RefObject<boolean>;
  onReady:()=>void;
  onFail:()=>void;
  onDowngrade:()=>void;
};

const ACTIVE_GRACE_MS = 1000;
const WARMUP_MS = 2000;
const SAMPLE_WINDOW_MS = 5000;
const CAPACITY = 512;

/**
 * Sole camera writer and demand-frame scheduler for the world.
 * Deliberate idle throttling is excluded from active frame-time observations.
 */
export function WorldRuntime(props:Props) {
  const {camera,gl,scene,invalidate}=useThree();
  const latest=useRef(props);latest.current=props;
  const position=useMemo(()=>new THREE.Vector3(),[]);
  const target=useMemo(()=>new THREE.Vector3(),[]);
  const pointer=useRef(new THREE.Vector2());
  const point=useRef<THREE.PointLight>(null);
  const shadowLight=useRef<THREE.DirectionalLight>(null);
  const shadowTarget=useMemo(()=>new THREE.Object3D(),[]);
  const shadowPosition=useMemo(()=>new THREE.Vector3(Infinity,Infinity,Infinity),[]);
  const readySent=useRef(false);
  const failed=useRef(false);
  const warmupUntil=useRef(Infinity);
  const lastAnimated=useRef(0);
  const lastSample=useRef(0);
  const diagnosticAt=useRef(0);
  const wakeRef=useRef<()=>void>(()=>{});
  const shadowDirty=useRef(true);
  const shadowState=useRef({chapter:-1,engaged:'',geometryCount:-1,ready:false});
  const observations=useMemo(()=>({
    samples:new Float32Array(CAPACITY),sorted:new Float32Array(CAPACITY),
    count:0,elapsed:0,sum:0,p95:0,fps:0,badWindows:0,downgradeRequested:false,
  }),[]);

  const activeInput=(now:number)=>now-latest.current.frame.current.lastInput<=ACTIVE_GRACE_MS;
  const allowed=()=>latest.current.frame.current.active&&!latest.current.frame.current.blocked&&!document.hidden&&!failed.current&&!latest.current.shaderFailed.current;
  const reportFailure=()=>{if(!failed.current){failed.current=true;latest.current.onFail();}};

  function percentiles() {
    if(observations.count===0)return;
    observations.sorted.set(observations.samples);
    observations.sorted.fill(Infinity,observations.count);
    observations.sorted.sort();
    observations.p95=observations.sorted[Math.max(0,Math.ceil(observations.count*.95)-1)];
    observations.fps=observations.sum>0?observations.count*1000/observations.sum:0;
  }

  useEffect(()=>{
    let timer:ReturnType<typeof setTimeout>|null=null;
    let dueAt=Infinity,lastRequest=-Infinity;
    const el=props.host.current;
    const clear=()=>{if(timer!==null){clearTimeout(timer);timer=null;}dueAt=Infinity;};
    const suspend=()=>{clear();lastRequest=-Infinity;lastAnimated.current=0;lastSample.current=0;};
    const cadence=(now:number)=>{
      const active=activeInput(now);
      return 1000/(latest.current.quality==='FULL'?(active?60:24):(active?30:15));
    };
    const tick=()=>{
      timer=null;dueAt=Infinity;if(!allowed()){suspend();return;}
      lastRequest=performance.now();invalidate();schedule();
    };
    const schedule=()=>{
      if(!allowed()){suspend();return;}
      const now=performance.now(),next=Math.max(now,lastRequest+cadence(now));
      // A stream of pointer events must not restart a timer forever, nor bypass
      // REDUCED's active cap by invalidating on every raw pointer event.
      if(timer!==null&&dueAt<=next+.5)return;
      clear();dueAt=next;timer=setTimeout(tick,Math.max(0,next-now));
    };
    const wake=()=>{
      if(!allowed()){suspend();return;}
      shadowDirty.current=true;
      const now=performance.now();
      if(now-lastRequest>=cadence(now)-.5){lastRequest=now;invalidate();}
      schedule();
    };
    const lost=(event:Event)=>{event.preventDefault();suspend();reportFailure();};
    wakeRef.current=wake;
    el?.addEventListener('world-frame',wake);
    document.addEventListener('visibilitychange',wake);
    gl.domElement.addEventListener('webglcontextlost',lost);
    wake();
    return()=>{
      suspend();wakeRef.current=()=>{};
      el?.removeEventListener('world-frame',wake);
      document.removeEventListener('visibilitychange',wake);
      gl.domElement.removeEventListener('webglcontextlost',lost);
    };
  },[invalidate,gl,props.frame,props.host,props.quality]);

  useEffect(()=>{
    readySent.current=false;failed.current=false;warmupUntil.current=Infinity;
    lastSample.current=0;observations.count=0;observations.elapsed=0;observations.sum=0;
    observations.p95=0;observations.fps=0;observations.badWindows=0;observations.downgradeRequested=false;
    const el=props.host.current;if(el){delete el.dataset.frameP95;delete el.dataset.activeFPS;}
    shadowDirty.current=true;shadowPosition.set(Infinity,Infinity,Infinity);
    wakeRef.current();
  },[props.quality,observations,shadowPosition]);

  useEffect(()=>{shadowDirty.current=true;wakeRef.current();},[props.ready,props.chapter,props.viewport]);

  useEffect(()=>{
    const previousAutoUpdate=gl.shadowMap.autoUpdate;
    const ownedLight=shadowLight.current;
    gl.shadowMap.autoUpdate=false;
    shadowDirty.current=true;
    // StrictMode replays effects without remounting the primitive. Explicitly
    // reattach its target after cleanup so it remains part of the scene graph.
    if(ownedLight)scene.add(shadowTarget);
    return()=>{
      gl.shadowMap.autoUpdate=previousAutoUpdate;
      gl.shadowMap.needsUpdate=false;
      // This light explicitly opts out of R3F disposal below; this owner releases
      // both its shadow map and optional blur map exactly when the runtime ends.
      ownedLight?.dispose();
      if(ownedLight){ownedLight.shadow.map=null;ownedLight.shadow.mapPass=null;}
      shadowTarget.removeFromParent();
    };
  },[gl,scene,props.quality,props.viewport,shadowTarget]);

  useFrame((_,dt)=>{
    if(!allowed()){lastAnimated.current=0;lastSample.current=0;return;}
    const f=props.frame.current;
    const now=performance.now();
    const elapsed=lastAnimated.current?Math.min((now-lastAnimated.current)/1000,.1):Math.min(dt,.05);
    lastAnimated.current=now;f.time+=elapsed;
    if(camera instanceof THREE.PerspectiveCamera){
      const fov=props.viewport==='phone'?64:props.viewport==='tablet'?52:45;
      if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();shadowDirty.current=true;}
    }
    sampleWorldCamera(f.progress,props.viewport!=='desktop',position,target);
    const factor=1-Math.exp(-elapsed*6);
    pointer.current.x=THREE.MathUtils.lerp(pointer.current.x,f.pointerX,factor);
    pointer.current.y=THREE.MathUtils.lerp(pointer.current.y,f.pointerY,factor);
    position.x+=pointer.current.x*(props.viewport==='desktop'?.12:.02);
    position.y+=pointer.current.y*.06;
    camera.position.copy(position);camera.lookAt(target);

    if(point.current){
      point.current.position.set(position.x+4,position.y+3,position.z-5);
      point.current.intensity=THREE.MathUtils.lerp(18,42,THREE.MathUtils.smoothstep(f.progress,0,.12));
    }
    if(shadowLight.current){
      shadowLight.current.position.set(position.x+6,position.y+8,position.z+1);
      shadowTarget.position.set(0,0,position.z-10);shadowTarget.updateMatrixWorld();
      const state=shadowState.current;
      const engaged=f.engaged??'';
      const geometryCount=gl.info.memory.geometries;
      if(shadowDirty.current||shadowPosition.distanceToSquared(position)>.000025||state.chapter!==props.chapter||state.engaged!==engaged||state.geometryCount!==geometryCount||state.ready!==props.ready){
        gl.shadowMap.needsUpdate=true;
        shadowPosition.copy(position);shadowDirty.current=false;
        state.chapter=props.chapter;state.engaged=engaged;state.geometryCount=geometryCount;state.ready=props.ready;
      }
    }

    if(props.ready&&!readySent.current){
      try{gl.compile(scene,camera);}catch{reportFailure();return;}
      if(props.shaderFailed.current){reportFailure();return;}
      readySent.current=true;warmupUntil.current=performance.now()+WARMUP_MS;lastSample.current=0;
      props.onReady();
    }

    const measuring=readySent.current&&now>=warmupUntil.current&&activeInput(now);
    if(measuring){
      if(lastSample.current){
        const ms=Math.min(now-lastSample.current,500);
        if(observations.count<CAPACITY)observations.samples[observations.count++]=ms;
        observations.elapsed+=ms;observations.sum+=ms;
      }
      lastSample.current=now;
    }else lastSample.current=0;
    if(observations.elapsed>=SAMPLE_WINDOW_MS&&observations.count>=30){
      percentiles();
      const threshold=props.quality==='FULL'?30:50;
      observations.badWindows=observations.p95>threshold?observations.badWindows+1:0;
      if(observations.badWindows>=2&&!observations.downgradeRequested){
        observations.downgradeRequested=true;props.onDowngrade();
      }
      observations.count=0;observations.elapsed=0;observations.sum=0;
    }
    if(now-diagnosticAt.current>=500){
      diagnosticAt.current=now;if(observations.count>=8)percentiles();
      const el=props.host.current;
      if(el){
        if(observations.p95>0)el.dataset.frameP95=observations.p95.toFixed(1);
        if(observations.fps>0)el.dataset.activeFPS=observations.fps.toFixed(1);
        el.dataset.camera=`${position.x.toFixed(2)},${position.y.toFixed(2)},${position.z.toFixed(2)}`;
        el.dataset.frames=String(gl.info.render.frame);el.dataset.drawCalls=String(gl.info.render.calls);el.dataset.triangles=String(gl.info.render.triangles);
        el.dataset.geometries=String(gl.info.memory.geometries);el.dataset.textures=String(gl.info.memory.textures);
        el.dataset.worldTime=f.time.toFixed(2);
      }
    }
  },-2);

  const mapSize=props.viewport==='desktop'?1024:768;
  return <>
    <pointLight ref={point} color="#f3f0e9" intensity={42} distance={24} decay={2}/>
    {props.quality==='FULL'&&<>
      <primitive object={shadowTarget}/>
      <directionalLight ref={shadowLight} dispose={null} target={shadowTarget} color="#fff5e7" intensity={1.4} castShadow
        shadow-mapSize={[mapSize,mapSize]} shadow-camera-near={.5} shadow-camera-far={40}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-7}
        shadow-bias={-.0003} shadow-normalBias={.03}/>
    </>}
  </>;
}
