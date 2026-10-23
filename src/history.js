import {key, scheduled, streak} from './model.js';
import {trackedStart} from './habitHistory.js';
export function analyze(habits, days=30, now=new Date()) {
 const today=key(now), dates=Array.from({length:days},(_,i)=>{const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-days+1+i);return d;});
 const rows=habits.map(h=>{const start=trackedStart(h,today);const eligible=dates.filter(d=>key(d)>=start&&scheduled(h,d));const completed=eligible.filter(d=>h.logs.includes(key(d))).length;return {...h,completed,expected:eligible.length,rate:eligible.length?Math.round(completed/eligible.length*100):0,sequence:streak(h,now)};});
 const daily=dates.map(d=>{const k=key(d);const available=rows.filter(h=>k>=(trackedStart(h,today))&&scheduled(h,d));const done=available.filter(h=>h.logs.includes(k)).length;return {date:k,done,expected:available.length,rate:available.length?Math.round(done/available.length*100):0};});
 const total=habits.reduce((n,h)=>n+new Set(h.logs.filter(l=>l<=today)).size,0),xp=total*10,completed=rows.reduce((n,h)=>n+h.completed,0),expected=rows.reduce((n,h)=>n+h.expected,0);
 return {rows,daily,total,xp,level:Math.floor(xp/100)+1,levelProgress:xp%100,completed,expected,rate:expected?Math.round(completed/expected*100):0,activeDays:daily.filter(d=>d.done>0).length};
}
