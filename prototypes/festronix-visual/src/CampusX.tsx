import {useEffect,useRef} from 'react';
import './campus-x.css';

export function CampusX({paused}:{paused:boolean}) {
 const artwork=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=artwork.current;if(!node||!('IntersectionObserver' in window))return;
  let visible=true;
  const update=()=>node.classList.toggle('campus-x-resting',!visible||document.hidden);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();});
  observer.observe(node);document.addEventListener('visibilitychange',update);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
 },[]);
 return <div ref={artwork} className={'gl-optical campus-x-stage'+(paused?' campus-x-paused':'')} aria-hidden="true">
  <div className="gl-orbit gl-orbit-one"/><div className="gl-orbit gl-orbit-two"/>
  <div className="gl-glass-x"><i/><i/></div>
  <div className="gl-art-caption">MANY INTERESTS.<br/><b>ONE FREQUENCY.</b></div>
  <span className="gl-orbit-label">F× / OPEN TO CURIOSITY</span>
  <div className="gl-ticket"><span>YOUR NEXT<br/>“I WAS THERE.”</span><b>2K27 ↗</b><div className="gl-barcode"/></div>
 </div>;
}
