import React,{useRef} from 'react';
import {dayPeriods,periodFor} from './dayPeriods';
export default function PeriodTabs({value,onChange,habits,date}){
 const buttons=useRef([]);
 function keyboard(e,index){
  let next;if(e.key==='ArrowRight')next=(index+1)%dayPeriods.length;else if(e.key==='ArrowLeft')next=(index+dayPeriods.length-1)%dayPeriods.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=dayPeriods.length-1;else return;
  e.preventDefault();onChange(dayPeriods[next].id);buttons.current[next]?.focus();
 }
 return <div className="period-tabs" role="tablist" aria-label="Períodos do dia">{dayPeriods.map((p,i)=>{const items=habits.filter(h=>periodFor(h)===p.id),done=items.filter(h=>h.logs.includes(date)).length;return <button type="button" key={p.id} ref={el=>buttons.current[i]=el} id={'period-tab-'+p.id} role="tab" aria-selected={value===p.id} aria-controls="period-panel" tabIndex={value===p.id?0:-1} className={value===p.id?'selected':''} onClick={()=>onChange(p.id)} onKeyDown={e=>keyboard(e,i)}><strong>{p.label}</strong><span aria-label={`${done} de ${items.length} concluídos`}>{done}/{items.length}</span></button>;})}</div>;
}
