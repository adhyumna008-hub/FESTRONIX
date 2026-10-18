import type {FestivalState,Staff} from './model';

// Public demonstration credentials. They never authenticate against the real backend.
export const DEMO_ACCOUNTS=[
 {username:'admin',password:'admin123',staffId:'primary',purpose:'Admin · all events, approvals, website and reports'},
 {username:'user1',password:'user1',staffId:'participant',purpose:'Participant · registration and personal passes'},
 {username:'user2',password:'user2',staffId:'participant-2',purpose:'Participant · a second independent account'},
 {username:'user3',password:'user3',staffId:'dev',purpose:'Coordinator · Quantum Challenge and Signal / Noise'},
 {username:'user4',password:'user4',staffId:'engineering',purpose:'Coordinator · RoboRumble and Circuit Sprint'},
 {username:'user5',password:'user5',staffId:'helper-dev',purpose:'Event helper · Quantum Challenge only'},
 {username:'user6',password:'user6',staffId:'helper-engineering',purpose:'Event helper · RoboRumble only'},
] as const;
export interface DemoSession {staffId:string;expiresAt:number}
export const SESSION_KEY='festronix-demo-session-v1';
export function sessionActor(state:FestivalState,session:DemoSession|null,now=Date.now()):Staff|undefined {
 if(!session||!Number.isFinite(session.expiresAt)||session.expiresAt<=now)return;
 return state.staff.find(s=>s.id===session.staffId&&s.active&&(s.role==='Owner'||s.editionId===state.activeEditionId));
}
export function authenticateDemo(state:FestivalState,username:string,password:string):DemoSession {
 const account=DEMO_ACCOUNTS.find(a=>a.username===username.trim().toLowerCase()&&a.password===password);
 if(!account)throw new Error('Incorrect demo username or password. Use one of the test accounts below.');
 const session={staffId:account.staffId,expiresAt:Date.now()+12*60*60*1000};
 if(!sessionActor(state,session))throw new Error('This account is inactive or its edition access has expired. Ask the demo admin to restore its access.');
 return session;
}
export const workspaceFor=(actor:Staff)=>actor.role==='Owner'||actor.role==='Faculty'?'admin':actor.role==='Participant'?'participant':'coordinator';
export const canOpenView=(actor:Staff,view:string)=>view==='events'||view==='schedule'||view==='help'||(view==='admin'&&['Owner','Faculty'].includes(actor.role))||(view==='coordinator'&&['Owner','Faculty','Coordinator','Helper'].includes(actor.role))||(view==='participant'&&actor.role==='Participant');
