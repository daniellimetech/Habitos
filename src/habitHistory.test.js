import {test} from 'node:test';
import assert from 'node:assert/strict';
import {habitCalendar,trackedStart} from './habitHistory.js';
const h={id:'a',name:'Ler',days:[1,3,5],createdAt:'2026-10-15',logs:['2026-10-19'],goal:{target:10,unit:'páginas'},progress:{'2026-10-21':4}},now=new Date(2026,9,23,12);
test('mapa alinha semanas de segunda a domingo sem inventar registros',()=>{
 const before=JSON.stringify(h),m=habitCalendar(h,14,now),cell=d=>m.cells.find(c=>c.date===d);
 assert.equal(m.cells[0].weekday,1);assert.equal(m.cells.at(-1).weekday,0);assert.equal(m.cells.length%7,0);assert.equal(m.start,'2026-10-10');assert.equal(m.end,'2026-10-23');
 assert.equal(cell('2026-10-12').status,'untracked');assert.equal(cell('2026-10-16').status,'missing');assert.equal(cell('2026-10-17').status,'off');assert.equal(cell('2026-10-19').status,'done');assert.equal(cell('2026-10-21').status,'partial');assert.equal(cell('2026-10-21').amount,4);assert.equal(cell('2026-10-23').status,'pending');assert.equal(cell('2026-10-24').status,'blank');assert.equal(JSON.stringify(h),before);
});
test('registro antigo fora da frequência atual continua visível; progresso inicia acompanhamento legado',()=>{
 const legacy={...h,createdAt:undefined,logs:[],progress:{'2026-10-01':2}};assert.equal(trackedStart(legacy,'2026-10-23'),'2026-10-01');
 const changed={...h,days:[2],logs:['2026-10-19']};assert.equal(habitCalendar(changed,7,now).cells.find(c=>c.date==='2026-10-19').status,'done');
 const future={...legacy,progress:{'2026-12-01':2}};assert.equal(trackedStart(future,'2026-10-23'),'2026-10-23');
});
test('períodos mostram exatamente os dias pedidos e acomodam fevereiro bissexto',()=>{
 for(const days of [7,30,90,365]){const m=habitCalendar(h,days,new Date(2024,2,1,12));assert.equal(m.cells.filter(c=>c.status!=='blank').length,days);assert.equal(m.weeks*7,m.cells.length);}
 assert.equal(habitCalendar(h,7,new Date(2024,2,1,12)).cells.some(c=>c.date==='2024-02-29'),true);
});
