import {key} from './dates.js';
export const units=['minutos','copos','páginas','passos','vezes','ml'];
export function extraFields(h){
 const extra={};
 if(h.time!==undefined&&h.time!==''){if(typeof h.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(h.time))throw new Error('Horário inválido.');extra.time=h.time;}
 if(h.goal!==undefined&&h.goal!==null){if(typeof h.goal!=='object'||!Number.isFinite(h.goal.target)||h.goal.target<=0||h.goal.target>100000||!units.includes(h.goal.unit))throw new Error('Meta inválida.');extra.goal={target:h.goal.target,unit:h.goal.unit};}
 if(h.progress!==undefined){if(!h.progress||typeof h.progress!=='object'||Array.isArray(h.progress))throw new Error('Progresso inválido.');const entries=Object.entries(h.progress);if(entries.some(([date,n])=>!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(n)||n<0||n>100000))throw new Error('Progresso inválido.');extra.progress=Object.fromEntries(entries);}
 return extra;
}
export function amountFor(h,date){return h.progress?.[date]??(h.logs.includes(date)?h.goal?.target||1:0);}
export function recordAmount(h,date,amount,today=key()){
 if(date>today||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!h.goal||!Number.isFinite(amount)||amount<0||amount>100000)throw new Error('Registro inválido.');
 const logs=h.logs.filter(d=>d!==date);if(amount>=h.goal.target)logs.push(date);
 return {...h,progress:{...h.progress,[date]:amount},logs};
}
export function toggleCompletion(h,date){
 const completed=h.logs.includes(date),progress={...h.progress};
 if(h.goal)progress[date]=completed?0:h.goal.target;
 return {...h,...(h.goal?{progress}:{}),logs:completed?h.logs.filter(d=>d!==date):[...h.logs,date]};
}
