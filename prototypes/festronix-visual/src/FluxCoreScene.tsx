import {useEffect,useRef,type MutableRefObject} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {MeshDistortMaterial} from '@react-three/drei';
import {MathUtils,type Group,type Mesh} from 'three';

export type FluxSceneMode='Core'|'Liquid Flux'|'Network / Portal';
export interface FluxPointer {x:number;y:number}
interface SceneProps {
 mode:FluxSceneMode;
 low:boolean;
 active:boolean;
 pointer:MutableRefObject<FluxPointer>;
 onReady:()=>void;
 onFail:()=>void;
}

function SceneLifecycle({onReady,onFail}:{onReady:()=>void;onFail:()=>void}){
 const {gl}=useThree();
 useEffect(()=>{
  const canvas=gl.domElement;
  const lost=(event:Event)=>{event.preventDefault();onFail()};
  canvas.addEventListener('webglcontextlost',lost);
  onReady();
  return()=>canvas.removeEventListener('webglcontextlost',lost);
 },[gl,onReady,onFail]);
 return null;
}

function EnergyCore({low,active,pointer}:Pick<SceneProps,'low'|'active'|'pointer'>){
 const assembly=useRef<Group>(null),outer=useRef<Group>(null),inner=useRef<Group>(null),hub=useRef<Mesh>(null);
 useFrame(({clock},delta)=>{
  if(!active)return;
  const dt=Math.min(delta,.05),t=clock.elapsedTime;
  if(assembly.current){
   assembly.current.rotation.y=MathUtils.damp(assembly.current.rotation.y,pointer.current.x*.13,4,dt);
   assembly.current.rotation.x=MathUtils.damp(assembly.current.rotation.x,.12-pointer.current.y*.08,4,dt);
   assembly.current.position.y=Math.sin(t*.45)*.045;
  }
  if(outer.current)outer.current.rotation.z=t*.055;
  if(inner.current)inner.current.rotation.z=-t*.09;
  if(hub.current)hub.current.rotation.y=t*.07;
 });
 const segments=low?64:112;
 return <group ref={assembly} rotation={[.12,0,-.05]}>
  <mesh ref={hub}><icosahedronGeometry args={[.7,low?1:2]}/><meshPhysicalMaterial color="#bbd4c8" metalness={.86} roughness={.24} clearcoat={1} clearcoatRoughness={.2}/></mesh>
  <mesh scale={.64}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color="#e7fff3" emissive="#b9f6dc" emissiveIntensity={2.6} toneMapped={false}/></mesh>
  <mesh position={[0,0,.707]}><circleGeometry args={[.235,low?24:40]}/><meshBasicMaterial color="#dcffea" toneMapped={false}/></mesh>
  <mesh position={[0,0,.725]}><torusGeometry args={[.29,.023,6,low?32:64]}/><meshBasicMaterial color="#a8e8cb" toneMapped={false}/></mesh>
  <group ref={inner} rotation={[.72,.4,.3]}>
   <mesh><torusGeometry args={[1.14,.095,low?8:12,segments]}/><meshStandardMaterial color="#364c45" metalness={.9} roughness={.28}/></mesh>
   <mesh><torusGeometry args={[1.14,.014,6,segments]}/><meshBasicMaterial color="#d5f5df" toneMapped={false}/></mesh>
   {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return <mesh key={i} position={[Math.cos(a)*1.14,Math.sin(a)*1.14,0]} rotation={[0,0,a]}><boxGeometry args={[.15,.24,.15]}/><meshStandardMaterial color={i%2?'#b5aa87':'#647d70'} metalness={.85} roughness={.25}/></mesh>})}
  </group>
  <group rotation={[.83,-.48,-.55]}>
   <mesh><torusGeometry args={[1.88,.055,low?8:12,segments]}/><meshStandardMaterial color="#7b8d7c" metalness={.91} roughness={.22}/></mesh>
   <mesh position={[0,0,.018]}><torusGeometry args={[1.88,.009,5,segments]}/><meshBasicMaterial color="#e5d7ae" toneMapped={false}/></mesh>
   {Array.from({length:low?8:12},(_,i)=>{const count=low?8:12,a=i*Math.PI*2/count;return <group key={i} position={[Math.cos(a)*1.88,Math.sin(a)*1.88,0]} rotation={[0,0,a]}><mesh><boxGeometry args={[.18,.3,.13]}/><meshStandardMaterial color="#6b7163" metalness={.9} roughness={.3}/></mesh><mesh position={[0,0,.073]}><boxGeometry args={[.035,.17,.009]}/><meshBasicMaterial color={i%3===0?'#e8d5a9':'#b9d4bf'} toneMapped={false}/></mesh></group>})}
  </group>
  <group ref={outer} rotation={[-.68,.8,.48]}>
   <mesh><torusGeometry args={[2.12,.022,6,segments]}/><meshStandardMaterial color="#8b9d8a" metalness={.83} roughness={.3}/></mesh>
   {[0,Math.PI].map((a,i)=><mesh key={i} position={[Math.cos(a)*2.12,Math.sin(a)*2.12,0]}><sphereGeometry args={[.045,10,8]}/><meshBasicMaterial color="#e8f5cf" toneMapped={false}/></mesh>)}
  </group>
  <mesh position={[0,-2.08,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.2,1.22,segments]}/><meshBasicMaterial color="#8faf99" transparent opacity={.35}/></mesh>
  <mesh position={[0,-2.12,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.35,2.36,segments]}/><meshBasicMaterial color="#6f9980" transparent opacity={.15}/></mesh>
 </group>;
}

function LiquidForm({low,active,pointer}:Pick<SceneProps,'low'|'active'|'pointer'>){
 const object=useRef<Mesh>(null);
 useFrame(({clock},delta)=>{
  if(!active||!object.current)return;
  const t=clock.elapsedTime,dt=Math.min(delta,.05);
  object.current.rotation.y=MathUtils.damp(object.current.rotation.y,t*.1+pointer.current.x*.12,2,dt);
  object.current.rotation.x=MathUtils.damp(object.current.rotation.x,.35+pointer.current.y*.1,3,dt);
  object.current.position.y=Math.sin(t*.4)*.06;
 });
 return <group rotation={[.1,0,-.3]}><mesh ref={object}><torusKnotGeometry args={[1.12,.42,low?96:160,low?12:24,2,3]}/><MeshDistortMaterial color="#9ab5aa" metalness={.93} roughness={.17} distort={.17} speed={active ? .65 : 0}/></mesh><mesh rotation={[Math.PI/2,0,.6]}><torusGeometry args={[2.06,.012,6,low?64:112]}/><meshBasicMaterial color="#d1d8bc" transparent opacity={.5}/></mesh></group>;
}

function PortalForm({low,active,pointer}:Pick<SceneProps,'low'|'active'|'pointer'>){
 const assembly=useRef<Group>(null);
 useFrame(({clock},delta)=>{
  if(!active||!assembly.current)return;
  const dt=Math.min(delta,.05);
  assembly.current.rotation.y=MathUtils.damp(assembly.current.rotation.y,-.18+pointer.current.x*.16,3,dt);
  assembly.current.rotation.x=MathUtils.damp(assembly.current.rotation.x,.06+pointer.current.y*.08,3,dt);
  assembly.current.rotation.z=Math.sin(clock.elapsedTime*.14)*.025;
 });
 return <group ref={assembly} rotation={[.06,-.18,0]}>
  {Array.from({length:low?4:6},(_,i)=><group key={i} position={[0,0,-i*.65]} rotation={[0,0,i*.12]}>
   {[[-1.7,0,.075,3.9],[1.7,0,.075,3.9],[0,1.95,3.48,.075],[0,-1.95,3.48,.075]].map(([x,y,w,h],j)=><mesh key={j} position={[x,y,0]}><boxGeometry args={[w,h,.12]}/><meshStandardMaterial color={i%2?'#6d7f72':'#c4cab2'} metalness={.75} roughness={.23}/></mesh>)}
   {[[-1.7,-1.95],[-1.7,1.95],[1.7,-1.95],[1.7,1.95]].map(([x,y],j)=><mesh key={j} position={[x,y,.08]}><sphereGeometry args={[.055,10,8]}/><meshBasicMaterial color="#bcf6da" toneMapped={false}/></mesh>)}
  </group>)}
  <mesh position={[0,0,-3.6]}><circleGeometry args={[.8,48]}/><meshBasicMaterial color="#1e5149"/></mesh>
  <mesh position={[0,0,-3.55]}><torusGeometry args={[.82,.018,6,64]}/><meshBasicMaterial color="#b0e8d1" toneMapped={false}/></mesh>
 </group>;
}

export function FluxCoreScene({mode,low,active,pointer,onReady,onFail}:SceneProps){
 return <Canvas camera={{position:[0,.15,7.6],fov:37,near:.1,far:40}} dpr={low?1:[1,1.5]} frameloop={active?'always':'demand'} gl={{alpha:true,antialias:!low,powerPreference:'low-power'}} fallback={<span/>}>
  <SceneLifecycle onReady={onReady} onFail={onFail}/>
  <ambientLight intensity={.7}/><hemisphereLight args={['#dcefe1','#0a1715',1.2]}/>
  <directionalLight position={[3,4,5]} intensity={3.4} color="#f2e9d1"/>
  <directionalLight position={[-4,1,2]} intensity={2.3} color="#a6e9d4"/>
  <pointLight position={[0,0,2]} intensity={8} color="#b4f3d6" distance={7}/>
  {mode==='Core'?<EnergyCore low={low} active={active} pointer={pointer}/>:mode==='Liquid Flux'?<LiquidForm low={low} active={active} pointer={pointer}/>:<PortalForm low={low} active={active} pointer={pointer}/>}
 </Canvas>;
}
