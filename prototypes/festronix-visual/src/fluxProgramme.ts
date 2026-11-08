import type {ManagedEvent} from './platform/model';

export interface FluxTrack {name:string;count:number}

/** Presentation summaries follow the programme, never a fixed set of sample tracks. */
export function getFluxTracks(events:readonly Pick<ManagedEvent,'category'>[]):FluxTrack[]{
 const tracks=new Map<string,FluxTrack>();
 for(const event of events){
  const name=event.category.trim()||'Other events',key=name.toLowerCase();
  const existing=tracks.get(key);
  if(existing)existing.count+=1;
  else tracks.set(key,{name,count:1});
 }
 return [...tracks.values()];
}
