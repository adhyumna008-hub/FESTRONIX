import * as THREE from 'three';
import {GLTFLoader,type GLTFParser} from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Own embedded-image decode instead of GLTFLoader's success-only blob URL cleanup. */
export function worldAssetLoader(signal:AbortSignal){
  const textures=new Set<THREE.Texture>(),images=new Set<ImageBitmap>();
  const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
  const released=new WeakSet<object>();
  const imageSources=new Map<number,Promise<ImageBitmap|HTMLImageElement>>();
  const textureSources=new Map<number,THREE.Source>();
  const cancelDecodes=new Set<()=>void>();let disposed=false;
  const alive=()=>{if(disposed||signal.aborted)throw new DOMException('Asset canceled','AbortError');};
  const release=(resource:THREE.Texture|THREE.BufferGeometry|THREE.Material)=>{if(!released.has(resource)){released.add(resource);resource.dispose();}};
  const close=(image:ImageBitmap)=>{if(!released.has(image)){released.add(image);image.close();}};
  const ownTexture=(texture:THREE.Texture)=>{if(disposed||signal.aborted)release(texture);else textures.add(texture);};
  const ownMaterial=(material:THREE.Material)=>{
    Object.values(material).forEach(value=>{if(value instanceof THREE.Texture)ownTexture(value);});
    if(disposed||signal.aborted)release(material);else materials.add(material);
  };
  const ownGeometry=(geometry:THREE.BufferGeometry)=>{if(disposed||signal.aborted)release(geometry);else geometries.add(geometry);};
  const own=(value:unknown)=>{
    if(value instanceof THREE.Texture)ownTexture(value);
    else if(value instanceof THREE.Material)ownMaterial(value);
    else if(value instanceof THREE.BufferGeometry)ownGeometry(value);
    else if(value instanceof THREE.Object3D)value.traverse(node=>{
      if(node instanceof THREE.Mesh){ownGeometry(node.geometry);(Array.isArray(node.material)?node.material:[node.material]).forEach(ownMaterial);}
    });
    else if(Array.isArray(value))value.forEach(own);
  };
  const dispose=()=>{
    if(disposed)return;disposed=true;signal.removeEventListener('abort',dispose);
    cancelDecodes.forEach(cancel=>cancel());cancelDecodes.clear();
    textures.forEach(release);textures.clear();materials.forEach(release);materials.clear();geometries.forEach(release);geometries.clear();
    images.forEach(close);images.clear();imageSources.clear();textureSources.clear();
  };
  signal.addEventListener('abort',dispose,{once:true});if(signal.aborted)dispose();
  async function decode(blob:Blob):Promise<ImageBitmap|HTMLImageElement>{
    alive();
    if(typeof createImageBitmap==='function'){
      const image=await createImageBitmap(blob,{premultiplyAlpha:'none',colorSpaceConversion:'none'});
      if(disposed||signal.aborted){close(image);throw new DOMException('Asset canceled','AbortError');}images.add(image);return image;
    }
    const url=URL.createObjectURL(blob);
    try{return await new Promise<HTMLImageElement>((resolve,reject)=>{
      const image=new Image();let settled=false;
      const detach=()=>{signal.removeEventListener('abort',abort);cancelDecodes.delete(abort);image.onload=null;image.onerror=null;};
      const abort=()=>{if(settled)return;settled=true;detach();image.src='';reject(new DOMException('Asset canceled','AbortError'));};
      signal.addEventListener('abort',abort,{once:true});cancelDecodes.add(abort);
      image.onload=()=>{if(settled)return;settled=true;detach();try{alive();resolve(image);}catch(error){image.src='';reject(error);}};
      image.onerror=()=>{if(settled)return;settled=true;detach();reject(new Error('Embedded image failed'));};
      if(disposed||signal.aborted)abort();else image.src=url;
    });}
    finally{URL.revokeObjectURL(url);}
  }
  const filter:Record<number,THREE.MagnificationTextureFilter|THREE.MinificationTextureFilter>={9728:THREE.NearestFilter,9729:THREE.LinearFilter,9984:THREE.NearestMipmapNearestFilter,9985:THREE.LinearMipmapNearestFilter,9986:THREE.NearestMipmapLinearFilter,9987:THREE.LinearMipmapLinearFilter};
  const wrapping:Record<number,THREE.Wrapping>={33071:THREE.ClampToEdgeWrapping,33648:THREE.MirroredRepeatWrapping,10497:THREE.RepeatWrapping};
  const loader=new GLTFLoader();
  loader.register((parser:GLTFParser)=>{
    // GLTFParser may create UV-transform texture clones and final material
    // variants before a complete scene is available. Track their dependency
    // results so a failed/aborted parse cannot strand those late resources.
    const dependency=parser.getDependency.bind(parser);
    parser.getDependency=(type,index)=>{alive();return dependency(type,index).then(value=>{own(value);alive();return value;});};
    const assign=parser.assignTexture.bind(parser);
    parser.assignTexture=(...args)=>assign(...args).then(texture=>{if(texture)ownTexture(texture);alive();return texture;});
    const geometry=parser.loadGeometries.bind(parser);
    parser.loadGeometries=(...args)=>geometry(...args).then(values=>{values.forEach(ownGeometry);alive();return values;});
    const finalMaterial=parser.assignFinalMaterial.bind(parser);
    parser.assignFinalMaterial=object=>{finalMaterial(object);own(object);alive();};
    return {name:'EXT_texture_webp',loadTexture:async(index:number)=>{
      alive();const definition=parser.json.textures[index];const sourceIndex=definition.extensions?.EXT_texture_webp?.source??definition.source;const source=parser.json.images[sourceIndex];
      if(source.bufferView===undefined)throw new Error('World models must embed their textures');
      let sourcePromise=imageSources.get(sourceIndex);
      if(!sourcePromise){sourcePromise=parser.getDependency('bufferView',source.bufferView).then(bytes=>{alive();return decode(new Blob([bytes],{type:source.mimeType}));});imageSources.set(sourceIndex,sourcePromise);}
      const image=await sourcePromise;alive();
      // Keep separate Texture objects/associations for glTF definitions and UV
      // transforms, while sharing their Source. Installed Three r180 deduplicates
      // GPU uploads by Source + sampler/color-space parameters and refcounts each
      // texture view. Thus identical image/sampler definitions reuse GPU storage.
      let textureSource=textureSources.get(sourceIndex);
      if(!textureSource){textureSource=new THREE.Source(image);textureSources.set(sourceIndex,textureSource);}
      const texture=new THREE.Texture();texture.source=textureSource;ownTexture(texture);texture.flipY=false;texture.name=definition.name||source.name||`world_texture_${index}`;
      const sampler=parser.json.samplers?.[definition.sampler]||{};
      texture.magFilter=(filter[sampler.magFilter]??THREE.LinearFilter) as THREE.MagnificationTextureFilter;
      texture.minFilter=(filter[sampler.minFilter]??THREE.LinearMipmapLinearFilter) as THREE.MinificationTextureFilter;
      texture.wrapS=wrapping[sampler.wrapS]??THREE.RepeatWrapping;texture.wrapT=wrapping[sampler.wrapT]??THREE.RepeatWrapping;
      texture.generateMipmaps=texture.minFilter!==THREE.NearestFilter&&texture.minFilter!==THREE.LinearFilter;
      texture.needsUpdate=true;parser.associations.set(texture,{textures:index});return texture;
    }};
  });
  return {loader,dispose};
}
