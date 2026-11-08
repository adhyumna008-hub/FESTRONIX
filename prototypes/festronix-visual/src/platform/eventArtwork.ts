/** Browser-local prototype artwork, not a hosted upload or a storage-provider choice. */
export interface EventArtwork {dataUrl:string;name:string}
export const MAX_EVENT_ARTWORK_BYTES=300*1024;
export const MAX_TOTAL_ARTWORK_BYTES=1500*1024;
const supported=['image/png','image/jpeg','image/webp'];
const ascii=(bytes:Uint8Array,start:number,end:number)=>String.fromCharCode(...bytes.slice(start,end));
const u32=(bytes:Uint8Array,offset:number)=>new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(offset);
const u24=(bytes:Uint8Array,offset:number)=>bytes[offset]+bytes[offset+1]*256+bytes[offset+2]*65536;

function dimensions(bytes:Uint8Array,mime:string):[number,number] {
 if(mime==='image/png'){
  if(bytes.length<57||![137,80,78,71,13,10,26,10].every((value,index)=>bytes[index]===value)||u32(bytes,8)!==13||ascii(bytes,12,16)!=='IHDR')throw new Error('Choose a valid PNG image.');
  if(ascii(bytes,bytes.length-8,bytes.length-4)!=='IEND')throw new Error('The PNG image is incomplete.');
  return [u32(bytes,16),u32(bytes,20)];
 }
 if(mime==='image/jpeg'){
  if(bytes.length<20||bytes[0]!==255||bytes[1]!==216||bytes[bytes.length-2]!==255||bytes[bytes.length-1]!==217)throw new Error('Choose a valid JPEG image.');
  for(let i=2;i+8<bytes.length;){
   if(bytes[i]!==255)break;
   while(bytes[i]===255)i++;
   const marker=bytes[i++];
   if(marker===218||marker===217)break;
   const length=bytes[i]*256+bytes[i+1];
   if(length<2||i+length>bytes.length)break;
   if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker))return [bytes[i+5]*256+bytes[i+6],bytes[i+3]*256+bytes[i+4]];
   i+=length;
  }
  throw new Error('The JPEG image has no readable dimensions.');
 }
 if(bytes.length<30||ascii(bytes,0,4)!=='RIFF'||ascii(bytes,8,12)!=='WEBP'||new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(4,true)+8!==bytes.length)throw new Error('Choose a valid WebP image.');
 const chunk=ascii(bytes,12,16);
 if(chunk==='VP8X')return [1+u24(bytes,24),1+u24(bytes,27)];
 if(chunk==='VP8L'&&bytes[20]===47)return [1+bytes[21]+((bytes[22]&63)<<8),1+(bytes[22]>>6)+(bytes[23]<<2)+((bytes[24]&15)<<10)];
 if(chunk==='VP8 '&&ascii(bytes,23,26)==='\x9d\x01\x2a')return [(bytes[26]+bytes[27]*256)&16383,(bytes[28]+bytes[29]*256)&16383];
 throw new Error('The WebP image has no readable dimensions.');
}

export function validateEventArtwork(value:unknown):EventArtwork|undefined {
 if(value===undefined)return;
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Choose an event banner from your device.');
 const record=value as Record<string,unknown>;
 if(Object.keys(record).some(key=>!['dataUrl','name'].includes(key))||typeof record.dataUrl!=='string'||typeof record.name!=='string'||!record.name.trim()||record.name.length>120||/[\u0000-\u001f]/.test(record.name))throw new Error('The event banner metadata is invalid.');
 const match=record.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
 if(!match||match[2].length>Math.ceil(MAX_EVENT_ARTWORK_BYTES/3)*4)throw new Error('Use a JPEG, PNG or WebP image up to 300 KiB. SVG and remote image links are not accepted.');
 let binary:string;try{binary=atob(match[2])}catch{throw new Error('The event banner data is invalid.');}
 if(binary.length>MAX_EVENT_ARTWORK_BYTES)throw new Error('Keep the event banner under 300 KiB in this local demo.');
 const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));
 const [width,height]=dimensions(bytes,match[1]);
 if(!width||!height||width>8192||height>8192||width*height>24000000)throw new Error('Use an image no larger than 8192 pixels per side and 24 megapixels.');
 return {dataUrl:record.dataUrl,name:record.name.trim()};
}

export function artworkBytes(artwork:EventArtwork|undefined){if(!artwork)return 0;const base64=artwork.dataUrl.slice(artwork.dataUrl.indexOf(',')+1);return base64.length*3/4-(base64.endsWith('==')?2:base64.endsWith('=')?1:0)}

/** Read-time guard protects older/imported browser records; invalid art becomes a neutral fallback. */
export function safeEventArtwork(value:unknown){try{return validateEventArtwork(value)}catch{return undefined}}

export async function readEventArtwork(file:File):Promise<EventArtwork> {
 if(!supported.includes(file.type)||file.size>MAX_EVENT_ARTWORK_BYTES)throw new Error('Choose a JPEG, PNG or WebP image up to 300 KiB.');
 const dataUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read that image. Choose another file.'));reader.readAsDataURL(file)});
 const artwork=validateEventArtwork({dataUrl,name:file.name.replace(/.*[\\/]/,'').replace(/[\u0000-\u001f]/g,'').slice(0,120)})!;
 await new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve();image.onerror=()=>reject(new Error('This file could not be decoded as an image. Choose another banner.'));image.src=artwork.dataUrl});
 return artwork;
}
