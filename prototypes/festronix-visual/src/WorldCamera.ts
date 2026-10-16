import * as THREE from 'three';
const keys=[0,.10,.18,.27,.36,.44,.52,.60,.68,.76,.82,.90,1];
const positions=[[0,3.4,11],[0,3.1,7],[-.4,3.3,5.5],[.8,2.5,-13],[1.3,2.4,-20],[-.4,2.7,-34],[-.8,2.8,-41],[.8,2.5,-56],[1.3,2.4,-63],[0,2.6,-81],[.65,2.5,-85.5],[0,2,-109],[0,2.3,-119]];
const targets=[[0,-.1,-7],[0,-.1,-6],[.3,-.1,-7],[0,.45,-27],[0,.45,-30],[0,.1,-49],[0,.1,-52],[0,.45,-71],[0,.45,-74],[.4,.2,-99],[.4,.2,-103],[0,.1,-129],[0,.1,-132]];
const path=new THREE.CatmullRomCurve3(positions.map(p=>new THREE.Vector3(...p)),false,'centripetal');
const phoneSides=[3,3,3,-3,-3,3,3,-3,-3,3,3,0,0];
const phonePath=new THREE.CatmullRomCurve3(positions.map((p,i)=>new THREE.Vector3(phoneSides[i],p[1]+.35,p[2])),false,'centripetal');
const gaze=new THREE.CatmullRomCurve3(targets.map(p=>new THREE.Vector3(...p)),false,'centripetal');
/** One sampled camera path. Native scroll owns p; the renderer alone owns transforms. */
export function sampleWorldCamera(p:number,phone:boolean,position:THREE.Vector3,target:THREE.Vector3) {
  const value=THREE.MathUtils.clamp(p,0,1);let i=0;while(i<keys.length-2&&value>keys[i+1])i++;
  const local=(value-keys[i])/(keys[i+1]-keys[i]);const t=(i+local)/(keys.length-1);
  (phone?phonePath:path).getPoint(t,position);gaze.getPoint(t,target);
  if(phone){target.x=position.x;target.y=2.2;}
}
