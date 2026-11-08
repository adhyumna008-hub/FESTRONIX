/** One presentation catalogue for public pages, workspaces and edition settings. */
export const visualThemes = ['Campus','Pulse','Panel','Flux','Comic','Studio','Blueprint'] as const;
export type VisualTheme = typeof visualThemes[number];
export const isVisualTheme = (value:unknown):value is VisualTheme => typeof value==='string' && (visualThemes as readonly string[]).includes(value);
export const isEditionTheme = (theme:VisualTheme):theme is 'Comic'|'Studio'|'Blueprint' => theme==='Comic'||theme==='Studio'||theme==='Blueprint';
export const displayFonts:Record<VisualTheme,string>={Campus:'Outfit:wght@500;600;700',Pulse:'Space+Grotesk:wght@500;600;700',Panel:'Barlow+Condensed:wght@600;700;800',Flux:'Sora:wght@500;600;700',Comic:'Barlow+Condensed:wght@600;700;800;900',Studio:'Space+Grotesk:wght@500;600;700',Blueprint:'Space+Grotesk:wght@500;600;700'};
