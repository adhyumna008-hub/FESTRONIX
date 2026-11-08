import {useId} from 'react';
import {href,type Edition,type ManagedEvent} from './model';
import {getLandingSettings,landingCopyLimits,type LandingSettings} from './landingSettings';
import {Check,Field} from './ui';

const copyLabels:Record<keyof typeof landingCopyLimits,string>={primaryCta:'Primary event button label',secondaryCta:'Secondary schedule button label',introTitle:'Introduction heading',eventsTitle:'Featured events heading',scheduleTitle:'Schedule heading',visitTitle:'Visit and help heading',faqTitle:'FAQ heading',sponsorsTitle:'Sponsors heading',closingTitle:'Final invitation heading',closingBody:'Final invitation description'};

function CopyField({field,value}:{field:keyof typeof landingCopyLimits;value:string}){
 const id=useId(),label=copyLabels[field],name='landing.'+field;
 return <label className="op-field" htmlFor={id}><span>{label}</span>{field==='closingBody'?<textarea id={id} name={name} defaultValue={value} maxLength={landingCopyLimits[field]} rows={3} required aria-describedby={id+'-limit'}/>:<input id={id} name={name} defaultValue={value} maxLength={landingCopyLimits[field]} required aria-describedby={id+'-limit'}/>}<small id={id+'-limit'}>Up to {landingCopyLimits[field]} characters. Plain text only.</small></label>;
}

export function readLandingSettingsForm(data:FormData,edition:Edition):LandingSettings{
 const next=getLandingSettings(edition);
 for(const key of Object.keys(landingCopyLimits) as (keyof typeof landingCopyLimits)[])next[key]=String(data.get('landing.'+key)??'').trim();
 for(const key of ['showIntro','showCategories','showSchedule','showVisit','showSponsors','showFaq','motionEnabled'] as const)next[key]=data.get('landing.'+key)==='on';
 next.pulseAccent=String(data.get('landing.pulseAccent')) as LandingSettings['pulseAccent'];
 next.fluxHero=String(data.get('landing.fluxHero')) as LandingSettings['fluxHero'];
 next.fluxQuality=String(data.get('landing.fluxQuality')) as LandingSettings['fluxQuality'];
 next.featuredEventIds=[0,1,2].map(slot=>String(data.get('landing.featured.'+slot)??'')).filter(Boolean);
 return next;
}

export function LandingSettingsFields({edition,events}:{edition:Edition;events:ManagedEvent[]}){
 const settings=getLandingSettings(edition),available=events.filter(event=>event.editionId===edition.id&&['Published','Live'].includes(event.state));
 const preview:Record<string,string>=edition.phase==='Upcoming'?{preview:edition.id}:{};
 return <>
  <h3>Shared landing-page presentation</h3>
  <p className="op-muted">All themes use the same edition and event records. Featured-event order is shared; section headings and visibility apply where the theme includes that section. Each theme keeps its designed hero and framing. Pulse accent and Flux scene controls apply only to those themes. Functional navigation, eligibility and registration-status labels remain system behaviour, not free-form HTML.</p>
  <div className="op-actions"><a href={href('home','Pulse',preview)} target="_blank" rel="noreferrer">Preview saved Pulse ↗</a><a href={href('home','Flux',preview)} target="_blank" rel="noreferrer">Preview saved Flux ↗</a></div>
  <p className="op-muted">Save before previewing. Editing a future edition never activates it.</p>
  <div className="op-form-grid">
   {(Object.keys(landingCopyLimits) as (keyof typeof landingCopyLimits)[]).map(field=><CopyField key={field} field={field} value={settings[field]}/>)}
  </div>
  <h3>Featured event order</h3>
  <p className="op-muted">Choose up to three different published events from this edition, in order. The first leads the Home preview. With no valid selection, Home uses the published programme order; otherwise it shows only your selected events. Unpublished, archived and other-edition events cannot be promoted.</p>
  <div className="op-form-grid">{[0,1,2].map(slot=><Field key={slot} name={'landing.featured.'+slot} label={'Featured event '+(slot+1)} value={settings.featuredEventIds[slot]??''}><option value="">Not selected</option>{available.map(event=><option key={event.id} value={event.id}>{event.title}</option>)}</Field>)}</div>
  {available.length===0&&<p className="op-muted">Publish approved events for this edition before featuring them. A new year starts with no copied event selections.</p>}
  <h3>Sections and motion</h3>
  <div className="op-form-grid">
   <Check name="landing.showIntro" checked={settings.showIntro}>Show festival introduction</Check>
   <Check name="landing.showCategories" checked={settings.showCategories}>Show event categories</Check>
   <Check name="landing.showSchedule" checked={settings.showSchedule}>Show schedule teaser</Check>
   <Check name="landing.showVisit" checked={settings.showVisit}>Show visit and support section</Check>
   <Check name="landing.showSponsors" checked={settings.showSponsors}>Show approved sponsors when present</Check>
   <Check name="landing.showFaq" checked={settings.showFaq}>Show FAQs when present</Check>
   <Check name="landing.motionEnabled" checked={settings.motionEnabled}>Enable decorative motion (visitor reduced-motion preferences still apply)</Check>
  </div>
  <div className="op-form-grid">
   <Field name="landing.pulseAccent" label="Pulse accent colour" value={settings.pulseAccent}><option>Coral</option><option>Cobalt</option></Field>
   <Field name="landing.fluxHero" label="Flux hero visual" value={settings.fluxHero}>{['Core','Technical Tracks','Liquid Flux','Network / Portal'].map(value=><option key={value}>{value}</option>)}</Field>
   <Field name="landing.fluxQuality" label="Flux rendering preference" value={settings.fluxQuality}><option value="Auto">Auto · adapt to screen</option><option value="Reduced">Reduced · lighter scene</option><option value="Static">Static · no WebGL</option></Field>
  </div>
  <p className="op-muted">Core is the new Flux study. Existing Technical Tracks, Liquid Flux and Network / Portal remain available; the removed Club Gallery is not restored. Visitors can preview an experiment without publishing it. Built-in geometry, logos, type families and component layout remain controlled design assets; they are not an unrestricted page builder.</p>
 </>;
}
