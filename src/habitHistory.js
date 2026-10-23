import {key,scheduled} from './model.js';
import {amountFor} from './goals.js';
export function trackedStart(habit,today){return habit.createdAt||[...habit.logs,...Object.keys(habit.progress||{})].filter(d=>d<=today).sort()[0]||today;}
export function habitCalendar(habit,days=90,now=new Date()){
 const today=key(now),first=new Date(now);first.setHours(12,0,0,0);first.setDate(first.getDate()-days+1);
 const start=key(first),startTracking=trackedStart(habit,today),gridStart=new Date(first);gridStart.setDate(gridStart.getDate()-(gridStart.getDay()+6)%7);
 const end=new Date(now);end.setHours(12,0,0,0);end.setDate(end.getDate()+(7-end.getDay())%7);
 const cells=[];
 for(let d=new Date(gridStart);d<=end;d.setDate(d.getDate()+1)){
  const date=key(d),inRange=date>=start&&date<=today,amount=amountFor(habit,date);
  const status=!inRange?'blank':habit.logs.includes(date)?'done':amount>0?'partial':date<startTracking?'untracked':!scheduled(habit,d)?'off':date===today?'pending':'missing';
  cells.push({date,status,amount,scheduled:date>=startTracking&&scheduled(habit,d),weekday:d.getDay()});
 }
 return {cells,start,end:today,weeks:cells.length/7};
}
export const historyStatus={done:'Concluído',partial:'Progresso parcial',untracked:'Antes do início do acompanhamento',off:'Não programado',pending:'Pendente hoje',missing:'Sem registro',blank:'Fora do período'};
