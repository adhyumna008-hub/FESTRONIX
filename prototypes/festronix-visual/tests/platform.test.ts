import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {seedState,canManage,canScan,type FestivalState,type Staff} from '../src/platform/model';
import {execute,type Command} from '../src/platform/commands';
import {upgradeState,belongsTo} from '../src/platform/attendance';
import {DEMO_ACCOUNTS,authenticateDemo,sessionActor,canOpenView} from '../src/platform/demoAuth';
import {eventTotals,makeWorkbook,reportEvents} from '../src/platform/reportData';
const staff=(s:FestivalState,id:string)=>s.staff.find(a=>a.id===id)!;
mock.method(Date,'now',()=>new Date('2026-10-16T07:00:00Z').getTime());
const act=(s:FestivalState,id:string,c:Command)=>execute(s,staff(s,id),c);
function register(s:FestivalState,eventId='quantum',actor='participant',extra:Partial<Extract<Command,{type:'register'}>>={}){act(s,actor,{type:'register',eventId,team:'Test Engineers',members:staff(s,actor).name+(eventId==='signal'?'':', Teammate'),eligible:true,paymentRef:'FAKE-UTR',proofName:'fictional.png',...extra});return s.entries.at(-1)!}

test('seven requested credentials, incorrect password, session expiry, revocation and route boundaries',()=>{
 const s=seedState();assert.equal(DEMO_ACCOUNTS.length,7);
 for(const a of DEMO_ACCOUNTS)assert.equal(sessionActor(s,authenticateDemo(s,a.username,a.password))?.id,a.staffId);
 assert.throws(()=>authenticateDemo(s,'admin','wrong'),/Incorrect/);
 const token=authenticateDemo(s,'user3','user3');assert.equal(sessionActor(s,token,token.expiresAt),undefined);
 assert.equal(canOpenView(staff(s,'participant'),'admin'),false);assert.equal(canOpenView(staff(s,'helper-dev'),'admin'),false);
 staff(s,'dev').active=false;assert.equal(sessionActor(s,token),undefined);assert.throws(()=>authenticateDemo(s,'user3','user3'),/inactive/);
});
test('free registration confirms; each event/member pass is unique, contains no names; duplicates rejected',()=>{
 const s=seedState(),r=register(s,'signal'),second=register(s,'cyber');
 assert.equal(r.status,'CONFIRMED');assert.notEqual(r.attendees[0].token,second.attendees[0].token);
 assert.ok(r.attendees.every(a=>!a.token.includes(a.name)));assert.throws(()=>register(s,'signal'),/already/);
 assert.throws(()=>register(s,'ai','participant',{members:'Wrong, Name'}),/own account/);
});
test('paid proof rejection, resubmission, approval, personal attendance, wrong-event and duplicate checks',()=>{
 const s=seedState(),r=register(s);assert.equal(r.status,'PAYMENT_VERIFICATION_PENDING');
 assert.throws(()=>act(s,'engineering',{type:'verifyPayment',entryId:r.id,approved:true,note:''}),/scope/);
 act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:false,note:'Reference unreadable'});assert.equal(r.status,'PAYMENT_REJECTED');
 act(s,'participant',{type:'proof',entryId:r.id,reference:'FAKE-RETRY',filename:'retry.png'});
 act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:true,note:'Sample verified'});
 act(s,'dev',{type:'transition',eventId:'quantum',target:'Live'});
 act(s,'engineering',{type:'transition',eventId:'robot',target:'Live'});
 const before=eventTotals(s,'quantum');act(s,'helper-dev',{type:'scan',eventId:'quantum',token:r.attendees[0].token});
 assert.equal(eventTotals(s,'quantum').present,before.present+1);assert.equal(r.attendees[1].checkedAt,'');
 assert.throws(()=>act(s,'helper-dev',{type:'scan',eventId:'quantum',token:r.attendees[0].token}),/Already/);
 assert.throws(()=>act(s,'helper-engineering',{type:'scan',eventId:'robot',token:r.attendees[0].token}),/Wrong event/);
 assert.throws(()=>act(s,'helper-engineering',{type:'scan',eventId:'quantum',token:r.attendees[1].token}),/scope/);
 assert.throws(()=>act(s,'participant',{type:'scan',eventId:'quantum',token:r.attendees[1].token}),/scope/);
 act(s,'helper-dev',{type:'scan',eventId:'quantum',token:r.attendees[1].token,manualReason:'QR damaged; ID checked'});assert.equal(eventTotals(s,'quantum').present,before.present+2);
 assert.equal(r.attendees[1].method,'Manual');
});
test('teammate account has its own pass and cannot register for the same event twice',()=>{
 const s=seedState(),r=register(s,'cyber','participant',{members:staff(s,'participant').name,memberAccounts:['participant-2']});
 assert.equal(r.attendees.length,2);assert.equal(belongsTo(r,staff(s,'participant-2')),true);assert.notEqual(r.attendees[0].token,r.attendees[1].token);
 assert.throws(()=>register(s,'cyber','participant-2'),/already/);
 assert.throws(()=>act(s,'participant-2',{type:'withdraw',entryId:r.id}),/your unchecked/);
});
test('helpers have only assigned-event scope; event actions and exports denied',()=>{
 const s=seedState(),helper=staff(s,'helper-dev');assert.ok(canScan(helper,s.events[0]));assert.ok(!canManage(helper,s.events[0]));
 assert.throws(()=>act(s,helper.id,{type:'addHelper',eventId:'quantum',name:'Forbidden Helper'}),/scope/);
 assert.throws(()=>reportEvents(s,helper,['quantum']),/Only faculty/);
 act(s,'dev',{type:'helper',eventId:'quantum',helperId:helper.id,enabled:false});assert.equal(canScan(helper,s.events[0]),false);
});
test('two-event quota, approval, creation, and original owner scope are enforced',()=>{
 const s=seedState();const draft={...s.events[2],id:'new-event',time:'09:00',state:'Draft' as const};
 assert.throws(()=>act(s,'dev',{type:'event',event:draft}),/two-event/);
 act(s,'primary',{type:'staff',person:{...staff(s,'participant-2'),role:'Coordinator'}});
 act(s,'participant-2',{type:'event',event:draft});const e=s.events.at(-1)!;assert.equal(e.ownerId,'participant-2');
 act(s,'participant-2',{type:'transition',eventId:e.id,target:'In review'});
 assert.throws(()=>act(s,'participant-2',{type:'transition',eventId:e.id,target:'Approved'}),/Faculty/);
 act(s,'primary',{type:'transition',eventId:e.id,target:'Approved'});act(s,'primary',{type:'transition',eventId:e.id,target:'Published'});
 assert.equal(e.state,'Published');assert.throws(()=>act(s,'dev',{type:'event',event:e}),/scope/);
});
test('capacity, waitlist, deadline, withdrawal and pending-payment admission rules',()=>{
 const s=seedState(),event=s.events.find(e=>e.id==='signal')!;event.capacity=1;
 const first=register(s,'signal');const waiting=register(s,'signal','participant-2');assert.equal(waiting.status,'WAITLISTED');
 act(s,'participant',{type:'withdraw',entryId:first.id});act(s,'dev',{type:'promote',entryId:waiting.id});assert.equal(waiting.status,'CONFIRMED');
 event.deadline='2020-01-01T18:00';assert.throws(()=>register(s,'signal'),/deadline/);
 act(s,'engineering',{type:'transition',eventId:'robot',target:'Live'});const pending=s.entries.find(r=>r.eventId==='robot')!;
 assert.throws(()=>act(s,'helper-engineering',{type:'scan',eventId:'robot',token:pending.attendees[0].token}),/not confirmed/);
});
test('reports are scoped, real XLSX round-trips, totals change after scan and strings cannot become formulas',async()=>{
 const s=seedState(),r=register(s,'quantum','participant',{members:staff(s,'participant').name+', =SUM(A1:A9)'});
 act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:true,note:''});act(s,'dev',{type:'transition',eventId:'quantum',target:'Live'});
 act(s,'helper-dev',{type:'scan',eventId:'quantum',token:r.attendees[0].token});
 assert.throws(()=>reportEvents(s,staff(s,'dev'),['robot']),/scope/);
 const workbook=await makeWorkbook(s,staff(s,'primary'),s.events.map(e=>e.id));const bytes=await workbook.xlsx.writeBuffer();
 const {default:ExcelJS}=await import('exceljs');const loaded=new ExcelJS.Workbook();await loaded.xlsx.load(bytes);
 assert.deepEqual(loaded.worksheets.map(s=>s.name),['Event summary','All attendees']);
 assert.equal(loaded.worksheets[0].getRow(6).getCell(9).value,1);
 const roster=loaded.worksheets[1];assert.equal(roster.rowCount-5,s.entries.flatMap(r=>r.attendees).length);
 const hostile=roster.getColumn(6).values.find(v=>v==='=SUM(A1:A9)');assert.equal(typeof hostile,'string');
 assert.ok(!JSON.stringify(roster.model).includes('FESTRONIX-DEMO:'));assert.ok(!JSON.stringify(roster.model).includes('FAKE-UTR'));
 await fs.mkdir('../../output/event-platform',{recursive:true});await fs.writeFile('../../output/event-platform/all-events-test.xlsx',new Uint8Array(bytes));
 const one=await makeWorkbook(s,staff(s,'dev'),['quantum']);assert.equal(one.worksheets[0].rowCount,6);
});
test('results and appeals preserve faculty finalization and archive continuity',()=>{
 const s=seedState(),r=register(s,'signal');act(s,'dev',{type:'transition',eventId:'signal',target:'Live'});act(s,'dev',{type:'transition',eventId:'signal',target:'Completed'});
 act(s,'dev',{type:'results',eventId:'signal',text:'Sample workshop completion results',finalize:false});act(s,'participant',{type:'appeal',entryId:r.id,text:'Please review my attendance evidence.'});
 assert.throws(()=>act(s,'dev',{type:'results',eventId:'signal',text:'',finalize:true}),/Faculty/);
 act(s,'primary',{type:'resolveAppeal',entryId:r.id,note:'Reviewed the sample attendance and resolved the request.'});
 s.events.find(e=>e.id==='signal')!.appealUntil='2020-01-01T00:00:00Z';act(s,'primary',{type:'results',eventId:'signal',text:'',finalize:true});
 const next=s.editions.find(e=>e.year===2027)!;
 assert.equal(s.events.filter(e=>e.editionId===next.id).length,0);assert.throws(()=>act(s,'primary',{type:'activate',editionId:next.id}),/Close/);
 s.editions[0].registrationOpen=false;act(s,'primary',{type:'activate',editionId:next.id});
 assert.ok(s.entries.some(e=>e.id===r.id));assert.equal(staff(s,'dev').active,false);assert.equal(staff(s,'participant').editionId,next.id);
 assert.throws(()=>reportEvents(s,staff(s,'dev'),['signal']),/Only faculty/);assert.equal(reportEvents(s,staff(s,'primary'),['signal']).length,1);
});
test('historic team attendance is preserved but never falsely expanded to every member',()=>{
 const s=seedState();const r=s.entries[0];r.checkedIn=true;r.checkedAt='2026-10-17T12:00:00Z';delete (r as Partial<typeof r>).attendees;
 upgradeState(s);assert.equal(r.legacyTeamCheckIn,'2026-10-17T12:00:00Z');assert.equal(r.attendees.filter(a=>a.checkedAt).length,0);assert.equal(r.checkedIn,false);
});
test('institutional continuity guard retains two owners',()=>{
 const s=seedState();assert.throws(()=>act(s,'primary',{type:'staff',person:{...staff(s,'backup'),active:false}}),/two active/);
 assert.throws(()=>act(s,'primary',{type:'promoteOwner',staffId:'dev'}),/faculty/);
});
test('generated personal QR pixels decode back to the exact opaque credential',async()=>{
 const {default:QRCode}=await import('qrcode');const {default:jsQR}=await import('jsqr');
 const token=register(seedState(),'signal').attendees[0].token;
 const qr=QRCode.create(token,{errorCorrectionLevel:'M'}),scale=7,margin=4,size=(qr.modules.size+margin*2)*scale;
 const pixels=new Uint8ClampedArray(size*size*4).fill(255);
 for(let y=0;y<qr.modules.size;y++)for(let x=0;x<qr.modules.size;x++)if(qr.modules.get(y,x))for(let dy=0;dy<scale;dy++)for(let dx=0;dx<scale;dx++){const at=(((y+margin)*scale+dy)*size+(x+margin)*scale+dx)*4;pixels[at]=pixels[at+1]=pixels[at+2]=0}
 assert.equal(jsQR(pixels,size,size)?.data,token);
});
test('revoked helper cannot scan and pending entries never contribute to attendance denominator',()=>{
 const s=seedState();act(s,'dev',{type:'transition',eventId:'quantum',target:'Live'});
 act(s,'primary',{type:'staff',person:{...staff(s,'helper-dev'),active:false}});
 assert.throws(()=>act(s,'helper-dev',{type:'scan',eventId:'quantum',token:s.entries[0].attendees[0].token}),/no active/);
 assert.equal(eventTotals(s,'robot').confirmed,0);assert.equal(eventTotals(s,'robot').absent,0);assert.equal(eventTotals(s,'robot').pending,1);
});
test('published registration rules cannot be changed after entries and capacity never overconfirms',()=>{
 const s=seedState(),r=register(s);const e=s.events.find(e=>e.id==='quantum')!;
 assert.throws(()=>act(s,'dev',{type:'event',event:{...e,title:'Edited event title'}}),/Registrations exist/);
 e.capacity=1;assert.throws(()=>act(s,'dev',{type:'verifyPayment',entryId:r.id,approved:true,note:''}),/Capacity/);
 assert.equal(r.status,'PAYMENT_VERIFICATION_PENDING');
});
