import {useEffect, useMemo, useRef, type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {smooth, type FrameRecord, type Quality} from './experience';

interface Props {frame: RefObject<FrameRecord>; quality: Quality}

function roundedPlate(width: number, height: number, depth: number, radius: number) {
  const s = new THREE.Shape();
  const x = -width / 2, y = -height / 2;
  s.moveTo(x + radius, y); s.lineTo(x + width - radius, y);
  s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius); s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height); s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y);
  const g = new THREE.ExtrudeGeometry(s, {depth, bevelEnabled: true, bevelSize: .018, bevelThickness: .012, bevelSegments: 2, curveSegments: 6});
  g.translate(0, 0, -depth / 2); return g;
}

function boardPrint(size: number) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#174d42'; c.fillRect(0, 0, size, size);
  c.lineCap = 'round';
  // Routed copper traces have bends, terminals and solder pads; no random grid wallpaper.
  for (let i = 0; i < 38; i++) {
    const side = i % 4, offset = .16 + Math.floor(i / 4) * .065;
    const x = side % 2 ? size * .72 : size * .28;
    const y = size * Math.min(.88, offset);
    c.strokeStyle = i % 3 ? '#57846a' : '#a49c64'; c.lineWidth = size * .0018;
    c.beginPath(); c.moveTo(size * .46, size * (.35 + (i % 9) * .018));
    c.lineTo(x, size * (.35 + (i % 9) * .018)); c.lineTo(x + (side % 2 ? 1 : -1) * size * .045, y);
    c.lineTo(side % 2 ? size * .94 : size * .06, y); c.stroke();
    c.fillStyle = '#c3b578'; c.beginPath(); c.arc(side % 2 ? size * .94 : size * .06, y, size * .003, 0, Math.PI * 2); c.fill();
  }
  c.strokeStyle = '#b4cbb0'; c.lineWidth = size * .002;
  c.strokeRect(size * .06, size * .08, size * .88, size * .84);
  c.fillStyle = '#d6dcc7'; c.font = `600 ${Math.round(size * .018)}px monospace`;
  c.fillText('FESTRONIX / COMPUTE CORE', size * .16, size * .04);
  c.font = `${Math.round(size * .017)}px monospace`;
  c.fillText('BUILD · CODE · DISCOVER', size * .09, size * .89);
  ['PWR', 'DATA', 'LINK'].forEach((label, i) => c.fillText(label, size * (.14 + i * .26), size * .78));
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2; return texture;
}

function studioEnvironment(size: number) {
  const faces = Array.from({length: 6}, (_, face) => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
    const c = canvas.getContext('2d')!;
    const gradient = c.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#c0ccd1'); gradient.addColorStop(.45, '#536975'); gradient.addColorStop(1, '#16242d');
    c.fillStyle = gradient; c.fillRect(0, 0, size, size);
    if (face !== 3) {c.fillStyle = face === 2 ? '#f4f5ec' : '#b4cbc9'; c.fillRect(size * .17, size * .1, size * .16, size * .66);}
    return canvas;
  });
  const environment = new THREE.CubeTexture(faces); environment.colorSpace = THREE.SRGBColorSpace;
  environment.needsUpdate = true; return environment;
}

function Instances({geometry, positions, color, metalness = .3, env, rotation}: {
  geometry: THREE.BufferGeometry; positions: number[][]; color: string; metalness?: number; env?: THREE.CubeTexture; rotation?: [number, number, number];
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!mesh.current) return;
    const transform = new THREE.Object3D();
    positions.forEach((p, i) => {transform.position.set(p[0], p[1], p[2]); transform.rotation.set(...(rotation ?? [0, 0, 0])); transform.updateMatrix(); mesh.current!.setMatrixAt(i, transform.matrix);});
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [positions, rotation]);
  return <instancedMesh ref={mesh} args={[geometry, undefined, positions.length]}>
    <meshStandardMaterial color={color} metalness={metalness} roughness={metalness > .7 ? .24 : .46} envMap={env} envMapIntensity={.85}/>
  </instancedMesh>;
}

function FanBlades({geometry, environment}: {geometry: THREE.BufferGeometry; environment: THREE.CubeTexture}) {
  const blades = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!blades.current) return;
    const transform = new THREE.Object3D();
    for (let i=0;i<9;i++){transform.rotation.z=i*Math.PI*2/9;transform.updateMatrix();blades.current.setMatrixAt(i,transform.matrix);}
    blades.current.instanceMatrix.needsUpdate=true;
  }, []);
  return <instancedMesh ref={blades} args={[geometry,undefined,9]}>
    <meshStandardMaterial color="#4b5a5d" metalness={.7} roughness={.3} envMap={environment}/>
  </instancedMesh>;
}

export function ComputeBoard({frame, quality}: Props) {
  const rotor = useRef<THREE.Group>(null), assembly = useRef<THREE.Group>(null), lid = useRef<THREE.Group>(null), indicators = useRef<THREE.InstancedMesh>(null);
  const time = useRef(0);
  const resources = useMemo(() => {
    const blade = new THREE.Shape(); blade.moveTo(.12, -.045); blade.quadraticCurveTo(.43, -.22, .58, -.08); blade.quadraticCurveTo(.46, .12, .17, .1); blade.closePath();
    const bladeGeometry = new THREE.ExtrudeGeometry(blade, {depth: .014, bevelEnabled: true, bevelSize: .006, bevelThickness: .004, bevelSegments: 1, curveSegments: 6});
    const geometries = {
      board: roundedPlate(3.4, 2.8, .09, .13), lid: roundedPlate(.98, .84, .09, .05), housing: roundedPlate(1.45, 1.45, .13, .14),
      blade: bladeGeometry, screw: new THREE.CylinderGeometry(.055, .055, .035, 12), slot: new THREE.BoxGeometry(.065, .012, .006),
      chip: new THREE.BoxGeometry(.32, .2, .09), resistor: new THREE.BoxGeometry(.09, .045, .035),
      capacitor: new THREE.CylinderGeometry(.065, .065, .21, 12), cap: new THREE.CylinderGeometry(.066, .066, .012, 12),
      pin: new THREE.BoxGeometry(.016, .09, .025), fin: new THREE.BoxGeometry(.035, .42, .19),
      socket: new THREE.BoxGeometry(.46, .22, .24), port: new THREE.BoxGeometry(.37, .13, .01), contact: new THREE.BoxGeometry(.026, .17, .012),
      led: new THREE.SphereGeometry(.035, 8, 6), hub: new THREE.CylinderGeometry(.14, .14, .075, 24),
    };
    return {geometries, print: boardPrint(quality === 'FULL' ? 1024 : 512), environment: studioEnvironment(quality === 'FULL' ? 128 : 64)};
  }, [quality]);
  useEffect(() => () => {Object.values(resources.geometries).forEach(g => g.dispose()); resources.print.dispose(); resources.environment.dispose();}, [resources]);
  const parts = useMemo(() => ({
    screws: [[-1.5,-1.2,.1],[1.5,-1.2,.1],[-1.5,1.2,.1],[1.5,1.2,.1],[.05,.94,.28],[1.35,.94,.28],[.05,-.36,.28],[1.35,-.36,.28]],
    chips: Array.from({length: quality === 'FULL' ? 6 : 4}, (_, i) => i<3?[-1.4,.75-i*.36,.1]:[-.8+(i-3)*.44,1.1,.1]),
    resistors: Array.from({length: quality === 'FULL' ? 34 : 18}, (_, i) => [-1.3 + (i % 8) * .11, -.9 + Math.floor(i / 8) * .1, .075]),
    capacitors: Array.from({length: 5}, (_, i) => [.05+i*.29, -.82, .17]),
    caps: Array.from({length: 5}, (_, i) => [.05+i*.29, -.82, .28]),
    pins: Array.from({length: 32}, (_, i) => [-.99 + (i % 16) * .045, -.34 + Math.floor(i/16)*1.16, .125]),
    fins: Array.from({length: 12}, (_, i) => [.24+i*.08, .33, .13]),
    sockets: Array.from({length: 4}, (_, i) => [-1.04+i*.6, -1.32, .15]),
    ports: Array.from({length: 4}, (_, i) => [-1.04+i*.6, -1.437, .15]),
    contacts: Array.from({length: 16}, (_, i) => [.25+i*.058, 1.25, .061]),
  }), [quality]);
  const screwSlots = useMemo(() => parts.screws.map(([x,y,z]) => [x,y,z+.02]), [parts]);
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (!indicators.current) return;
    const transform = new THREE.Object3D();
    for (let i=0;i<3;i++){transform.position.set(-1.12+i*.9,-.98,.105); transform.updateMatrix(); indicators.current.setMatrixAt(i,transform.matrix);}
    indicators.current.instanceMatrix.needsUpdate = true;
  }, []);
  useFrame((_, dt) => {
    time.current += Math.min(dt, .05);
    const f = frame.current, activation = smooth(.28, .5, f.progress);
    const age = (performance.now() - f.pulseAt) / 1400, pulse = age >= 0 && age < 1 ? Math.sin(age * Math.PI) : 0;
    if (rotor.current) rotor.current.rotation.z += Math.min(dt, .05) * (2.2 + activation * 2 + pulse * 5);
    if (assembly.current) {assembly.current.rotation.x = -.48 + Math.sin(time.current*.12)*.015; assembly.current.rotation.y = -.18 + activation*.12;}
    if (lid.current) lid.current.position.z = .17 + activation * .035;
    if (indicators.current) {
      for(let i=0;i<3;i++){color.set(i===f.signal?'#baffdd':i===1?'#dbb774':'#66baa5').multiplyScalar(.65+activation*.5+pulse); indicators.current.setColorAt(i,color);}
      if(indicators.current.instanceColor)indicators.current.instanceColor.needsUpdate = true;
    }
  });
  const g = resources.geometries, env = resources.environment;
  return <group ref={assembly} rotation={[-.48,-.18,-.14]}>
    <mesh geometry={g.board}><meshStandardMaterial color="#18493e" roughness={.57} metalness={.2} envMap={env}/></mesh>
    <mesh position={[0,0,.058]}><planeGeometry args={[3.35,2.75]}/><meshStandardMaterial map={resources.print} roughness={.65} metalness={.12}/></mesh>
    <mesh position={[-.6,.24,.12]}><boxGeometry args={[1.17,1.04,.13]}/><meshStandardMaterial color="#10191b" roughness={.54}/></mesh>
    <group ref={lid} position={[-.6,.24,.17]}>
      <mesh geometry={g.lid}><meshStandardMaterial color="#b9c7c9" roughness={.23} metalness={.91} envMap={env} envMapIntensity={1.2}/></mesh>
      <group position={[0,0,.062]} rotation={[0,0,Math.PI/4]}>{[0,Math.PI/2].map(r=><mesh key={r} rotation={[0,0,r]}><boxGeometry args={[.35,.042,.006]}/><meshStandardMaterial color="#416958" roughness={.45} metalness={.3}/></mesh>)}</group>
    </group>
    <Instances geometry={g.chip} positions={parts.chips} color="#182326"/>
    <Instances geometry={g.resistor} positions={parts.resistors} color="#333837"/>
    <Instances geometry={g.capacitor} positions={parts.capacitors} rotation={[Math.PI/2,0,0]} color="#293d42" metalness={.65} env={env}/>
    <Instances geometry={g.cap} positions={parts.caps} rotation={[Math.PI/2,0,0]} color="#c3ccce" metalness={.9} env={env}/>
    <Instances geometry={g.pin} positions={parts.pins} color="#b7bdbb" metalness={.88} env={env}/>
    <Instances geometry={g.contact} positions={parts.contacts} color="#c3ad64" metalness={.82} env={env}/>
    <Instances geometry={g.screw} positions={parts.screws} rotation={[Math.PI/2,0,0]} color="#88969d" metalness={.9} env={env}/>
    <Instances geometry={g.slot} positions={screwSlots} color="#26373b"/>
    <Instances geometry={g.socket} positions={parts.sockets} color="#9aa7ac" metalness={.9} env={env}/>
    <Instances geometry={g.port} positions={parts.ports} rotation={[Math.PI/2,0,0]} color="#10181a"/>
    <Instances geometry={g.fin} positions={parts.fins} color="#8e9b9d" metalness={.9} env={env}/>
    <mesh geometry={g.housing} position={[.7,.3,.215]}><meshStandardMaterial color="#253134" roughness={.47} metalness={.55} envMap={env}/></mesh>
    <mesh position={[.7,.3,.287]}><circleGeometry args={[.62,quality==='FULL'?48:28]}/><meshStandardMaterial color="#080e11" roughness={.7}/></mesh>
    <mesh position={[.7,.3,.292]}><torusGeometry args={[.63,.025,6,quality==='FULL'?64:36]}/><meshStandardMaterial color="#79878b" metalness={.8} roughness={.3} envMap={env}/></mesh>
    <group ref={rotor} position={[.7,.3,.303]}><FanBlades geometry={g.blade} environment={env}/></group>
    <mesh geometry={g.hub} position={[.7,.3,.343]} rotation={[Math.PI/2,0,0]}><meshStandardMaterial color="#a9b7b8" metalness={.9} roughness={.24} envMap={env}/></mesh>
    <instancedMesh ref={indicators} args={[g.led,undefined,3]}><meshBasicMaterial color="white" toneMapped={false}/></instancedMesh>
  </group>;
}
