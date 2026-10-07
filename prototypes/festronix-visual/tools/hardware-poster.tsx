// Local authoring tool: renders our licensed asset and lighting for the fallback.
// Open through Vite dev, capture its viewport, then encode the resulting still.
import {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas} from '@react-three/fiber';
import {RealHardwareBoard} from '../src/RealHardwareBoard';
import {frameRecord} from '../src/experience';

function Poster() {
  const frame=useRef(frameRecord()),[status,setStatus]=useState('loading');
  frame.current.active=false;
  return <div data-state={status} style={{width:'100%',height:'100%'}}>
    <Canvas dpr={1} frameloop="demand" camera={{position:[0,0,9],fov:42}} gl={{alpha:false,antialias:true}} onCreated={({gl})=>gl.setClearColor('#080c12',1)}>
      <ambientLight intensity={.7}/>
      <directionalLight position={[-2,4,4]} intensity={3.2} color="#fff7ed"/>
      <pointLight position={[2,2,3]} color="#d9e7f5" intensity={4}/>
      <RealHardwareBoard frame={frame} quality="FULL" viewport="desktop" onReadyAsset={()=>setStatus('ready')} onFail={()=>setStatus('failed')}/>
    </Canvas>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Poster/>);
