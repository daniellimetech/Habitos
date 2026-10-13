import React,{createContext,useContext,useEffect,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
const ThemeContext=createContext(null);
export function ThemeProvider({children}){
 const [preference,setPreference]=useState(()=>{try{const saved=localStorage.getItem('ritmo-theme');return ['light','dark','system'].includes(saved)?saved:'system';}catch{return 'system';}});
 const [warning,setWarning]=useState('');
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const apply=()=>{const resolved=preference==='system'?(media.matches?'dark':'light'):preference;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#101217':'#f5f6fa');};
  apply();media.addEventListener('change',apply);return ()=>media.removeEventListener('change',apply);
 },[preference]);
 useEffect(()=>{const sync=e=>{if(e.key==='ritmo-theme')setPreference(['light','dark','system'].includes(e.newValue)?e.newValue:'system');};window.addEventListener('storage',sync);return ()=>window.removeEventListener('storage',sync);},[]);
 const choose=value=>{setPreference(value);try{localStorage.setItem('ritmo-theme',value);setWarning('');}catch{setWarning('O tema foi aplicado, mas este navegador não permitiu salvar sua preferência.');}};
 return <ThemeContext.Provider value={{preference,choose,warning}}>{children}</ThemeContext.Provider>;
}
export function ThemeControl({compact=false}){
 const {preference,choose,warning}=useContext(ThemeContext);
 return <div className={'theme-control '+(compact?'compact':'')}><div className="theme-options" role="group" aria-label="Tema da aparência">{[[Sun,'light','Claro'],[Moon,'dark','Escuro'],[Monitor,'system','Sistema']].map(([Icon,value,label])=><button type="button" key={value} aria-label={label} title={label} aria-pressed={preference===value} onClick={()=>choose(value)}><Icon size={16}/><span>{label}</span></button>)}</div>{warning&&!compact&&<p role="status">{warning}</p>}</div>;
}
