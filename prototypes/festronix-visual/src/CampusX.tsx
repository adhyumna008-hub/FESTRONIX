import {useEffect,useRef} from 'react';
import {ClubSymbol} from './ClubSymbols';
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
  <div className="campus-x-orbit"/><div className="campus-x-orbit campus-x-orbit-two"/>
  <div className="campus-x-float"><div className="campus-x-mark"><i/><i/></div><span className="campus-x-spark"/></div>
  <span className="campus-x-label">F× / OPEN TO CURIOSITY</span>
  <div className="campus-x-symbols">{['sdc','gaming','cine'].map(id=><span key={id}><ClubSymbol id={id}/></span>)}</div>
  <p className="campus-x-caption">MANY INTERESTS.<br/><b>ONE FREQUENCY.</b></p>
 </div>;
}
