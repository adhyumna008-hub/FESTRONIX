import {useEffect,useRef,useState,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {worldAssetLoader} from './WorldAssetLoader';
import {developerDisplay} from './ClubDisplayTexture';
import {machines,type MachineId,type WorldFrame} from './WorldExperience';

export function disposeWorldAsset(object:THREE.Object3D) {
  const geometry=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
  object.traverse(node=>{if(node instanceof THREE.Mesh){geometry.add(node.geometry);(Array.isArray(node.material)?node.material:[node.material]).forEach(m=>materials.add(m));}});
  materials.forEach(m=>Object.values(m).forEach(v=>{if(v instanceof THREE.Texture)textures.add(v);}));
  textures.forEach(t=>{t.dispose();const data=t.source.data;if(typeof ImageBitmap!=='undefined'&&data instanceof ImageBitmap)data.close();});
  materials.forEach(m=>m.dispose());geometry.forEach(g=>g.dispose());
}
type Props={id:MachineId;url:string;frame:RefObject<WorldFrame>;position:[number,number,number];size:number;ground?:number;rotation?:[number,number,number];quality:'FULL'|'REDUCED';onLoad:(id:MachineId)=>void;onProgress:(id:MachineId,loaded:number,total:number)=>void;onError:(id:MachineId)=>void;onEngage:(id:MachineId)=>void;onHover:(id:MachineId|null)=>void};
export function WorldModel({id,url,frame,position,size,ground=-.798,rotation=[0,0,0],quality,onLoad,onProgress,onError,onEngage,onHover}:Props) {
  const [object,setObject]=useState<THREE.Group|null>(null);
  const root=useRef<THREE.Group>(null);
  const materialValues=useRef<{material:THREE.MeshStandardMaterial;intensity:number}[]>([]);
  useEffect(()=>{
    setObject(null);
    const controller=new AbortController();let owned:THREE.Group|null=null;let cancelled=false;
    const assetLoader=worldAssetLoader(controller.signal);
    const load=async()=>{
      const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('Model unavailable');
      // Fetch may transparently decompress an encoded response; its body bytes
      // cannot be compared with the compressed Content-Length in that case.
      const total=response.headers.get('content-encoding')?0:Number(response.headers.get('content-length')||0);let bytes:ArrayBuffer;
      if(response.body){const reader=response.body.getReader();const chunks:Uint8Array[]=[];let received=0;while(true){const result=await reader.read();if(result.done)break;chunks.push(result.value);received+=result.value.byteLength;onProgress(id,received,total);}const combined=new Uint8Array(received);let offset=0;chunks.forEach(chunk=>{combined.set(chunk,offset);offset+=chunk.length;});bytes=combined.buffer;}
      else bytes=await response.arrayBuffer();
      if(cancelled)return;
      const magic=new Uint8Array(bytes,0,Math.min(2,bytes.byteLength));
      if(magic[0]===31&&magic[1]===139)bytes=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
      if(cancelled)return;
      const gltf=await assetLoader.loader.parseAsync(bytes,url.slice(0,url.lastIndexOf('/')+1));owned=gltf.scene;
      if(cancelled){disposeWorldAsset(owned);owned=null;return;}
      owned.rotation.set(...rotation);owned.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(owned),center=bounds.getCenter(new THREE.Vector3()),dimensions=bounds.getSize(new THREE.Vector3());
      const scale=size/Math.max(dimensions.x,dimensions.y,dimensions.z);owned.scale.multiplyScalar(scale);owned.position.set(-center.x*scale,ground-bounds.min.y*scale,-center.z*scale);
      const mats=new Set<THREE.MeshStandardMaterial>();
      owned.traverse(node=>{if(node instanceof THREE.Mesh){node.castShadow=quality==='FULL';node.receiveShadow=quality==='FULL';(Array.isArray(node.material)?node.material:[node.material]).forEach(m=>{if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.8;if(id==='sdc'&&m.name==='classic_laptop_screen'){const display=developerDisplay(node.geometry);m.map=display;m.color.set('#ffffff');m.emissiveMap=display;m.emissive.set('#ffffff');m.emissiveIntensity=.24;m.roughness=.48;m.needsUpdate=true;}mats.add(m);const values=Object.values(m);values.forEach(v=>{if(v instanceof THREE.Texture)v.anisotropy=quality==='FULL'?4:2;});}});}});
      materialValues.current=Array.from(mats,m=>({material:m,intensity:m.envMapIntensity}));setObject(owned);
    };
    load().catch(()=>{assetLoader.dispose();if(owned){disposeWorldAsset(owned);owned=null;}if(!cancelled)onError(id);});
    return()=>{cancelled=true;controller.abort();assetLoader.dispose();materialValues.current=[];if(owned){disposeWorldAsset(owned);owned=null;}};
  },[url,id,quality,size,ground,rotation[0],rotation[1],rotation[2]]);
  useEffect(()=>{if(object)onLoad(id);},[object,onLoad,id]);
  useFrame(()=>{
    const f=frame.current;if(!root.current||!object)return;
    const selected=!f.blocked&&(f.hovered===id||f.engaged===id);
    root.current.rotation.y=selected?f.pointerX*.035:0;
    root.current.rotation.z=selected?f.pointerY*.015:0;
    materialValues.current.forEach(({material,intensity})=>material.envMapIntensity=intensity+(selected?.28:0));
  });
  if(!object)return null;
  return <group ref={root} position={position} onPointerOver={event=>{if(frame.current.blocked)return;event.stopPropagation();onHover(id);}} onPointerOut={()=>onHover(null)} onClick={event=>{if(frame.current.blocked)return;event.stopPropagation();onEngage(id);}}><primitive object={object} dispose={null} userData={{machine:id,label:machines[id].title}}/></group>;
}
