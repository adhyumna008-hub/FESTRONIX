import {useId} from 'react';

/** Original two-dimensional club posters, not official club logos. */
export function ClubArtwork({id}:{id:string}) {
 const pattern=useId().replace(/:/g,'')+'-dots';
 return <svg className="club-artwork" viewBox="0 0 240 264" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs><pattern id={pattern} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".2"/></pattern></defs>
  <rect width="240" height="264" fill={`url(#${pattern})`}/>
  <path d="M18 38V18h20m164 0h20v20M18 226v20h20m164 0h20v-20" stroke="currentColor" strokeOpacity=".24"/>
  {id==='gaming'?<>
   <circle cx="123" cy="130" r="83" stroke="currentColor" strokeOpacity=".18"/><circle cx="123" cy="130" r="65" stroke="currentColor" strokeOpacity=".18"/>
   <path d="m18 184 41-10m133-78 30-9M47 67l9 13m140 116 10 13" stroke="currentColor" strokeWidth="3"/>
   <g className="club-art-subject" transform="rotate(-12 120 132)">
    <path d="M77 94h86c20 0 32 20 40 64 6 32-13 45-32 26l-23-24H92l-22 24c-20 19-38 6-32-26 8-44 20-64 39-64Z" fill="#24342c" transform="translate(0 9)"/>
    <path d="M77 87h86c20 0 32 20 40 64 6 32-13 45-32 26l-23-24H92l-22 24c-20 19-38 6-32-26 8-44 20-64 39-64Z" fill="#f7f5e7" stroke="#24342c" strokeWidth="3"/>
    <path d="M68 108v28m-14-14h28" stroke="#24342c" strokeWidth="8"/>
    <circle cx="161" cy="112" r="6" fill="#ef7648" stroke="#24342c" strokeWidth="2"/><circle cx="179" cy="130" r="6" fill="#a8b482" stroke="#24342c" strokeWidth="2"/>
    <rect x="105" y="112" width="11" height="4" rx="2" fill="#24342c"/><rect x="124" y="112" width="11" height="4" rx="2" fill="#24342c"/>
    <circle cx="101" cy="141" r="10" fill="#bdc9ac" stroke="#24342c" strokeWidth="2"/><circle cx="141" cy="141" r="10" fill="#bdc9ac" stroke="#24342c" strokeWidth="2"/>
   </g>
   <path d="m186 44 4 9 10 2-8 6 1 10-8-6-10 4 4-10-5-8 10 1Z" fill="#ef7648" stroke="#24342c" strokeWidth="1.5"/>
   <path d="m40 210 6-6 6 6m-6-6v19" stroke="currentColor" strokeWidth="2"/><path d="M66 214h102" stroke="currentColor" strokeOpacity=".3"/><rect x="171" y="209" width="31" height="9" fill="currentColor"/>
  </>:id==='sdc'?<>
   <path d="M18 192h25v-33h25m110-87h25v24h19M34 58h22m0-11v22" stroke="currentColor" strokeWidth="2" strokeOpacity=".45"/>
   <circle cx="43" cy="192" r="4" fill="#ef7648"/><circle cx="203" cy="96" r="4" fill="#ef7648"/>
   <g className="club-art-subject" transform="rotate(-8 120 130)">
    <rect x="45" y="70" width="161" height="126" rx="7" fill="#c2c6ae" stroke="#25322a" strokeWidth="2" transform="rotate(13 120 130)"/>
    <rect x="31" y="63" width="171" height="126" rx="7" fill="#26352d" transform="translate(0 9)"/>
    <rect x="31" y="57" width="171" height="126" rx="7" fill="#f9f6e9" stroke="#25322a" strokeWidth="3"/>
    <path d="M32 81h169" stroke="#25322a" strokeWidth="2"/><circle cx="44" cy="69" r="3" fill="#f27a4f"/><circle cx="55" cy="69" r="3" fill="#c2c6ae"/><circle cx="66" cy="69" r="3" fill="#c2c6ae"/>
    <path d="m84 105-18 17 18 17m56-34 18 17-18 17m-20-42-12 50" stroke="#25322a" strokeWidth="6" strokeLinecap="square"/>
    <path d="M49 162h36m8 0h20" stroke="#8a9b7c" strokeWidth="4"/><rect x="123" y="156" width="7" height="12" fill="#ef7648"/>
   </g>
   <rect x="159" y="198" width="49" height="23" rx="3" fill="#ef7648" transform="rotate(7 159 198)"/><path d="m172 206 5 5 9-10" stroke="#24342c" strokeWidth="2.5"/>
  </>:id==='literature'?<>
   <path d="M28 104c29-42 132-64 181-18M37 184c60 37 121 24 169-19" stroke="currentColor" strokeOpacity=".25"/>
   <path d="M44 55h18v17H49v10H39V66c0-7 1-9 5-11Zm33 0h18v17H82v10H72V66c0-7 1-9 5-11Z" fill="#775087" opacity=".6"/>
   <g className="club-art-subject" transform="rotate(9 120 143)">
    <path d="M35 95c30-7 58 1 85 18 27-17 55-25 85-18v107c-29-7-58 0-85 17-27-17-56-24-85-17Z" fill="#48324f" transform="translate(0 7)"/>
    <path d="M40 83c28-6 55 1 80 18 25-17 52-24 80-18v106c-29-6-56 1-80 18-24-17-51-24-80-18Z" fill="#fbf5e6" stroke="#48324f" strokeWidth="2.5"/>
    <path d="M120 101v106M51 180c22-2 41 3 59 13m20 0c18-10 37-15 59-13M57 110l43 10m-43 7 43 10m-43 7 43 10m-43 7 25 6m58-47 43-10m-43 27 43-10m-43 27 43-10m-43 27 25-6" stroke="#77667b" strokeWidth="2"/>
    <path d="M163 87v49l9-9 9 4V84Z" fill="#e68255" stroke="#48324f" strokeWidth="1.5"/>
   </g>
   <path d="m199 53 4 10 10 3-10 4-3 10-4-10-10-3 10-4Z" fill="#fbf5e6" stroke="#48324f" strokeWidth="1.5"/>
  </>:id==='cine'?<>
   <path d="M21 74h198v133H21Z" stroke="currentColor" strokeOpacity=".2"/><path d="M30 84v16m0-16h16m164 0h-16m16 0v16M30 197v-16m0 16h16m164 0h-16m16 0v-16" stroke="currentColor" strokeWidth="2"/>
   <g className="club-art-subject" transform="rotate(-9 123 132)">
    <rect x="51" y="107" width="145" height="94" rx="5" fill="#54362b" transform="translate(0 7)"/>
    <rect x="44" y="99" width="145" height="94" rx="5" fill="#f8f0dd" stroke="#54362b" strokeWidth="3"/>
    <path d="m44 98-7-27 141-34 7 27Z" fill="#54362b" stroke="#54362b" strokeWidth="3"/>
    <path d="m51 67 25 21m4-30 25 23m4-30 25 23m4-30 25 23" stroke="#f8f0dd" strokeWidth="12"/>
    <path d="M45 114h143" stroke="#54362b" strokeWidth="3"/>
    <path d="m104 131 31 20-31 20Z" fill="#dd7248" stroke="#54362b" strokeWidth="2"/>
    <path d="M58 178h24m66 0h25" stroke="#a69c81" strokeWidth="2"/>
   </g>
   <circle cx="191" cy="215" r="4" fill="#54362b"/><path d="M172 215h-38" stroke="#54362b" strokeWidth="2"/>
  </>:<>
   <path d="m33 39 38 39m-48 29 39 7m-24 90 37-34m133-128-43 38m55 33-40 5m30 86-38-34M115 28v30m3 147v29" stroke="currentColor" strokeWidth="2" strokeOpacity=".35"/>
   <g className="club-art-subject" transform="rotate(-9 122 137)">
    <path d="m122 47 19 43 46-10-11 47 42 21-44 21 9 45-45-10-22 42-19-44-45 9 10-44-43-23 45-20-9-44 44 10Z" fill="#31463c" transform="translate(0 6)"/>
    <path d="m120 38 19 43 46-10-11 47 42 21-44 21 9 45-45-10-22 42-19-44-45 9 10-44-43-23 45-20-9-44 44 10Z" fill="#f2edd9" stroke="#31463c" strokeWidth="2.5"/>
    <path d="m121 82 13 38 40 14-39 15-15 39-14-40-38-14 39-14Z" fill="#e47f54" stroke="#31463c" strokeWidth="2"/>
    <path d="m121 109 6 18 19 7-19 7-7 20-7-20-18-7 19-7Z" fill="#31463c"/>
   </g>
   <path d="m196 39 4 10 11 4-11 4-4 11-4-11-10-4 10-4Z" fill="#f2edd9" stroke="#31463c" strokeWidth="1.5"/>
  </>}
 </svg>;
}
