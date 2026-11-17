import {key,scheduled} from './model.js';
export function calendarDays(month){const first=new Date(month.getFullYear(),month.getMonth(),1,12);first.setDate(first.getDate()-(first.getDay()+6)%7);return Array.from({length:42},(_,i)=>{const d=new Date(first);d.setDate(d.getDate()+i);return d;});}
export function plannerDates(view,month,selected){if(view==='month')return calendarDays(month);const start=new Date(selected+'T12:00:00');if(view==='day')return [start];start.setDate(start.getDate()-(start.getDay()+6)%7);return Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d;});}
export function shiftPlannerDate(view,month,selected,delta){const d=new Date(selected+'T12:00:00');if(view==='month'){const next=new Date(month.getFullYear(),month.getMonth()+delta,1,12);next.setDate(Math.min(d.getDate(),new Date(next.getFullYear(),next.getMonth()+1,0).getDate()));return next;}d.setDate(d.getDate()+delta*(view==='week'?7:1));return d;}
export function calendarItems(items,date){const day=key(date);return items.filter(h=>{if(h.type==='reminder')return h.date===day;const start=h.createdAt||[...h.logs,...Object.keys(h.progress||{})].sort()[0]||day;return h.logs.includes(day)||(scheduled(h,date)&&day>=start);}).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')||a.name.localeCompare(b.name,'pt-BR'));}
const escapeICS=s=>s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
export function reminderICS(h,now=new Date()){
 const at=new Date(h.date+'T'+h.time+':00');if(h.type!=='reminder'||!Number.isFinite(at.getTime()))throw new Error('Lembrete inválido.');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ritmo//Lembretes//PT-BR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+escapeICS(h.id)+'@ritmo','DTSTAMP:'+utc(now),'DTSTART:'+utc(at),'SUMMARY:'+escapeICS(h.name),'DESCRIPTION:Lembrete pontual criado no Ritmo.','BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+escapeICS(h.name),'TRIGGER:-PT'+(h.notifyBefore??10)+'M','END:VALARM','END:VEVENT','END:VCALENDAR'];
 const encoder=new TextEncoder(),fold=line=>{let result='',part='';for(const ch of line){if(encoder.encode(part+ch).length>73){result+=part+'\r\n';part=' ';}part+=ch;}return result+part;};return lines.map(fold).join('\r\n')+'\r\n';
}
