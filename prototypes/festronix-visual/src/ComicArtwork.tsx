import {useId} from 'react';

type PanelScene='orbit'|'signal'|'book'|'nodes'|'camera'|'speed';
type PageVariant='cover'|'spread'|'closing';

const scenes:Record<PageVariant,PanelScene[]>={
 cover:['orbit','signal'],
 spread:['book','nodes','camera','signal','orbit','speed'],
 closing:['speed','camera','orbit','nodes','signal','book']
};

/** Original vector panels keep the manga print language without importing franchise artwork. */
function ComicPanelArt({scene,className}:{scene:PanelScene;className:string}){
 const patternId=`comic-dots-${useId().replace(/:/g,'')}`;
 return <svg className={className} viewBox="0 0 320 440" width="320" height="440" fill="none" aria-hidden="true" focusable="false">
  <defs><pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor"/></pattern></defs>
  <path d="M9 10H311V430H9z" fill="var(--comic-page)" stroke="currentColor" strokeWidth="5"/>
  <path d="M18 20H302V420H18z" fill={`url(#${patternId})`} opacity=".13"/>
  <path d="M18 286H302" stroke="currentColor" strokeWidth="5"/>
  <g className={'comic-scene comic-scene-'+scene} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
   {scene==='orbit'&&<>
    <ellipse cx="160" cy="150" rx="111" ry="50" strokeWidth="5" transform="rotate(-28 160 150)"/>
    <ellipse cx="160" cy="150" rx="111" ry="50" strokeWidth="3" transform="rotate(39 160 150)"/>
    <circle cx="160" cy="150" r="28" strokeWidth="6"/><circle cx="246" cy="103" r="10" fill="currentColor"/>
    <path d="M42 350h78l24-34 32 57 25-32h77" strokeWidth="6"/>
    <circle cx="161" cy="150" r="74" strokeWidth="2" strokeDasharray="3 9"/>
   </>}
   {scene==='signal'&&<>
    <path d="M74 192 126 91l44 78 40-53 37 74-73 96-48-43-45 35-36-40z" strokeWidth="7"/>
    <path d="M28 58h105M187 67h91M38 236h60M207 231h75M42 322h60M211 328h66" strokeWidth="3"/>
    <path d="M64 362h193M81 382h156" strokeWidth="2" strokeDasharray="6 10"/>
   </>}
   {scene==='book'&&<>
    <path d="M43 105q67-30 116 10v171q-50-40-116-9zM277 105q-67-30-118 10v171q52-40 118-9z" strokeWidth="7"/>
    <path d="M56 139q49-18 90 7M56 164q49-18 90 7M56 190q49-18 90 7M264 139q-49-18-91 7M264 164q-49-18-91 7M264 190q-49-18-91 7" strokeWidth="3"/>
    <path d="M48 355h224M76 376h168" strokeWidth="4"/>
   </>}
   {scene==='nodes'&&<>
    <path d="M74 116 154 86l91 60-35 84-99 14-37-62zM74 116l37 66m43-96-4 158m95-98-59 84m59-84-98-60m63 144-63 14" strokeWidth="5"/>
    {[['74','116'],['154','86'],['245','146'],['210','230'],['111','244'],['74','182']].map(([cx,cy])=><circle key={cx+cy} cx={cx} cy={cy} r="9" fill="var(--comic-page)" strokeWidth="5"/>)}
    <path d="M44 328h232M62 350h196M81 372h158" strokeWidth="3"/>
   </>}
   {scene==='camera'&&<>
    <path d="M60 112h200l18 27v130H42V139z" strokeWidth="7"/>
    <path d="m94 112 16-31h87l18 31" strokeWidth="7"/>
    <circle cx="160" cy="201" r="57" strokeWidth="7"/><circle cx="160" cy="201" r="32" strokeWidth="4"/>
    <circle cx="244" cy="151" r="7" fill="currentColor"/><path d="M54 326h212M75 350h170M96 374h128" strokeWidth="3"/>
   </>}
   {scene==='speed'&&<>
    <path d="M60 188 147 92l-14 84 105-36-91 115 8-82z" strokeWidth="7"/>
    <path d="M33 106h88M202 95h83M26 132h59M236 122h50M28 278h67M229 271h63" strokeWidth="4"/>
    <path d="M65 337h190M82 358h160M100 379h123" strokeWidth="2" strokeDasharray="7 9"/>
   </>}
  </g>
 </svg>;
}

/** Stable panel arrangements avoid reshuffling artwork on every render. */
export function ComicPageTexture({variant='cover'}:{variant?:PageVariant}){
 const art=scenes[variant];
 if(variant==='cover')return <span className="comic-page-texture comic-page-texture-cover" aria-hidden="true">
  {art.map((scene,index)=><ComicPanelArt key={scene} scene={scene} className={'comic-page-fragment comic-page-fragment-'+index}/>) }
 </span>;
 return <span className={'comic-page-texture comic-page-texture-full comic-page-texture-'+variant} aria-hidden="true">
  <span className="comic-page-collage">{art.map((scene,index)=><ComicPanelArt key={`${scene}-${index}`} scene={scene} className="comic-collage-panel"/>)}</span>
 </span>;
}

/** Original ink, separate from festival content and controls. */
export function ComicBackdrop(){
 return <><ComicPageTexture/><div className="comic-ink-world" aria-hidden="true">
 <svg viewBox="0 0 1200 570" preserveAspectRatio="xMidYMax slice" fill="none">
  <g className="comic-web-ink" stroke="currentColor" strokeWidth="1.1">
   {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M1200 0L${840+i*58} 350`}/>)}
   <path d="M898 0Q987 70 922 130Q1030 160 994 220Q1110 238 1117 325M994 0Q1050 47 1023 88Q1112 106 1082 166Q1150 190 1170 240M1092 0Q1120 26 1120 48Q1170 64 1166 105Q1192 130 1200 135"/>
  </g>
  <g className="comic-city-ink" stroke="currentColor" strokeWidth="1.5">
   <path d="M0 558H1200M0 570V504H42V465H94V490H125V430H184V477H208V385H270V454H305V345H370V455H410V413H466V470H512V378H566V452H599V322H645V290H675V322H712V411H755V370H819V425H850V313H919V391H949V448H1006V373H1058V450H1110V400H1165V460H1200"/>
   {Array.from({length:19},(_,i)=><path key={i} d={`M${22+i*63} 487v26m0 12v22m10-60v26m0 12v22`}/>)}
   <path d="M620 290V253M610 267H632M875 313V262M863 279H887M316 345V315H356V345M533 378V348"/>
  </g>
  <g className="comic-cape-ink" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
   <path d="M878 314L884 232L912 264Q934 255 958 264L985 232L989 312L971 339L965 360Q1022 381 1062 459L1110 551L1028 517L997 547L957 520L918 548L881 517L812 551Q820 425 879 372L901 359L896 337Z"/>
   <path d="M892 293L920 302L896 309ZM975 293L949 302L974 310ZM912 333L934 323L960 334L954 355L922 356ZM923 344H947M886 391L862 500M907 388L899 502M981 390L1026 500M958 382L975 495"/>
  </g>
  <g className="comic-speed-ink" stroke="currentColor" strokeWidth="1"><path d="M734 102L1014 50M777 125L1114 73M731 161L987 122M24 375L310 304M45 394L275 339M5 426L223 370"/></g>
 </svg>
 </div></>;
}

export function ComicMarginCharacter({character='orbit'}:{character?:'orbit'|'ripple'}){
 const orbit=character==='orbit';
 return <button type="button" className={'comic-margin-character comic-margin-'+character} data-comic-power={orbit?6:7} aria-label={orbit?'Play a brief orbit effect':'Play a brief water ripple effect'} title="Hover or tap for a brief effect">
  <svg viewBox="0 0 100 140" width="100" height="140" fill="none" aria-hidden="true" focusable="false">
   {orbit?<><ellipse cx="50" cy="70" rx="37" ry="17" stroke="currentColor" strokeWidth="3" transform="rotate(-35 50 70)"/><ellipse cx="50" cy="70" rx="37" ry="17" stroke="currentColor" strokeWidth="2" transform="rotate(40 50 70)"/><circle cx="50" cy="70" r="15" fill="var(--op-accent)" stroke="currentColor" strokeWidth="3"/><circle cx="79" cy="48" r="5" fill="currentColor"/><path d="m31 105 19-8 19 8v15H31z" fill="var(--op-card)" stroke="currentColor" strokeWidth="3"/><path d="M38 112h23M50 104v15" stroke="currentColor" strokeWidth="2"/></>
    :<><path d="M50 22C46 32 33 45 33 57a17 17 0 0 0 34 0c0-12-13-25-17-35Z" fill="var(--op-accent)" stroke="currentColor" strokeWidth="3"/><path d="M23 91c10-8 44-8 54 0M16 105c14-12 54-12 68 0M26 120c10-7 38-7 48 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="50" cy="56" r="5" fill="var(--op-card)"/></>}
  </svg>
 </button>;
}

export function ComicCredits(){
 return <details className="comic-art-credits"><summary>Artwork notes</summary><p>Decorative comic panels, skyline ink and short motion effects are original vector and canvas artwork created for this prototype. No franchise characters or manga panels are included.</p></details>;
}
