import {useEffect, useRef} from 'react';
import gsap from 'gsap';
import type {Theme} from './experience';

/** Lightweight CSS 3D for the flat themes: no second WebGL canvas or particle engine. */
export function LiveWallpaper({theme, enabled, pulse}: {theme: Theme; enabled: boolean; pulse: number}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    const hero = node?.parentElement;
    if (!node || !hero || !enabled) return;
    let visible = false;
    let request = 0;
    const sync = () => {node.dataset.active = String(visible && !document.hidden);};
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();});
    observer.observe(hero);
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      cancelAnimationFrame(request);
      const x = (event.clientX / innerWidth - .5) * 2;
      const y = (event.clientY / innerHeight - .5) * 2;
      request = requestAnimationFrame(() => {
        node.style.setProperty('--wall-x', `${x * 5}deg`);
        node.style.setProperty('--wall-y', `${-y * 3}deg`);
      });
    };
    const reset = () => {node.style.setProperty('--wall-x', '0deg'); node.style.setProperty('--wall-y', '0deg');};
    hero.addEventListener('pointermove', pointer, {passive: true});
    hero.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(request); observer.disconnect(); reset();
      hero.removeEventListener('pointermove', pointer); hero.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', sync); node.dataset.active = 'false';
    };
  }, [enabled, theme]);

  useEffect(() => {
    if (!enabled || !pulse || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.wallpaper-halo', {opacity: .32, scale: .55}, {opacity: 0, scale: 1.65, duration: 1.2, ease: 'power2.out'});
    }, root);
    return () => context.revert();
  }, [pulse, enabled]);

  return <div ref={root} className={`live-wallpaper wallpaper-${theme.toLowerCase()}`} aria-hidden="true" data-active="false">
    <div className="wallpaper-tilt"><div className="wallpaper-orbit orbit-one"/><div className="wallpaper-orbit orbit-two"/>
      <div className="wallpaper-cube cube-one"><i/><i/><i/><i/><i/><i/></div>
      <div className="wallpaper-cube cube-two"><i/><i/><i/><i/><i/><i/></div>
    </div>
    <div className="wallpaper-halo-anchor"><div className="wallpaper-halo"/></div>
  </div>;
}
