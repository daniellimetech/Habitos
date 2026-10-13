import React,{useEffect,useRef,useState} from 'react';
import {Play,Pause,X,Clock} from 'lucide-react';
import {amountFor} from './goals.js';
export default function FocusTimer({habit,date,onSave,onClose,error}){
 const base=useRef(amountFor(habit,date)),savedElapsed=useRef(0),startedAt=useRef(null);
 const duration=Math.max(0,(habit.goal.target-base.current)*60),[elapsed,setElapsed]=useState(0),[running,setRunning]=useState(false);
 const read=()=>Math.min(duration,savedElapsed.current+(startedAt.current===null?0:(performance.now()-startedAt.current)/1000));
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>{const current=read();setElapsed(current);if(current>=duration){savedElapsed.current=duration;startedAt.current=null;setRunning(false);}},200);return ()=>clearInterval(timer);},[running,duration]);
 function toggle(){if(running){savedElapsed.current=read();startedAt.current=null;setElapsed(savedElapsed.current);setRunning(false);}else{startedAt.current=performance.now();setRunning(true);}}
 function close(){if(elapsed>0&&!confirm('Fechar sem registrar o tempo desta sessão?'))return;onClose();}
 const remaining=Math.max(0,Math.ceil(duration-elapsed)),clock=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
 return <div className="modal-backdrop"><div className="modal focus-modal"><div className="panel-heading"><h2>Sessão de foco</h2><button type="button" className="icon-button" aria-label="Fechar sessão" onClick={close}><X/></button></div><p>{habit.name} · {date.split('-').reverse().join('/')}</p><div className="timer-face"><Clock size={22}/><strong role="timer" aria-label="Tempo restante">{clock}</strong><span>{Math.floor(elapsed/60)} minutos nesta sessão</span></div><button className="primary" disabled={remaining===0} onClick={toggle}>{running?<Pause size={18}/>:<Play size={18}/>} {running?'Pausar':'Iniciar'}</button>{error&&<p className="notice" role="alert">{error}</p>}<button className="secondary" disabled={elapsed<1} onClick={async()=>{savedElapsed.current=read();startedAt.current=null;setRunning(false);setElapsed(savedElapsed.current);const amount=Math.min(100000,Math.round((base.current+savedElapsed.current/60)*100)/100);if(await onSave(amount))onClose();}}>Registrar tempo realizado</button><p className="form-help">O tempo é adicionado ao progresso deste dia após salvar. A sessão continua em outra aba, mas fecha se você recarregar a página. Sem alarmes ou notificações.</p></div></div>;
}
