import {campusClubs,ClubSymbol} from './ClubSymbols';
import {FestivalIntro,HeroFacts,Identity} from './Heroes';
import './flat-clubs.css';

export function FlatClubHero() {
 return <><section className="flat-club-hero wrap" id="arrival" aria-label="Festival and student clubs">
  <div className="hero-topline"><span>VARDHAMAN COLLEGE OF ENGINEERING</span><span>TECH / PLAY / CULTURE</span></div>
  <Identity/>
  <div className="flat-club-layout"><div className="hero-copy"><p className="eyebrow">FIVE INTERESTS. ONE CAMPUS.</p><h2 className="hero-tagline">Find your<br/><em>people.</em></h2><p className="hero-description">Play, develop, write, film and discover.<br/>Meet the clubs bringing campus together.</p><HeroFacts/></div>
   <ul className="flat-club-symbols" aria-label="Student clubs">{campusClubs.map(club=><li key={club.id} className={'flat-symbol flat-symbol-'+club.id}><ClubSymbol id={club.id}/><div><span>{club.label}</span><h3>{club.name}</h3></div></li>)}</ul>
  </div><div className="hero-bottom"><span>STUDENT-LED. CURIOSITY-POWERED.</span><a href="#events">EXPLORE THE EVENTS ↓</a></div>
 </section><FestivalIntro/></>;
}
