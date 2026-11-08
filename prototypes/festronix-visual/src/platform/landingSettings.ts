import type {Edition,ManagedEvent} from './model';

/** Bounded presentation settings. Event rules and permissions never live here. */
export interface LandingSettings {
 primaryCta:string;
 secondaryCta:string;
 introTitle:string;
 eventsTitle:string;
 scheduleTitle:string;
 visitTitle:string;
 faqTitle:string;
 sponsorsTitle:string;
 closingTitle:string;
 closingBody:string;
 showIntro:boolean;
 showCategories:boolean;
 showSchedule:boolean;
 showVisit:boolean;
 showSponsors:boolean;
 showFaq:boolean;
 motionEnabled:boolean;
 featuredEventIds:string[];
 pulseAccent:'Coral'|'Cobalt';
 fluxHero:'Core'|'Technical Tracks'|'Liquid Flux'|'Network / Portal';
 fluxQuality:'Auto'|'Reduced'|'Static';
}

export const landingCopyLimits={primaryCta:32,secondaryCta:32,introTitle:90,eventsTitle:90,scheduleTitle:90,visitTitle:90,faqTitle:90,sponsorsTitle:90,closingTitle:90,closingBody:300} as const;
const copyDefaults={primaryCta:'Explore events',secondaryCta:'View schedule',introTitle:'Ideas become something real.',eventsTitle:'Find your next challenge.',scheduleTitle:'Two days. Make them yours.',visitTitle:'Meet us at Vardhaman.',faqTitle:'Before you arrive.',sponsorsTitle:'The people behind the possibilities.',closingTitle:'Make your next move.',closingBody:'Read the brief, find your team and choose your event.'};
const visibilityKeys=['showIntro','showCategories','showSchedule','showVisit','showSponsors','showFaq','motionEnabled'] as const;
const choices={pulseAccent:['Coral','Cobalt'],fluxHero:['Core','Technical Tracks','Liquid Flux','Network / Portal'],fluxQuality:['Auto','Reduced','Static']} as const;
const enumDefaults={pulseAccent:'Coral',fluxHero:'Core',fluxQuality:'Auto'} as const;
const isRecord=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);

/** Missing or malformed old browser data gets safe per-field defaults without a migration. */
export function getLandingSettings(edition:Pick<Edition,'landing'>):LandingSettings {
 const raw:Record<string,unknown>=isRecord(edition.landing)?edition.landing:{};
 const settings:LandingSettings={...copyDefaults,...enumDefaults,showIntro:true,showCategories:true,showSchedule:true,showVisit:true,showSponsors:true,showFaq:true,motionEnabled:true,featuredEventIds:[]};
 for(const key of Object.keys(landingCopyLimits) as (keyof typeof landingCopyLimits)[]){const value=raw[key];if(typeof value==='string'&&value.trim().length>0&&value.trim().length<=landingCopyLimits[key])settings[key]=value.trim();}
 for(const key of visibilityKeys)if(typeof raw[key]==='boolean')settings[key]=raw[key];
 for(const key of Object.keys(choices) as (keyof typeof choices)[]){const value=raw[key];if(typeof value==='string'&&(choices[key] as readonly string[]).includes(value))Object.assign(settings,{[key]:value});}
 if(Array.isArray(raw.featuredEventIds))settings.featuredEventIds=[...new Set(raw.featuredEventIds.filter((id):id is string=>typeof id==='string'&&id.length>0&&id.length<=100))].slice(0,3);
 return settings;
}

/** Validate before mutating edition state. Rendering still resolves live records by ID. */
export function validateLandingSettings(value:unknown,editionId:string,events:ManagedEvent[]):LandingSettings {
 if(!isRecord(value))throw new Error('Landing-page settings must be a supported settings object.');
 const supported=new Set([...Object.keys(landingCopyLimits),...visibilityKeys,...Object.keys(choices),'featuredEventIds']);
 if(Object.keys(value).some(key=>!supported.has(key)))throw new Error('Unsupported landing-page setting. Use the available presentation controls.');
 for(const key of Object.keys(landingCopyLimits) as (keyof typeof landingCopyLimits)[]){if(!(key in value))continue;const text=value[key];if(typeof text!=='string'||!text.trim()||text.trim().length>landingCopyLimits[key]||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error(`Use 1–${landingCopyLimits[key]} characters for ${key}.`);}
 for(const key of visibilityKeys)if(key in value&&typeof value[key]!=='boolean')throw new Error(`Choose on or off for ${key}.`);
 for(const key of Object.keys(choices) as (keyof typeof choices)[])if(key in value&&(typeof value[key]!=='string'||!(choices[key] as readonly string[]).includes(value[key] as string)))throw new Error(`Choose a supported ${key} option.`);
 if('featuredEventIds' in value){const ids=value.featuredEventIds;if(!Array.isArray(ids)||ids.length>3||ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw new Error('Choose up to three different featured events in display order.');for(const id of ids)if(!events.some(event=>event.id===id&&event.editionId===editionId&&['Published','Live'].includes(event.state)))throw new Error('Featured events must be published events from the edition being edited.');}
 return getLandingSettings({landing:value as unknown as LandingSettings});
}

/** Reuse approved presentation choices without linking a new year to old events. */
export function copyLandingForEdition(edition:Pick<Edition,'landing'>):LandingSettings|undefined {
 return edition.landing?{...getLandingSettings(edition),featuredEventIds:[]}:undefined;
}
