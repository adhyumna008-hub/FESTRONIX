import {canOpenView,workspaceFor} from './demoAuth';
import type {ManagedEvent,Staff} from './model';

export function loginDestination(actor:Staff,currentView:string|null,events:ManagedEvent[],eventId?:string,workspace=false){
 const event=eventId?events.find(e=>e.id===eventId):undefined;
 if(event&&actor.role==='Participant')return {view:'events',extra:{event:event.id,register:'1'}};
 const protectedView=currentView&&!['events','schedule','help','home'].includes(currentView);
 return {view:!workspace&&protectedView&&canOpenView(actor,currentView)?currentView:workspaceFor(actor),extra:undefined};
}
