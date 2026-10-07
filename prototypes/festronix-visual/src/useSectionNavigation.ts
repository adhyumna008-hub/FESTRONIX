import {useEffect, useState} from 'react';
import type {Theme} from './experience';

/** Navigation feedback only; the Flux director remains the sole scene-progress writer. */
export function useSectionNavigation(theme: Theme) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const visible = new Set<HTMLElement>();
    const destinations: Record<string, string> = {
      universe: 'events', events: 'events', schedule: 'schedule', visit: 'visit', faq: 'faq',
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(section);
        else visible.delete(section);
      }
      const current = [...visible].sort((a, b) =>
        a.getBoundingClientRect().top - b.getBoundingClientRect().top,
      ).at(-1);
      setActive(current ? destinations[current.id] ?? '' : '');
    }, {rootMargin: '-15% 0px -65% 0px'});

    document.querySelectorAll<HTMLElement>('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [theme]);

  return active;
}
