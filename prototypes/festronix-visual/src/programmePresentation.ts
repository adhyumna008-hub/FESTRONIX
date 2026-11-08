import type {ManagedEvent} from './platform/model';

/** Curation references current public records, never seeded names, images or positions. */
export function selectFeaturedEvents(events:readonly ManagedEvent[],ids:readonly string[],limit=3):ManagedEvent[]{
 const published=events.filter(event=>event.state==='Published'||event.state==='Live');
 const selected=[...new Set(ids)].map(id=>published.find(event=>event.id===id)).filter((event):event is ManagedEvent=>!!event);
 return (selected.length?selected:published).slice(0,limit);
}
