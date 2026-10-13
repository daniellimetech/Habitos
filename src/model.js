import {extraFields} from './goals.js';
import {key} from './dates.js';
export {key};
export function scheduled(habit, date) { return habit.days.includes(date.getDay()); }
export function streak(habit, today = new Date()) {
 let count=0; const date=new Date(today); date.setHours(12,0,0,0);
 if(scheduled(habit,date) && !habit.logs.includes(key(date))) date.setDate(date.getDate()-1);
 for(let i=0;i<3660;i++){if(scheduled(habit,date)){if(!habit.logs.includes(key(date))) break; count++;}date.setDate(date.getDate()-1);}return count;
}
export function validateImport(value) {
 if(!Array.isArray(value)||value.length>200) throw new Error('Arquivo inválido.');
 const ids=new Set();return value.map(h=>{if(!h||typeof h.id!=='string'||ids.has(h.id)||typeof h.name!=='string'||!h.name.trim()||h.name.length>80||!Array.isArray(h.days)||!h.days.length||h.days.some(d=>!Number.isInteger(d)||d<0||d>6)||!Array.isArray(h.logs)||h.logs.some(d=>typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d)))throw new Error('Arquivo inválido.');ids.add(h.id);return {...extraFields(h),...(typeof h.createdAt==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(h.createdAt)?{createdAt:h.createdAt}:{}),id:h.id,name:h.name,category:['Saúde','Aprendizado','Bem-estar','Pessoal'].includes(h.category)?h.category:'Pessoal',color:['green','blue','orange','purple'].includes(h.color)?h.color:'green',days:[...new Set(h.days)],logs:[...new Set(h.logs)]};});
}
