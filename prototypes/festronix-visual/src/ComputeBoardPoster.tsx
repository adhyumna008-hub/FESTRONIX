export function ComputeBoardPoster() {
  return <g transform="rotate(-8 400 400)">
    <rect x="110" y="155" width="585" height="480" rx="25" fill="#0d3029" stroke="#608978" strokeWidth="3"/>
    <rect x="120" y="163" width="565" height="458" rx="20" fill="#174d42"/>
    <g fill="none" stroke="#9b9d61" strokeWidth="2" opacity=".7">{Array.from({length:13},(_,i)=><path key={i} d={`M350 ${260+i*17}H${175+i*13}V${540+i%3*16}H640`}/>)}</g>
    <text x="155" y="205" fill="#bbc7b0" fontFamily="monospace" fontSize="14">FESTRONIX / COMPUTE CORE</text>
    <rect x="270" y="280" width="180" height="166" rx="8" fill="#0c1518" stroke="#657575" strokeWidth="3"/>
    <rect x="283" y="293" width="153" height="140" rx="8" fill="#aab9bb"/>
    <path d="M330 334 389 394M389 334 330 394" stroke="#406354" strokeWidth="8"/>
    <rect x="475" y="272" width="185" height="185" rx="17" fill="#253134" stroke="#667c7d" strokeWidth="2"/>
    <circle cx="567" cy="364" r="78" fill="#070e12" stroke="#92a3a4" strokeWidth="4"/>
    <g fill="#647478">{Array.from({length:9},(_,i)=><path key={i} transform={`rotate(${i*40} 567 364)`} d="M578 356Q628 331 635 359Q617 386 579 378Z"/>)}</g>
    <circle cx="567" cy="364" r="20" fill="#b3c1c1"/>
    {Array.from({length:6},(_,i)=><rect key={i} x={151+(i%2)*62} y={250+Math.floor(i/2)*64} width="48" height="32" rx="3" fill="#152125" stroke="#63726b"/>)}
    {Array.from({length:5},(_,i)=><g key={i}><rect x={320+i*53} y="485" width="24" height="56" rx="7" fill="#273d42"/><ellipse cx={332+i*53} cy="485" rx="12" ry="7" fill="#9eacab"/></g>)}
    {Array.from({length:4},(_,i)=><g key={i}><rect x={163+i*124} y="587" width="93" height="48" rx="3" fill="#a5b3b6"/><rect x={173+i*124} y="616" width="73" height="12" fill="#0e171a"/></g>)}
    {[[137,184],[669,184],[137,601],[669,601]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="8" fill="#9aa9ad"/><path d={`M${x-4} ${y}h8`} stroke="#2e4546" strokeWidth="2"/></g>)}
    {[0,1,2].map(i=><circle key={i} cx={185+i*175} cy="557" r="5" fill={i===1?'#d6b568':'#81d0b7'}/>)}
  </g>;
}
