import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {EventPoster} from './platform/EventPoster';
import {editionDates, href, type Edition, type ManagedEvent} from './platform/model';
import type {LandingSettings} from './platform/landingSettings';
import {selectFeaturedEvents} from './programmePresentation';
import './pulse-landing.css';

type PulseHeroProps = {
  config: Edition;
  events: ManagedEvent[];
  settings: LandingSettings;
  paused: boolean;
};

function Arrow({down = false}: {down?: boolean}) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/** A finite programme ribbon: real records, ordinary links, no carousel dependency. */
export function PulseHero({config, events, settings, paused}: PulseHeroProps) {
  const root = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const [pointerEnabled, setPointerEnabled] = useState(false);
  const posters = selectFeaturedEvents(events, settings.featuredEventIds, 4);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setPointerEnabled(!preference.matches && !paused && settings.motionEnabled);
      root.current?.style.setProperty('--pulse-drift', '0px');
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [paused, settings.motionEnabled]);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!pointerEnabled || event.pointerType !== 'mouse' || !bounds.current) return;
    const fraction = (event.clientX - bounds.current.left) / bounds.current.width - .5;
    root.current?.style.setProperty('--pulse-drift', `${Math.max(-1, Math.min(1, fraction * 2)) * 10}px`);
  };
  const reset = () => root.current?.style.setProperty('--pulse-drift', '0px');

  return <section
    ref={root}
    className="pulse-hero"
    aria-labelledby="pulse-title"
    data-paused={!pointerEnabled}
    data-event-count={posters.length}
    onPointerEnter={event => {bounds.current = event.currentTarget.getBoundingClientRect();}}
    onPointerMove={move}
    onPointerLeave={reset}
  >
    <div className="pulse-hero-inner">
      <div className="pulse-identity-row">
        <h1 id="pulse-title">FESTRONI<span>X</span></h1>
        <p className="pulse-edition-label">{config.label}</p>
      </div>
      <div className="pulse-hero-layout">
        <div className="pulse-hero-copy">
          <p className="pulse-hero-date"><time dateTime={config.startDate}>{editionDates(config)}</time></p>
          <h2>{config.heroTitle}</h2>
          <p className="pulse-hero-description">{config.heroBody}</p>
          <div className="pulse-hero-actions">
            <a className="pulse-primary-action" href={href('events', 'Pulse')}>{settings.primaryCta}<Arrow/></a>
            <a className="pulse-secondary-action" href={href('schedule', 'Pulse')}>{settings.secondaryCta}<Arrow down/></a>
          </div>
        </div>
        <div className="pulse-hero-signature">
          <span className="pulse-signature-stroke" aria-hidden="true"/>
          <p>{config.tagline}</p>
          <span className="pulse-signature-location">{config.location}</span>
        </div>
      </div>
    </div>
    {posters.length > 0 && <div className="pulse-ribbon" aria-label="Featured event programme">
      <div className="pulse-ribbon-track">
        {posters.map(event => <a className="pulse-poster" href={href('events', 'Pulse', {event: event.id})} key={event.id}>
          <div className="pulse-poster-top"><span>{event.category}</span><span>{event.format}</span></div>
          <EventPoster event={event}/>
          <div className="pulse-poster-copy"><h3>{event.title}</h3></div>
          <div className="pulse-poster-bottom"><span>{event.fee}</span><span>{event.state === 'Live' ? 'Live' : 'View details'}<Arrow/></span></div>
        </a>)}
      </div>
    </div>}
  </section>;
}
