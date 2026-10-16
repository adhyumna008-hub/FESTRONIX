import * as THREE from 'three';
/** Decorative editor pixels on the existing LCD mesh; club information remains DOM text. */
export function developerDisplay(geometry:THREE.BufferGeometry){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const context=canvas.getContext('2d')!;context.fillStyle='#101a20';context.fillRect(0,0,512,512);
  context.fillStyle='#25363d';context.fillRect(0,0,512,52);context.fillStyle='#b5dccb';context.font='19px monospace';context.fillText('SDC / build.js',25,34);
  context.fillStyle='#17262d';context.fillRect(0,52,70,460);context.font='14px monospace';
  const colors=['#c2d4db','#93c2af','#aaa5cf','#c9b998'];
  const rows=['// a little curiosity goes a long way','const idea = createSomething();','','function buildTogether(team) {','  return team.map(member => {','    const question = member.explore();','    return turnIntoSomething(question);','  });','}','','learn();','make();','share();','','// your next chapter starts here'];
  rows.forEach((row,i)=>{const y=92+i*25;context.fillStyle='#647f8a';context.fillText(String(i+1).padStart(2,'0'),22,y);context.fillStyle=colors[i%colors.length];context.fillText(row,84,y);});
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=2;
  geometry.computeBoundingBox();const box=geometry.boundingBox!,position=geometry.getAttribute('position'),uv=new Float32Array(position.count*2);
  for(let i=0;i<position.count;i++){uv[i*2]=(position.getX(i)-box.min.x)/Math.max(.00001,box.max.x-box.min.x);uv[i*2+1]=(position.getY(i)-box.min.y)/Math.max(.00001,box.max.y-box.min.y);}
  geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));return texture;
}
