import {useLayoutEffect, useRef, type RefObject} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {Theme} from './experience';

gsap.registerPlugin(ScrollTrigger);

const entranceTargets = [
  '[data-reveal] .section-label', '[data-reveal] h2', '.section-heading > p',
  '.intro > div > p', '.intro-words', '.flux-promise > div > p', '.flux-universe > p',
  '.universe-links > a', '.chapter-readout', '.categories', '.event-count', '.day-switch',
  '.event-card', '.schedule-row', '.visit > div:first-child > p', '.visit > div:first-child > .button',
  '.visit-facts article', '.stats > div', '.gallery figure', '.sponsor-list > span', '.faq details',
  '.chrono-visual', '.archive-story', '.archive-index', '.cta-row > *', 'main .fineprint',
].join(',');
const boxes = '.event-card, .schedule-row, .visit-facts article, .stats > div, .gallery figure, .sponsor-list > span, .faq details, .chrono-visual, .archive-story, .universe-links > a';

/** DOM effects own dedicated wrappers; Flux retains its camera and scene director. */
export function useLandingMotion(root: RefObject<HTMLDivElement | null>, theme: Theme, enabled: boolean, category: string, day: number) {
  const visited = useRef(new WeakSet<Element>());

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    visited.current = new WeakSet();
    node.dataset.scrollMotion = enabled ? theme.toLowerCase() : 'off';
    if (!enabled) return;

    const context = gsap.context(() => {
      node.querySelectorAll<HTMLElement>('main [data-reveal]').forEach(section => {
        gsap.fromTo(section, {'--section-reveal': 0}, {
          '--section-reveal': 1, duration: 1, ease: 'power2.out',
          scrollTrigger: {trigger: section, start: 'top 88%', once: true},
        });
      });

      const panel = node.querySelector<HTMLElement>('.panel-stage');
      if (theme === 'Panel' && panel) {
        const cover = panel.querySelector<HTMLElement>('.panel-cover')!;
        const split = gsap.timeline({scrollTrigger: {
          trigger: '#arrival', start: 'top top', end: 'bottom 35%', scrub: true, invalidateOnRefresh: true,
          onUpdate: self => {
            const gone = self.progress >= .82;
            panel.inert = gone;
            panel.style.pointerEvents = gone ? 'none' : '';
            panel.dataset.scrollExit = self.progress.toFixed(3);
          },
        }});
        const paths = [
          {part: 'build', x: -.65, y: -.48, rotation: -18, at: .02},
          {part: 'code', x: .62, y: -.45, rotation: 17, at: .06},
          {part: 'discover', x: -.55, y: .45, rotation: -14, at: .1},
          {part: 'play', x: .65, y: .5, rotation: 19, at: .12},
          {part: 'core', x: 0, y: -.8, rotation: -3, at: .04},
        ];
        const phoneFactor = () => matchMedia('(max-width:639px)').matches ? .48 : 1;
        paths.forEach(path => {
          const tile = panel.querySelector<HTMLElement>('[data-panel-part="' + path.part + '"]')!;
          split.set(tile, {clipPath: 'inset(-100% -120%)'}, path.at)
            .to(tile, {scale: 1.055, duration: .12, ease: 'power2.out'}, path.at)
            .to(tile, {
              x: () => cover.clientWidth * path.x * phoneFactor(),
              y: () => cover.clientHeight * path.y * phoneFactor(),
              rotation: () => path.rotation * (phoneFactor() === 1 ? 1 : .6),
              duration: .72, ease: 'power2.inOut',
            }, path.at)
            .to(tile, {scale: .9, duration: .6, ease: 'power2.inOut'}, path.at + .12)
            .to(tile, {opacity: 0, duration: .4, ease: 'power1.inOut'}, path.at + .27);
        });
        split.to(panel.querySelector('.panel-paper'), {opacity: 0, duration: .45}, .18)
          .to(panel.querySelectorAll('.panel-rules, .speed-lines'), {opacity: 0, duration: .3}, .04)
          .to(panel.querySelector('.intro-controls'), {opacity: 0, y: -8, duration: .28}, .42);
      } else if (theme === 'Pulse') {
        const art = node.querySelector('.pulse-composition');
        if (art) gsap.fromTo(art, {y: 0, rotation: 0}, {
          y: () => matchMedia('(max-width:639px)').matches ? 0 : -32,
          rotation: () => matchMedia('(max-width:639px)').matches ? 0 : -1.2,
          ease: 'none', scrollTrigger: {trigger: '#arrival', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true},
        });
      }
    }, node);
    const resize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', resize);
    return () => {
      context.revert(); window.removeEventListener('resize', resize); delete node.dataset.scrollMotion;
      const panel = node.querySelector<HTMLElement>('.panel-stage');
      if (panel) {panel.inert = false; panel.style.pointerEvents = ''; delete panel.dataset.scrollExit;}
    };
  }, [root, theme, enabled]);

  useLayoutEffect(() => {
    const node = root.current;
    if (!node || !enabled) return;
    const targets = Array.from(node.querySelectorAll<HTMLElement>(entranceTargets));
    const entrances = new Map<HTMLElement, gsap.core.Tween>();
    const order = new Map<Element, {text: number; boxes: number}>();
    const context = gsap.context(() => {
      targets.forEach(item => {
        // Visible content and filter/day updates stay immediately available.
        if (visited.current.has(item) || item.getBoundingClientRect().top < innerHeight * .9) {
          visited.current.add(item); item.dataset.revealState = 'shown'; return;
        }
        const section = item.closest('section')!;
        const box = item.matches(boxes);
        const sequence = order.get(section) ?? {text: 0, boxes: 0};
        const index = box ? sequence.boxes++ : sequence.text++;
        order.set(section, sequence);
        item.dataset.revealState = 'waiting';
        const tween = gsap.fromTo(item, {opacity: 0, y: box ? 24 : 16, scale: box ? .965 : .985}, {
          opacity: 1, y: 0, scale: 1, duration: box ? 1.15 : 1.05,
          delay: (index % 3) * .08, ease: 'power2.out',
          scrollTrigger: {trigger: item, start: box ? 'top 92%' : 'top 88%', once: true,
            onEnter: () => {item.dataset.revealState = 'revealing';}},
          onComplete: () => {visited.current.add(item); item.dataset.revealState = 'shown';},
        });
        entrances.set(item, tween);
      });
    }, node);
    const settleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement, section = target.closest('section');
      entrances.forEach((tween, item) => {
        if (item.contains(target) || section?.contains(item)) tween.progress(1);
      });
    };
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    let cancelled = false;
    document.fonts.ready.then(() => {if (!cancelled) ScrollTrigger.refresh();});
    node.addEventListener('focusin', settleFocus);
    return () => {
      cancelled = true; cancelAnimationFrame(refresh); node.removeEventListener('focusin', settleFocus);
      context.revert(); targets.forEach(item => delete item.dataset.revealState);
    };
  }, [root, theme, enabled, category, day]);
}
