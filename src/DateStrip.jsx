import React,{useLayoutEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {key} from './dates';
export default function DateStrip({selected,today,habits,onSelect,focusToken}){
 const [past,setPast]=useState(90),viewport=useRef(null),buttons=useRef(new Map()),previous=useRef(null),prepend=useRef(null);
 const center=new Date(today+'T12:00:00'),first=new Date(center),last=new Date(center);first.setDate(first.getDate()-past);last.setDate(last.getDate()+14);
 if(selected<key(first)){first.setTime(new Date(selected+'T12:00:00').getTime());first.setDate(first.getDate()-(past-90));}if(selected>key(last))last.setTime(new Date(selected+'T12:00:00').getTime());
 const dates=[];for(let d=new Date(first);d<=last;d.setDate(d.getDate()+1))dates.push(new Date(d));
 useLayoutEffect(()=>{
  const el=viewport.current;if(!el)return;
  if(prepend.current){el.scrollLeft+=el.scrollWidth-prepend.current.width;prepend.current=null;}
  const changed=!previous.current||previous.current.selected!==selected||previous.current.focusToken!==focusToken;
  if(changed){const button=buttons.current.get(selected);if(button){const left=button.getBoundingClientRect().left-el.getBoundingClientRect().left+el.scrollLeft;if(!previous.current||previous.current.focusToken!==focusToken||left<el.scrollLeft||left+button.offsetWidth>el.scrollLeft+el.clientWidth)el.scrollLeft=left;}previous.current={selected,focusToken};}
 },[selected,today,focusToken,past]);
 function older(){const el=viewport.current;if(el)prepend.current={width:el.scrollWidth};setPast(n=>n+30);}
 return <div className="date-browser"><div className="date-browser-tools"><button type="button" onClick={older}>Mais dias anteriores</button><span>{new Date(selected+'T12:00:00').toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</span><div><button type="button" aria-label="Ver dias anteriores" onClick={()=>viewport.current?.scrollBy({left:-viewport.current.clientWidth*.75,behavior:'smooth'})}><ChevronLeft size={17}/></button><button type="button" aria-label="Ver próximos dias" onClick={()=>viewport.current?.scrollBy({left:viewport.current.clientWidth*.75,behavior:'smooth'})}><ChevronRight size={17}/></button></div></div><div className="week-strip date-strip" ref={viewport} role="group" aria-label="Selecionar dia — deslize para consultar outras datas">{dates.map(d=>{const date=key(d);return <button type="button" ref={el=>{if(el)buttons.current.set(date,el);else buttons.current.delete(date);}} key={date} className={selected===date?'selected':''} aria-label={(date===today?'Hoje, ':'')+d.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'})} aria-current={date===today?'date':undefined} aria-pressed={selected===date} onClick={()=>onSelect(date)}><span>{date===today?'Hoje':d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</span><strong>{d.getDate()}</strong><i className={habits.some(h=>h.logs.includes(date))?'has-log':''}/></button>;})}</div></div>;
}
