export type EditionLabelStyle='short'|'year'|'custom';

export function editionLabelStyle(label:string):EditionLabelStyle {
 return /^2K\d{2,3}$/i.test(label)?'short':/^\d{4}$/.test(label)?'year':'custom';
}

export function editionLabel(year:number,style:Exclude<EditionLabelStyle,'custom'>='short') {
 return style==='year'?String(year):'2K'+String(year-2000).padStart(2,'0');
}

/** Keep the chosen display style in sync, while preserving deliberate custom labels. */
export function syncEditionLabel(year:number,label:string) {
 const style=editionLabelStyle(label.trim());
 return style==='custom'?label.trim():editionLabel(year,style);
}

/** Retain month/day when changing an unpublished edition's year, clamping leap day. */
export function dateInYear(value:string,year:number) {
 if(!/^\d{4}-\d{2}-\d{2}/.test(value))return value;
 const month=Number(value.slice(5,7)),day=Number(value.slice(8,10));
 const lastDay=new Date(Date.UTC(year,month,0)).getUTCDate();
 return `${year}-${String(month).padStart(2,'0')}-${String(Math.min(day,lastDay)).padStart(2,'0')}`+value.slice(10);
}
