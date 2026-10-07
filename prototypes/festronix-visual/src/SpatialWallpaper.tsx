import {useEffect, useMemo, useRef, type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {smooth, type FrameRecord, type Quality, type FluxVariant} from './experience';

export function SpatialWallpaper({frame, quality, variant}: {frame: RefObject<FrameRecord>; quality: Quality; variant: FluxVariant}) {
  const lines = useRef<THREE.LineSegments>(null);
  const traceLayer = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  const routes = useMemo(() => Array.from({length: quality === 'FULL' ? 12 : 6}, (_, i) => {
    const y = -3+i*.55, x = -2+(i%4)*.7, end = 7+(i%3)*.45;
    return [[-5,y], [x,y], [x+.8,y+.45], [end,y+.45]];
  }), [quality]);
  const signals = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(routes.length*3),3)), [routes]);
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const count = quality === 'FULL' ? 12 : 6;
    if (variant === 'A') {
      for (let i=0;i<count;i++) {
        const y=-3+i*.55, x=-2+(i%4)*.7, end=7+(i%3)*.45;
        positions.push(-5,y,-9,x,y,-9,x,y,-9,x+.8,y+.45,-9,x+.8,y+.45,-9,end,y+.45,-9);
        for(let j=0;j<8;j++){const a=j*Math.PI/4,b=(j+1)*Math.PI/4;positions.push(end+Math.cos(a)*.065,y+.45+Math.sin(a)*.065,-9,end+Math.cos(b)*.065,y+.45+Math.sin(b)*.065,-9);}
      }
    } else for (let i = -count; i <= count; i++) {
      const x = i * .85;
      positions.push(x, -6, -9, x, 6, -9);
      positions.push(-11, i * .5, -9, 11, i * .5, -9);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  }, [quality, variant]);
  useEffect(() => () => {geometry.dispose(); signals.dispose();}, [geometry, signals]);

  useFrame((_, dt) => {
    time.current += Math.min(dt, .05);
    const f = frame.current;
    const age = (performance.now() - f.pulseAt) / 1400;
    const pulse = age >= 0 && age < 1 ? Math.sin(age * Math.PI) : 0;
    if (traceLayer.current) {
      traceLayer.current.rotation.x = .08 + Math.sin(time.current * .09) * .025;
      traceLayer.current.rotation.y = THREE.MathUtils.damp(traceLayer.current.rotation.y, f.pointerX * .035, 4, Math.min(dt, .05));
      traceLayer.current.position.y = Math.sin(time.current * .12) * .12 + f.progress * .25;
    }
    if (lines.current) {
      (lines.current.material as THREE.LineBasicMaterial).opacity = (variant === 'A' ? .17 : .1) + smooth(.28, .5, f.progress) * .04 + pulse * .08;
    }
    if (variant === 'A') {
      const positions = signals.getAttribute('position') as THREE.BufferAttribute;
      routes.forEach((route, i) => {
        const p = (time.current*.085+i/routes.length+f.progress*.3)%1*3;
        const segment = Math.floor(p), blend = p-segment;
        positions.setXYZ(i, THREE.MathUtils.lerp(route[segment][0],route[segment+1][0],blend), THREE.MathUtils.lerp(route[segment][1],route[segment+1][1],blend),-8.98);
      });
      positions.needsUpdate = true;
    }
    if (ring.current) {
      ring.current.scale.setScalar(.6 + Math.max(0, Math.min(1, age)) * 6);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = pulse * .28;
    }
  });

  return <group>
    <group ref={traceLayer}>
      <lineSegments ref={lines} geometry={geometry}><lineBasicMaterial color={variant === 'A' ? '#6fae99' : '#6b9baf'} transparent opacity={.1} depthWrite={false}/></lineSegments>
      {variant === 'A' && <points geometry={signals}><pointsMaterial color="#9edfc8" size={.035} transparent opacity={.55} depthWrite={false}/></points>}
    </group>
    <mesh ref={ring} position={[1.5, 0, -5]}>
      <torusGeometry args={[1, .018, 5, quality === 'FULL' ? 80 : 40]}/><meshBasicMaterial color="#9fe9d7" transparent opacity={0} depthWrite={false}/>
    </mesh>
  </group>;
}
