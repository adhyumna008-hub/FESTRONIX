import type {VisualTheme} from './themes';

/** Stable IDs retain saved editions and links while their presentation evolves. */
export const stitchThemes=['Pulse','Comic','Panel','Studio','Blueprint'] as const;
export type StitchTheme=typeof stitchThemes[number];
export const isStitchTheme=(theme:VisualTheme):theme is StitchTheme=>(stitchThemes as readonly string[]).includes(theme);
export const designChoices=['Campus',...stitchThemes] as const;
export const designs:Record<VisualTheme,{name:string;short:string;description:string;motif:string}>={
 Campus:{name:'Campus Original',short:'Campus',description:'The original campus identity, glass emblem and spacious festival introduction.',motif:'The campus comes alive.'},
 Pulse:{name:'Obsidian Kinetic',short:'Obsidian',description:'A precise dark control desk, cyan signals and an engineering-first programme.',motif:'Ideas into motion.'},
 Comic:{name:'Shonen Manga',short:'Manga',description:'Inked panels, halftone details and expressive chapter-by-chapter storytelling.',motif:'Your next chapter.'},
 Panel:{name:'Bauhaus / Neo-Brutalist',short:'Bauhaus',description:'Architectural grids, bold primary blocks and a direct, printed-poster hierarchy.',motif:'Built to stand out.'},
 Studio:{name:'Swiss Editorial',short:'Swiss',description:'Measured typography, fine rules and a quiet emerald editorial composition.',motif:'A meeting of minds.'},
 Blueprint:{name:'Retro Arcade',short:'Arcade',description:'An arcade-inspired programme with stage labels, pixel details and neon accents.',motif:'Press start. Make something.'},
 Flux:{name:'Flux Interactive · Legacy',short:'Flux',description:'The retained interactive WebGL presentation, available through existing links.',motif:'A new frequency.'},
};
