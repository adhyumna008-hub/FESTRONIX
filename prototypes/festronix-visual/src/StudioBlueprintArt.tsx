/** Decorative programme marks; all essential information remains in semantic HTML. */
export function StudioProgrammeArt(){
 return <svg viewBox="0 0 380 300" className="studio-programme-art" aria-hidden="true" focusable="false">
  <path d="M1 1H379V299H1Z" fill="none" stroke="currentColor" strokeWidth="2"/>
  <path d="M25 25H355V225H25Z" fill="var(--edition-red)"/>
  <path d="M64 58H191V92H103V119H174V153H103V200H64Z" fill="var(--op-bg)"/>
  <g className="studio-programme-cross" fill="var(--op-ink)"><path d="M215 111L240 86L276 122L312 86L337 111L301 147L337 183L312 208L276 172L240 208L215 183L251 147Z"/></g>
  <g stroke="currentColor" fill="none"><path d="M25 242H355M25 278H355M208 242V278M297 242V278"/>{Array.from({length:17},(_,i)=><path key={i} d={`M${26+i*5} 250V270`} strokeWidth={i%3?1:2}/>)}</g>
  <g fill="currentColor" fontFamily="monospace" fontSize="10" letterSpacing="1"><text x="133" y="263">PROGRAMME</text><text x="221" y="263">VCE / F×</text><text x="314" y="263">01</text></g>
 </svg>;
}

export function BlueprintSignalArt(){
 return <svg viewBox="0 0 1000 200" className="blueprint-signal-art" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" strokeWidth="1.5">
   <path d="M1 1H999V199H1ZM250 1V199M500 1V199M750 1V199" opacity=".3"/>
   <path d="M24 100H976" strokeDasharray="3 7" opacity=".35"/>
   <path d="M44 100H83L102 70L126 130L146 70L167 130L185 100H234"/>
   <path d="M269 100H309M441 100H481M324 67H426V133H324Z"/>
   <path d="M342 84H408V116H342ZM355 67V49M374 67V49M393 67V49M412 67V49M355 133V151M374 133V151M393 133V151M412 133V151M324 82H307M324 101H307M324 120H307M426 82H443M426 101H443M426 120H443"/>
   <path d="M520 100H559L625 54L690 100H730M559 100L625 146L690 100M625 54V146"/>
   <circle cx="625" cy="54" r="7" fill="var(--op-bg)"/><circle cx="625" cy="146" r="7" fill="var(--op-bg)"/><circle cx="559" cy="100" r="7" fill="var(--op-bg)"/><circle cx="690" cy="100" r="7" fill="var(--op-bg)"/>
   <path d="M774 100H814M934 100H976M814 56H934V137H814ZM814 121H934M861 137V151M887 137V151M846 152H902M835 103L857 83L874 98L911 69"/>
   <path d="M894 69H911V85"/>
  </g>
  <g fill="currentColor" fontFamily="monospace" fontSize="12" letterSpacing="1.6"><text x="24" y="27">01 / QUESTION</text><text x="274" y="27">02 / PROTOTYPE</text><text x="524" y="27">03 / CONNECT</text><text x="774" y="27">04 / DEMONSTRATE</text></g>
  <g fill="currentColor" fontFamily="monospace" fontSize="10" opacity=".7"><text x="24" y="180">INPUT → POSSIBILITY</text><text x="274" y="180">HARDWARE / SOFTWARE</text><text x="524" y="180">PEOPLE / IDEAS</text><text x="774" y="180">OUTPUT → SOMETHING REAL</text></g>
  <circle className="blueprint-signal-pulse" cx="234" cy="100" r="4" fill="currentColor"/>
 </svg>;
}
