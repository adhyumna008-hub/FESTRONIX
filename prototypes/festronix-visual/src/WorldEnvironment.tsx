import {useEffect, useLayoutEffect, useMemo, useRef, type RefObject} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';

/** The camera/experience director owns the clock; this environment only samples it. */
export type WorldEnvironmentFrame = {progress:number; active:boolean; time:number};
export type WorldEnvironmentProps = {
  quality:'FULL'|'REDUCED';
  frame:RefObject<WorldEnvironmentFrame>;
};

type Placement = {p:[number,number,number]; s:[number,number,number]; q?:THREE.Quaternion};
type Architecture = {
  steel:Placement[]; alloy:Placement[]; copper:Placement[]; panels:Placement[];
  pads:Placement[]; bolts:Placement[]; light:Placement[]; copperLight:Placement[];
  stage:Placement[]; traces:THREE.BufferGeometry;
};
const FLOOR=-1.7;
const UP=new THREE.Vector3(0,1,0);
const X_AXIS=new THREE.Vector3(1,0,0);
const ZONES=[
  {x:3,z:-3,width:4.55,depth:5.5},
  {x:-3,z:-27,width:4.5,depth:5.4},
  {x:3,z:-49,width:4.45,depth:5.4},
  {x:-3,z:-71,width:4.55,depth:5.5},
  {x:3,z:-94,width:4.45,depth:5.4},
];
const box=(x:number,y:number,z:number,w:number,h:number,d:number,q?:THREE.Quaternion):Placement=>({p:[x,y,z],s:[w,h,d],q});

function beam(a:[number,number,number],b:[number,number,number],thickness:number,depth=thickness):Placement {
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);
  return {p:start.add(end).multiplyScalar(.5).toArray() as [number,number,number],s:[delta.length(),thickness,depth],q:new THREE.Quaternion().setFromUnitVectors(X_AXIS,delta.normalize())};
}
function pipe(a:[number,number,number],b:[number,number,number],radius:number):Placement {
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);
  return {p:start.add(end).multiplyScalar(.5).toArray() as [number,number,number],s:[radius,delta.length(),radius],q:new THREE.Quaternion().setFromUnitVectors(UP,delta.normalize())};
}

/** One draw per material, with reusable physical geometry and no per-frame matrix writes. */
function Batch({geometry,material,placements,receiveShadow=false}:{geometry:THREE.BufferGeometry;material:THREE.Material;placements:Placement[];receiveShadow?:boolean}) {
  const mesh=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{
    const instance=mesh.current;if(!instance)return;
    const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),scale=new THREE.Vector3(),rotation=new THREE.Quaternion();
    placements.forEach((item,index)=>{
      position.fromArray(item.p);scale.fromArray(item.s);rotation.copy(item.q??new THREE.Quaternion());
      instance.setMatrixAt(index,matrix.compose(position,rotation,scale));
    });
    instance.instanceMatrix.needsUpdate=true;
    instance.computeBoundingBox();instance.computeBoundingSphere();
  },[placements]);
  return <instancedMesh ref={mesh} args={[geometry,material,placements.length]} receiveShadow={receiveShadow} dispose={null}/>;
}

function buildArchitecture(full:boolean):Architecture {
  const steel:Placement[]=[],alloy:Placement[]=[],copper:Placement[]=[],panels:Placement[]=[],pads:Placement[]=[],bolts:Placement[]=[],light:Placement[]=[],copperLight:Placement[]=[],stage:Placement[]=[];
  const traces:number[]=[];
  const line=(a:number[],b:number[])=>traces.push(...a,...b);
  // A quiet gallery envelope, with widely spaced bays and flush skirting.
  for(const side of [-1,1]){
    panels.push(box(side*7.72,2.45,-66,.24,8.3,166));
    steel.push(box(side*7.49,FLOOR+.12,-66,.05,.24,166));
    line([side*7.41,FLOOR+.037,15],[side*7.41,FLOOR+.037,-145]);
  }
  for(let z=13;z>-149;z-=full?22:32){
    for(const side of [-1,1]){
      copper.push(pipe([side*7.4,FLOOR,z],[side*7.4,6.3,z],.13));
      if(full)alloy.push(box(side*7.57,2.38,z,.055,7.7,.035));
    }
    steel.push(box(0,6.43,z,15.1,.14,.19));
  }
  for(const zone of ZONES){
    const {x,z,width,depth}=zone;
    // Exact plinth top: y=-.80; sculpted edge geometry gives it a finished product surface.
    pads.push(box(x,-1.25,z,width,.9,depth));
    alloy.push(box(x,-.806,z,width-.28,.016,depth-.28));
    steel.push(box(x,5.96,z,2.9,.12,.32));
    light.push(box(x,5.89,z,2.4,.025,.19));
    if(full){
      for(const offset of [-1.25,1.25]){
        copper.push(pipe([x+offset,5.74,z-.6],[x+offset,5.95,z-.6],.12));
        light.push(box(x+offset,5.735,z-.6,.16,.012,.16));
      }
    }
    const wall=Math.sign(x)*7.56;
    panels.push(box(wall-Math.sign(x)*.055,1.65,z,.08,5.8,8.6));
    copperLight.push(box(wall-Math.sign(x)*.1,4.6,z,.018,.035,4.9));
    // A concealed low edge light stays behind the showcase, away from the reading lane.
    copperLight.push(box(x,-1.68,z-depth/2-.08,width-.65,.016,.04));
  }
  // One generous arch marks actual forward passage into the final exhibition room.
  light.push(box(0,5.54,-110.52,5.2,.018,.025));
  copperLight.push(box(-4.42,1.2,-110.53,.025,5.35,.025),box(4.42,1.2,-110.53,.025,5.35,.025));
  pads.push(box(0,-1.25,-129,7.4,.9,7.2));
  alloy.push(box(0,-.806,-129,7.12,.016,6.92));
  stage.push(box(0,2.38,-138,15.1,8.15,.28));
  // A small signature detail on the far wall, subordinate to the real objects.
  for(const side of [-1,1])steel.push(beam([side*1.35,2.7,-137.8],[-side*1.35,5.4,-137.8],.13,.07));
  steel.push(box(0,5.96,-129,4.4,.12,.32));
  light.push(box(0,5.89,-129,3.9,.025,.19));

  return {steel,alloy,copper,panels,pads,bolts,light,copperLight,stage,traces:new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(traces,3))};
}

function galleryGateway(full:boolean) {
  const shape=new THREE.Shape();
  shape.moveTo(-5.35,FLOOR);shape.lineTo(-5.35,4.45);shape.quadraticCurveTo(-5.35,6.35,-3.45,6.35);
  shape.lineTo(3.45,6.35);shape.quadraticCurveTo(5.35,6.35,5.35,4.45);shape.lineTo(5.35,FLOOR);
  shape.lineTo(4.4,FLOOR);shape.lineTo(4.4,4.10);shape.quadraticCurveTo(4.4,5.52,2.98,5.52);
  shape.lineTo(-2.98,5.52);shape.quadraticCurveTo(-4.4,5.52,-4.4,4.1);shape.lineTo(-4.4,FLOOR);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.46,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:full?3:1,curveSegments:full?14:7,steps:1});
  geometry.translate(0,0,-.23);return geometry;
}

function roundedPlinth(full:boolean) {
  const shape=new THREE.Shape(),r=.055,h=.5;
  shape.moveTo(-h+r,-h);shape.lineTo(h-r,-h);shape.quadraticCurveTo(h,-h,h,-h+r);
  shape.lineTo(h,h-r);shape.quadraticCurveTo(h,h,h-r,h);shape.lineTo(-h+r,h);
  shape.quadraticCurveTo(-h,h,-h,h-r);shape.lineTo(-h,-h+r);shape.quadraticCurveTo(-h,-h,-h+r,-h);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:full?2:1,curveSegments:full?6:3,steps:1});
  geometry.rotateX(Math.PI/2);geometry.computeBoundingBox();
  const bounds=geometry.boundingBox!,size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  geometry.translate(-center.x,-center.y,-center.z);geometry.scale(1/size.x,1/size.y,1/size.z);return geometry;
}

function brushedFloorTexture() {
  const size=128,pixels=new Uint8Array(size*size*4);
  let seed=1729;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    seed=(seed*1664525+1013904223)>>>0;
    const i=(y*size+x)*4;
    const groove=x===0||y===0?-.13:0;
    const value=Math.round(178+(seed>>>28)-8+Math.sin(y*.58)*5+groove*100);
    pixels[i]=pixels[i+1]=pixels[i+2]=value;pixels[i+3]=255;
  }
  const texture=new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);
  texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(6,58);texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps=true;texture.needsUpdate=true;
  return texture;
}

export function WorldEnvironment({frame,quality}:WorldEnvironmentProps) {
  const full=quality==='FULL';
  const {scene,invalidate}=useThree();
  useLayoutEffect(()=>{
    const previous=scene.fog,fog=new THREE.Fog('#090c12',19,full?82:66);
    scene.fog=fog;invalidate();
    return ()=>{if(scene.fog===fog)scene.fog=previous;};
  },[scene,invalidate,full]);
  const architecture=useMemo(()=>buildArchitecture(full),[full]);
  const resources=useMemo(()=>{
    const texture=brushedFloorTexture();texture.anisotropy=full?4:2;
    const boxGeometry=new THREE.BoxGeometry(1,1,1);
    const pipeGeometry=new THREE.CylinderGeometry(1,1,1,full?20:10);
    const plinthGeometry=roundedPlinth(full),gatewayGeometry=galleryGateway(full);
    const standard=(color:string,metalness:number,roughness:number)=>new THREE.MeshStandardMaterial({color,metalness,roughness,envMapIntensity:.85});
    const steel=standard('#111419',.28,.48),alloy=standard('#11191f',.18,.6),copper=standard('#101216',.34,.46),panels=standard('#111821',.04,.86),pads=standard('#0b1319',.1,.5),stage=standard('#10151b',.06,.8);
    const floor=standard('#090b0e',.04,.88);floor.map=texture;floor.envMapIntensity=.15;alloy.envMapIntensity=.35;
    const center=standard('#080d12',.04,.87);center.envMapIntensity=.15;
    const light=new THREE.MeshStandardMaterial({color:'#e6e1d6',emissive:'#cbc0a8',emissiveIntensity:.55,metalness:.05,roughness:.5});
    const copperLight=new THREE.MeshStandardMaterial({color:'#bab6ac',emissive:'#aba48f',emissiveIntensity:.3,metalness:.04,roughness:.56});
    const trace=new THREE.LineBasicMaterial({color:'#666867',transparent:true,opacity:.1});
    const motes=new THREE.PointsMaterial({color:'#c1c7ce',size:full?.018:.022,transparent:true,opacity:.10,depthWrite:false,sizeAttenuation:true});
    const signal=new THREE.PointsMaterial({color:'#e3d9c6',size:.065,transparent:true,opacity:.2,depthWrite:false,sizeAttenuation:true});
    return {texture,boxGeometry,pipeGeometry,plinthGeometry,gatewayGeometry,steel,alloy,copper,panels,pads,stage,floor,center,light,copperLight,trace,motes,signal};
  },[full]);
  const atmosphere=useMemo(()=>{
    const count=full?72:24,positions=new Float32Array(count*3),base=new Float32Array(count*3);
    let seed=77477;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<count;i++){
      base[i*3]=(random()-.5)*15;base[i*3+1]=-.5+random()*6.4;base[i*3+2]=12-random()*157;
    }
    positions.set(base);
    return {base,geometry:new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(positions,3)),count};
  },[full]);
  const signalGeometry=useMemo(()=>{
    const geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array((full?8:4)*3),3));
    // Signals move within this known world-space corridor, without rebuilding culling bounds.
    geometry.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,FLOOR,-64),82);
    return geometry;
  },[full]);
  useEffect(()=>()=>{
    architecture.traces.dispose();atmosphere.geometry.dispose();signalGeometry.dispose();
  },[architecture,atmosphere,signalGeometry]);
  useEffect(()=>()=>{
    resources.texture.dispose();resources.boxGeometry.dispose();resources.pipeGeometry.dispose();resources.plinthGeometry.dispose();resources.gatewayGeometry.dispose();
    resources.steel.dispose();resources.alloy.dispose();resources.copper.dispose();resources.panels.dispose();resources.pads.dispose();resources.stage.dispose();resources.floor.dispose();resources.center.dispose();resources.light.dispose();resources.copperLight.dispose();resources.trace.dispose();resources.motes.dispose();resources.signal.dispose();
  },[resources]);

  useFrame(()=>{
    const f=frame.current;if(!f)return;
    const progress=Math.max(0,Math.min(1,f.progress)),wake=THREE.MathUtils.smoothstep(progress,.015,.13);
    resources.light.emissiveIntensity=.13+wake*.49;
    resources.copperLight.emissiveIntensity=.055+wake*.23;
    resources.trace.opacity=.04+wake*.06;
    if(!f.active)return;
    const time=Number.isFinite(f.time)?f.time:0;
    const positions=atmosphere.geometry.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<atmosphere.count;i++){
      const j=i*3;
      positions.setXYZ(i,atmosphere.base[j]+Math.sin(time*.12+i*.61)*.07,atmosphere.base[j+1]+Math.sin(time*.19+i*.73)*.13,atmosphere.base[j+2]+Math.cos(time*.08+i*.21)*.08);
    }
    positions.needsUpdate=true;
    const signals=signalGeometry.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<signals.count;i++){
      const route=(i*.61803398875+time*.009+progress*.12)%1;
      signals.setXYZ(i,i%2?-7.41:7.41,FLOOR+.055,14-route*156);
    }
    signals.needsUpdate=true;
    resources.motes.opacity=.055+wake*.045;
    resources.signal.opacity=.08+wake*.13;
  });

  return <group dispose={null}>
    <mesh geometry={resources.boxGeometry} material={resources.floor} position={[0,FLOOR-.11,-66]} scale={[15.5,.22,166]} receiveShadow={full} dispose={null}/>
    <mesh geometry={resources.boxGeometry} material={resources.center} position={[0,FLOOR+.006,-66]} scale={[3.9,.012,166]} receiveShadow={full} dispose={null}/>
    <Batch geometry={resources.boxGeometry} material={resources.steel} placements={architecture.steel} receiveShadow={full}/>
    <Batch geometry={resources.boxGeometry} material={resources.alloy} placements={architecture.alloy} receiveShadow={full}/>
    <Batch geometry={resources.pipeGeometry} material={resources.copper} placements={architecture.copper}/>
    <Batch geometry={resources.boxGeometry} material={resources.panels} placements={architecture.panels} receiveShadow={full}/>
    <Batch geometry={resources.plinthGeometry} material={resources.pads} placements={architecture.pads} receiveShadow={full}/>
    <Batch geometry={resources.boxGeometry} material={resources.light} placements={architecture.light}/>
    <Batch geometry={resources.boxGeometry} material={resources.copperLight} placements={architecture.copperLight}/>
    <Batch geometry={resources.boxGeometry} material={resources.stage} placements={architecture.stage} receiveShadow={full}/>
    <mesh geometry={resources.gatewayGeometry} material={resources.alloy} position={[0,0,-111]} receiveShadow={full} dispose={null}/>
    <lineSegments geometry={architecture.traces} material={resources.trace} dispose={null}/>
    <points geometry={atmosphere.geometry} material={resources.motes} dispose={null}/>
    <points geometry={signalGeometry} material={resources.signal} dispose={null}/>
  </group>;
}

export default WorldEnvironment;
