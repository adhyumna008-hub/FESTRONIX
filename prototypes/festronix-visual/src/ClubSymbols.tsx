export const campusClubs = [
 {id:'gaming',name:'Game Development',note:'Design. Code. Play-test.',label:'GAME DEV'},
 {id:'sdc',name:'Student Developers Club',note:'Ideas into working things.',label:'BUILD'},
 {id:'literature',name:'AI & Data',note:'Model. Evaluate. Explain.',label:'AI & DATA'},
 {id:'cine',name:'Robotics & Electronics',note:'Engineer a working system.',label:'ENGINEER'},
 {id:'otaku',name:'Cybersecurity',note:'Understand. Defend. Secure.',label:'SECURE'},
] as const;

// Original flat category symbols, not official club identities.
export function ClubSymbol({id}:{id:string}) {
 return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {id==='gaming'?<><path d="M26 25h28c8 0 12 8 15 26 2 12-5 17-12 10l-9-9H32l-9 9c-7 7-14 2-12-10 3-18 7-26 15-26Z"/><path d="M23 36v15m-7-7h14"/><circle cx="53" cy="38" r="2" fill="currentColor"/><circle cx="60" cy="46" r="2" fill="currentColor"/></>:
   id==='sdc'?<><path d="m25 22-17 18 17 18m30-36 17 18-17 18M46 14 34 66"/></>:
   id==='literature'?<><path d="M18 18 40 40 62 18M18 62l22-22 22 22M18 18v44m44-44v44"/><circle cx="18" cy="18" r="7"/><circle cx="62" cy="18" r="7"/><circle cx="40" cy="40" r="9"/><circle cx="18" cy="62" r="7"/><circle cx="62" cy="62" r="7"/></>:
   id==='cine'?<><rect x="16" y="22" width="48" height="40" rx="7"/><path d="M40 12v10m-5-10h10M8 34h8m48 0h8M25 62v9m30-9v9M28 50h24"/><circle cx="28" cy="37" r="4"/><circle cx="52" cy="37" r="4"/></>:
   <><path d="M40 8 66 18v22c0 16-11 26-26 33-15-7-26-17-26-33V18Z"/><rect x="29" y="34" width="22" height="21" rx="3"/><path d="M33 34v-7a7 7 0 0 1 14 0v7M40 43v5"/></>}
 </svg>;
}
