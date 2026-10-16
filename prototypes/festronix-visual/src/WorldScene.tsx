import {useEffect,useRef,type RefObject} from 'react';
import {Canvas,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {WorldEnvironment} from './WorldEnvironment';
import {WorldModel} from './WorldModel';
import {WorldRuntime} from './WorldRuntime';
import {clubs,type MachineId,type WorldFrame} from './WorldExperience';
import type {Viewport} from './experience';
type Props={frame:RefObject<WorldFrame>;host:RefObject<HTMLDivElement|null>;quality:'FULL'|'REDUCED';viewport:Viewport;chapter:number;ready:boolean;onReady:()=>void;onFail:()=>void;onDowngrade:()=>void;onLoad:(id:MachineId)=>void;onProgress:(id:MachineId,loaded:number,total:number)=>void;onError:(id:MachineId)=>void;onEngage:(id:MachineId)=>void;onHover:(id:MachineId|null)=>void};
type RuntimeProps=Props&{shaderFailed:RefObject<boolean>};
function Lighting(){
  const {gl,scene}=useThree();
  useEffect(()=>{
    const pmrem=new THREE.PMREMGenerator(gl),room=new RoomEnvironment();
    const environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();scene.environment=environment.texture;
    return()=>{scene.environment=null;environment.dispose();};
  },[gl,scene]);
  return <><ambientLight intensity={.5}/><directionalLight position={[4,12,10]} intensity={2.7} color="#fff8ed"/><directionalLight position={[-8,5,-10]} intensity={1.4} color="#d4e0e5"/></>;
}
function World(props:RuntimeProps){
  const tier=props.quality==='FULL'?'full':'reduced';
  const modelQuality=props.chapter===6?'REDUCED':props.quality;
  const modelProps={frame:props.frame,quality:modelQuality,onLoad:props.onLoad,onProgress:props.onProgress,onError:props.onError,onEngage:props.onEngage,onHover:props.onHover};
  const visible=clubs.filter(club=>props.chapter===6||(props.chapter===0?club.id==='gaming':Math.abs(club.chapter-props.chapter)<=1));
  return <><color attach="background" args={['#070e13']}/><Lighting/><WorldRuntime {...props}/><WorldEnvironment frame={props.frame} quality={props.quality}/>
    {visible.map((club,index)=><WorldModel key={club.id} {...modelProps} id={club.id} url={'/models/clubs/'+club.model+'-'+(props.chapter===6?'reduced':tier)+'.glb.gz'} position={props.chapter===6?([-2.2+index*1.1,0,-129-Math.abs(index-2)*.55] as [number,number,number]):club.position} size={props.chapter===6?1.15:club.size} rotation={club.rotation}/>)}
  </>;
}
export default function WorldScene(props:Props){
  const shaderFailed=useRef(false);
  return <Canvas frameloop="demand" shadows={props.quality==='FULL'?'soft':false} dpr={props.quality==='FULL'?(props.viewport==='phone'?1:Math.min(devicePixelRatio,1.25)):1} camera={{position:[0,2.3,13],fov:props.viewport==='phone'?64:props.viewport==='tablet'?52:45,near:.1,far:100}} gl={{antialias:props.quality==='FULL',alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.1;gl.debug.onShaderError=()=>{shaderFailed.current=true;props.onFail();};}}><World {...props} shaderFailed={shaderFailed}/></Canvas>;
}
