export const campusClubs = [
 {id:'gaming',name:'Gaming',note:'Play. Compete. Repeat.',label:'PLAY'},
 {id:'sdc',name:'Student Developer Club',note:'Ideas into working things.',label:'BUILD'},
 {id:'literature',name:'Literature',note:'A home for every story.',label:'WRITE'},
 {id:'cine',name:'CINE',note:'Find a different frame.',label:'CREATE'},
 {id:'otaku',name:'OTAKU',note:'Worlds worth getting lost in.',label:'DISCOVER'},
] as const;

// Original flat category symbols, not official club identities.
export function ClubSymbol({id}:{id:string}) {
 return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {id==='gaming'?<><path d="M26 25h28c8 0 12 8 15 26 2 12-5 17-12 10l-9-9H32l-9 9c-7 7-14 2-12-10 3-18 7-26 15-26Z"/><path d="M23 36v15m-7-7h14"/><circle cx="53" cy="38" r="2" fill="currentColor"/><circle cx="60" cy="46" r="2" fill="currentColor"/></>:
   id==='sdc'?<><path d="m25 22-17 18 17 18m30-36 17 18-17 18M46 14 34 66"/></>:
   id==='literature'?<><path d="M40 23c-7-7-18-9-29-6v43c11-3 22-1 29 6 7-7 18-9 29-6V17c-11-3-22-1-29 6Zm0 0v43M20 29l11 3m-11 9 11 3m18-12 11-3m-11 15 11-3"/></>:
   id==='cine'?<><rect x="12" y="27" width="56" height="39" rx="3"/><path d="m12 27-2-12 55-8 2 12-55 8m6-13 9 11m7-13 9 10m7-13 9 10"/><path d="m34 37 16 10-16 10Z"/></>:
   <><path d="m40 8 8 22 24 2-19 15 6 24-19-14-19 14 6-24L8 32l24-2Z"/><path d="m32 39 3 3m10 0 3-3M34 50q6 5 12 0"/></>}
 </svg>;
}
