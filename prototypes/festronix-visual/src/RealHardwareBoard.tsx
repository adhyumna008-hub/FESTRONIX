import {useEffect, useRef, useState, type RefObject} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {smooth, type FrameRecord, type Quality, type Viewport} from './experience';

export interface RealHardwareBoardProps {
  frame: RefObject<FrameRecord>;
  quality: Quality;
  viewport: Viewport;
  onReadyAsset: () => void;
  onFail: (error?: unknown) => void;
}

const ASSET_ROOT = '/models/circuit-board/';
type DecodedImage = ImageBitmap | HTMLImageElement;
type GPUResource = THREE.BufferGeometry | THREE.Material | THREE.Texture;
type GLTFDocument = {
  images?: {uri?: string; bufferView?: number; mimeType?: string}[];
  bufferViews?: {buffer?: number; byteOffset?: number; byteLength: number}[];
  textures?: {source?: number; sampler?: number; name?: string; extensions?: {EXT_texture_webp?: {source: number}}}[];
  samplers?: {magFilter?: number; minFilter?: number; wrapS?: number; wrapT?: number}[];
};
type Part = {object: THREE.Object3D; position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3; offset: THREE.Vector3; start: number; end: number};
type BoardAsset = {scene: THREE.Group; center: THREE.Vector3; parts: Part[]; rotor: {object: THREE.Object3D; quaternion: THREE.Quaternion; turn: THREE.Quaternion} | null};
const ROTOR_AXIS = new THREE.Vector3(0, 1, 0);

// These resources belong to this mount, never to a global loader cache. A decoder
// or GLTF parse may finish after abort; late resources are immediately released.
class AssetOwner {
  private resources = new Set<GPUResource>();
  private released = new WeakSet<GPUResource>();
  private images = new Set<DecodedImage>();
  private closedImages = new WeakSet<DecodedImage>();
  environment: THREE.WebGLRenderTarget | null = null;
  disposed = false;

  track<T extends GPUResource>(resource: T): T {
    if (this.disposed) this.release(resource);
    else this.resources.add(resource);
    return resource;
  }
  trackImage(image: DecodedImage) {
    if (this.disposed) this.closeImage(image);
    else this.images.add(image);
  }
  material(material: THREE.Material) {
    if (!this.resources.has(material)) {
      Object.values(material).forEach(value => {if (value instanceof THREE.Texture) this.track(value);});
      this.track(material);
    }
  }
  object(root: THREE.Object3D) {
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      this.track(object.geometry);
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => this.material(material));
    });
  }
  private release(resource: GPUResource) {
    if (this.released.has(resource)) return;
    this.released.add(resource); resource.dispose();
  }
  private closeImage(image: DecodedImage) {
    if (this.closedImages.has(image)) return;
    this.closedImages.add(image);
    if ('close' in image) image.close();
    else image.src = '';
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.resources.forEach(resource => this.release(resource)); this.resources.clear();
    this.environment?.dispose(); this.environment = null;
    this.images.forEach(image => this.closeImage(image)); this.images.clear();
  }
}

function abortError() {return new DOMException('Board asset request cancelled', 'AbortError');}
function checkActive(signal: AbortSignal) {if (signal.aborted) throw abortError();}

async function fetchBytes(url: string, signal: AbortSignal) {
  const response = await fetch(url, {signal});
  if (!response.ok) throw new Error(`Board asset unavailable (${response.status})`);
  const bytes = await response.arrayBuffer(); checkActive(signal);
  return bytes;
}

async function fetchModel(quality: Quality, signal: AbortSignal) {
  let bytes = await fetchBytes(`${ASSET_ROOT}board-${quality === 'FULL' ? 'full' : 'reduced'}.glb.gz`, signal);
  const header = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 2));
  // Preview hosts differ in whether .gz is automatically decompressed.
  if (header[0] === 0x1f && header[1] === 0x8b) {
    if (typeof DecompressionStream === 'undefined') throw new Error('Compressed board rendering unavailable');
    bytes = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  }
  checkActive(signal);
  return bytes;
}

function inspectGLB(bytes: ArrayBuffer) {
  if (bytes.byteLength < 20) throw new Error('Board model is incomplete');
  const view = new DataView(bytes);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) throw new Error('Unsupported board model');
  let json: GLTFDocument | undefined, binary: ArrayBuffer | undefined;
  for (let offset = 12; offset + 8 <= bytes.byteLength;) {
    const size = view.getUint32(offset, true), type = view.getUint32(offset + 4, true), start = offset + 8;
    if (start + size > bytes.byteLength) throw new Error('Board model chunk is incomplete');
    if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(bytes.slice(start, start + size)).replace(/\0+$/, '')) as GLTFDocument;
    else if (type === 0x004e4942) binary = bytes.slice(start, start + size);
    offset = start + size;
  }
  if (!json) throw new Error('Board model metadata is missing');
  return {json, binary};
}

async function decodeImage(blob: Blob, signal: AbortSignal): Promise<DecodedImage> {
  checkActive(signal);
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob, {premultiplyAlpha: 'none', colorSpaceConversion: 'none'});
    if (signal.aborted) {bitmap.close(); throw abortError();}
    return bitmap;
  }
  return new Promise((resolve, reject) => {
    const image = new Image(), url = URL.createObjectURL(blob);
    const finish = () => {URL.revokeObjectURL(url); signal.removeEventListener('abort', cancel); image.onload = null; image.onerror = null;};
    const cancel = () => {finish(); image.src = ''; reject(abortError());};
    image.onload = () => {finish(); resolve(image);};
    image.onerror = () => {finish(); reject(new Error('Board material image could not be decoded'));};
    signal.addEventListener('abort', cancel, {once: true}); image.src = url;
  });
}

async function loadImages(document: GLTFDocument, binary: ArrayBuffer | undefined, quality: Quality, signal: AbortSignal, owner: AssetOwner) {
  const base = new URL(ASSET_ROOT, location.href);
  const pending = (document.images ?? []).map(async image => {
    let blob: Blob;
    if (image.uri) {
      const url = new URL(image.uri, base);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error('Board material path is outside its asset directory');
      blob = new Blob([await fetchBytes(url.href, signal)], {type: image.mimeType ?? 'image/webp'});
    } else {
      const bufferView = image.bufferView === undefined ? undefined : document.bufferViews?.[image.bufferView];
      if (!binary || !bufferView || (bufferView.buffer ?? 0) !== 0) throw new Error('Board material image is missing');
      const start = bufferView.byteOffset ?? 0;
      blob = new Blob([binary.slice(start, start + bufferView.byteLength)], {type: image.mimeType});
    }
    const decoded = await decodeImage(blob, signal); owner.trackImage(decoded);
    const limit = quality === 'FULL' ? 2048 : 1024;
    if (decoded.width > limit || decoded.height > limit) throw new Error('Board material exceeds its quality texture budget');
    return decoded;
  });
  // Await every decoder even when one rejects, so no successful late image is orphaned.
  const results = await Promise.allSettled(pending);
  const failure = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
  if (failure) throw failure.reason;
  checkActive(signal);
  return results.map(result => (result as PromiseFulfilledResult<DecodedImage>).value);
}

function ownedLoader(document: GLTFDocument, images: DecodedImage[], owner: AssetOwner) {
  const loader = new GLTFLoader();
  loader.register(parser => {
    const loadMaterial = parser.loadMaterial.bind(parser), loadGeometries = parser.loadGeometries.bind(parser), loadMesh = parser.loadMesh.bind(parser);
    parser.loadMaterial = async index => {const material = await loadMaterial(index); owner.material(material); return material;};
    parser.loadGeometries = async primitives => {const geometries = await loadGeometries(primitives); geometries.forEach(geometry => owner.track(geometry)); return geometries;};
    parser.loadMesh = async index => {const mesh = await loadMesh(index); owner.object(mesh); return mesh;};
    return {
      name: 'FESTRONIX_owned_board_textures',
      loadTexture: async index => {
        const definition = document.textures?.[index];
        const source = definition?.source ?? definition?.extensions?.EXT_texture_webp?.source;
        if (source === undefined || !images[source]) throw new Error('Board texture source is missing');
        const sampler = definition?.sampler === undefined ? undefined : document.samplers?.[definition.sampler];
        const filters: Record<number, THREE.MagnificationTextureFilter | THREE.MinificationTextureFilter> = {
          9728: THREE.NearestFilter, 9729: THREE.LinearFilter, 9984: THREE.NearestMipmapNearestFilter,
          9985: THREE.LinearMipmapNearestFilter, 9986: THREE.NearestMipmapLinearFilter, 9987: THREE.LinearMipmapLinearFilter,
        };
        const wraps: Record<number, THREE.Wrapping> = {33071: THREE.ClampToEdgeWrapping, 33648: THREE.MirroredRepeatWrapping, 10497: THREE.RepeatWrapping};
        const texture = owner.track(new THREE.Texture(images[source]));
        texture.name = definition?.name ?? `board-texture-${index}`;
        texture.flipY = false;
        texture.magFilter = (filters[sampler?.magFilter ?? 9729] ?? THREE.LinearFilter) as THREE.MagnificationTextureFilter;
        texture.minFilter = filters[sampler?.minFilter ?? 9987] ?? THREE.LinearMipmapLinearFilter;
        texture.wrapS = wraps[sampler?.wrapS ?? 10497] ?? THREE.RepeatWrapping;
        texture.wrapT = wraps[sampler?.wrapT ?? 10497] ?? THREE.RepeatWrapping;
        texture.generateMipmaps = texture.minFilter !== THREE.LinearFilter && texture.minFilter !== THREE.NearestFilter;
        texture.needsUpdate = true;
        parser.associations.set(texture, {textures: index});
        return texture;
      },
    };
  });
  return loader;
}

function prepareParts(gltf: GLTF): BoardAsset {
  const bounds = new THREE.Box3().setFromObject(gltf.scene), center = bounds.getCenter(new THREE.Vector3());
  if (bounds.isEmpty()) throw new Error('Board model has no renderable geometry');
  const paths: {name: string; offset: [number, number, number]; start: number; end: number}[] = [
    {name: 'pcb', offset: [0, 0, 0], start: .20, end: .50},
    {name: 'cooler', offset: [-.012, .092, -.005], start: .20, end: .50},
    {name: 'memory', offset: [.028, .060, .016], start: .24, end: .54},
    {name: 'io', offset: [-.040, .032, -.009], start: .26, end: .55},
    {name: 'chips', offset: [.008, .046, -.012], start: .22, end: .52},
    {name: 'slots', offset: [.012, .030, .022], start: .28, end: .55},
    {name: 'capacitors', offset: [-.012, .038, -.020], start: .25, end: .55},
  ];
  const parts = paths.map(path => {
    const object = gltf.scene.getObjectByName(path.name);
    if (!object) throw new Error(`Board assembly part is missing: ${path.name}`);
    object.matrixAutoUpdate = true;
    return {object, position: object.position.clone(), quaternion: object.quaternion.clone(), scale: object.scale.clone(), offset: new THREE.Vector3(...path.offset), start: path.start, end: path.end};
  });
  const rotor = gltf.scene.getObjectByName('rotor');
  return {scene: gltf.scene, center, parts, rotor: rotor ? {object: rotor, quaternion: rotor.quaternion.clone(), turn: new THREE.Quaternion()} : null};
}

export function RealHardwareBoard({frame, quality, viewport, onReadyAsset, onFail}: RealHardwareBoardProps) {
  const {gl, invalidate} = useThree();
  const [asset, setAsset] = useState<BoardAsset | null>(null);
  const assembly = useRef<THREE.Group>(null), generation = useRef(0), rotorTime = useRef(0);
  const diagnostics = useRef({progress: -1, rotorBucket: -1});
  const callbacks = useRef({onReadyAsset, onFail}); callbacks.current = {onReadyAsset, onFail};

  useEffect(() => {
    const id = ++generation.current, controller = new AbortController(), owner = new AssetOwner();
    const current = () => !controller.signal.aborted && generation.current === id;
    setAsset(null);
    void (async () => {
      try {
        const bytes = await fetchModel(quality, controller.signal), document = inspectGLB(bytes);
        const images = await loadImages(document.json, document.binary, quality, controller.signal, owner);
        checkActive(controller.signal);
        const gltf = await ownedLoader(document.json, images, owner).parseAsync(bytes, ASSET_ROOT);
        gltf.scenes.forEach(scene => owner.object(scene));
        if (!current()) {owner.dispose(); return;}
        const board = prepareParts(gltf), room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(gl);
        try {owner.environment = pmrem.fromScene(room, .04);}
        finally {room.dispose(); pmrem.dispose();}
        const anisotropy = Math.min(quality === 'FULL' ? 4 : 2, gl.capabilities.getMaxAnisotropy());
        board.scene.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          object.castShadow = false; object.receiveShadow = false;
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => {
            if (!(material instanceof THREE.MeshStandardMaterial)) return;
            material.envMap = owner.environment!.texture; material.envMapIntensity = .8;
            [material.map, material.normalMap, material.roughnessMap, material.metalnessMap, material.aoMap].forEach(texture => {if (texture) texture.anisotropy = anisotropy;});
            material.needsUpdate = true;
          });
        });
        if (current()) {setAsset(board); invalidate();}
        else owner.dispose();
      } catch (error) {
        owner.dispose();
        if (current()) callbacks.current.onFail(error);
      }
    })();
    return () => {++generation.current; controller.abort(); owner.dispose();};
  }, [quality, gl, invalidate]);

  // The primitive has committed before readiness is reported. The containing
  // scene still owns first-frame compilation and the poster-to-Canvas handoff.
  useEffect(() => {
    if (!asset) return;
    rotorTime.current = 0; diagnostics.current.progress = -1; diagnostics.current.rotorBucket = -1;
    gl.domElement.dataset.hardwareAsset = 'poly-haven-circuit-board';
    callbacks.current.onReadyAsset(); invalidate();
    return () => {
      delete gl.domElement.dataset.hardwareAsset; delete gl.domElement.dataset.hardwareProgress;
      delete gl.domElement.dataset.hardwareCoolerSeparation; delete gl.domElement.dataset.hardwareMemorySeparation;
      delete gl.domElement.dataset.hardwareRotorAngle;
    };
  }, [asset, gl, invalidate]);

  useFrame((_, dt) => {
    if (!asset) return;
    const f = frame.current, factor = viewport === 'phone' ? .38 : viewport === 'tablet' ? .65 : 1;
    for (const part of asset.parts) {
      const separation = smooth(part.start, part.end, f.progress) * factor;
      part.object.position.copy(part.position).addScaledVector(part.offset, separation);
      part.object.quaternion.copy(part.quaternion); part.object.scale.copy(part.scale);
    }
    if (asset.rotor) {
      if (quality === 'FULL' && f.active) rotorTime.current += Math.min(dt, .05);
      const angle = quality === 'FULL' ? rotorTime.current * .8 : 0;
      asset.rotor.object.quaternion.copy(asset.rotor.quaternion).multiply(asset.rotor.turn.setFromAxisAngle(ROTOR_AXIS, angle));
      const bucket = Math.floor(rotorTime.current * 5);
      if (bucket !== diagnostics.current.rotorBucket) {
        diagnostics.current.rotorBucket = bucket; gl.domElement.dataset.hardwareRotorAngle = angle.toFixed(3);
      }
    }
    const progressBucket = Math.round(f.progress * 1000);
    if (progressBucket !== diagnostics.current.progress) {
      diagnostics.current.progress = progressBucket;
      gl.domElement.dataset.hardwareProgress = f.progress.toFixed(4);
      gl.domElement.dataset.hardwareCoolerSeparation = (smooth(.20, .50, f.progress) * factor * .092).toFixed(5);
      gl.domElement.dataset.hardwareMemorySeparation = (smooth(.24, .54, f.progress) * factor * .060).toFixed(5);
    }
    const age = (performance.now() - f.pulseAt) / 1100, pulse = age >= 0 && age < 1 ? Math.sin(age * Math.PI) : 0;
    if (assembly.current) assembly.current.position.y = pulse * .018;
  });

  if (!asset) return null;
  return <group ref={assembly} rotation={[1.10, -.18, -.10]} scale={11}>
    <group position={[-asset.center.x, -asset.center.y, -asset.center.z]}>
      <primitive object={asset.scene} dispose={null}/>
    </group>
  </group>;
}
