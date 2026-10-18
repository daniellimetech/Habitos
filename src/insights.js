import {key,scheduled} from './model.js';
import {amountFor} from './goals.js';
export function dashboardInsights(habits,now=new Date()){
 const today=key(now),minutes=now.getHours()*60+now.getMinutes();
 const start=h=>h.createdAt||[...h.logs,...Object.keys(h.progress||{})].filter(d=>d<=today).sort()[0]||today;
 const dateAt=offset=>{const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d;};
 const rows=habits.map(h=>{const eligible=Array.from({length:14},(_,i)=>dateAt(i-14)).filter(d=>key(d)>=start(h)&&scheduled(h,d));const done=eligible.filter(d=>h.logs.includes(key(d))).length;return {habit:h,expected:eligible.length,done,rate:eligible.length?Math.round(done/eligible.length*100):null,missed:eligible.length-done};});
 const scheduledToday=habits.filter(h=>scheduled(h,now)&&start(h)<=today),completed=scheduledToday.filter(h=>h.logs.includes(today)),pending=scheduledToday.filter(h=>!h.logs.includes(today));
 const time=h=>h.time?Number(h.time.slice(0,2))*60+Number(h.time.slice(3)):null;
 const rank=h=>amountFor(h,today)>0?0:time(h)!==null&&time(h)<=minutes?1:time(h)!==null?2:3;
 const focus=[...pending].sort((a,b)=>rank(a)-rank(b)||(time(a)??1440)-(time(b)??1440))[0]||null;
 const attention=rows.filter(r=>r.expected>=3&&r.rate<60).sort((a,b)=>a.rate-b.rate||b.missed-a.missed);
 const stable=rows.filter(r=>r.expected>=3&&r.rate>=80).sort((a,b)=>b.rate-a.rate);
 const compare=(min,max)=>{let expected=0,done=0;for(const h of habits)for(let n=min;n<=max;n++){const d=dateAt(n);if(key(d)>=start(h)&&scheduled(h,d)){expected++;if(h.logs.includes(key(d)))done++;}}return {expected,done,rate:expected?Math.round(done/expected*100):null};};
 const current=compare(-7,-1),previous=compare(-14,-8);
 const dates=Array.from({length:7},(_,i)=>dateAt(i-6));
 const matrix=rows.map(r=>({...r,cells:dates.map(d=>{const date=key(d),eligible=date>=start(r.habit)&&scheduled(r.habit,d);return {date,eligible,status:!eligible?'off':r.habit.logs.includes(date)?'done':amountFor(r.habit,date)>0?'partial':date===today?'pending':'missing'};})}));
 return {today,rows,scheduledToday,completed,pending,focus,attention,stable,current,previous,delta:current.expected>=3&&previous.expected>=3?current.rate-previous.rate:null,dates,matrix,partial:pending.filter(h=>amountFor(h,today)>0).length,remainingMinutes:pending.filter(h=>h.goal?.unit==='minutos').reduce((sum,h)=>sum+Math.max(0,h.goal.target-amountFor(h,today)),0)};
}
