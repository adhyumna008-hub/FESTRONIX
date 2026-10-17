import {campusClubs,ClubSymbol} from './ClubSymbols';
import {FestivalIntro,HeroFacts,Identity} from './Heroes';
import './flat-clubs.css';
import {useFestival} from './platform/store';

export function FlatClubHero() {const {config}=useFestival();
 return <><section className="flat-club-hero wrap" id="arrival" aria-label="Technology festival and technical tracks">
  <div className="hero-topline"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>SOFTWARE / ENGINEERING / TECHNOLOGY</span></div>
  <Identity/>
  <div className="flat-club-layout"><div className="hero-copy"><p className="eyebrow">TECHNICAL TRACKS. ONE FESTIVAL.</p><h2 className="hero-tagline">{config.heroTitle}</h2><p className="hero-description">{config.heroBody}</p><HeroFacts/></div>
   <ul className="flat-club-symbols" aria-label="Technical tracks">{campusClubs.map(club=><li key={club.id} className={'flat-symbol flat-symbol-'+club.id}><ClubSymbol id={club.id}/><div><span>{club.label}</span><h3>{club.name}</h3></div></li>)}</ul>
  </div><div className="hero-bottom"><span>STUDENT-LED. CURIOSITY-POWERED.</span><a href="#events">EXPLORE THE EVENTS ↓</a></div>
 </section><FestivalIntro/></>;
}
