import {useState,useRef,useEffect} from 'react';
import {cloud} from './cloud.js';
import {validateImport} from './model.js';
import {loadCloud,saveCloud,mergeHabits} from './storage.js';
export function readLocal(){try{const raw=localStorage.getItem('ritmo-v1');return raw?validateImport(JSON.parse(raw)):null;}catch{return null;}}
export function useHabitStore(user,initial){
 const [habits,update]=useState(()=>user?[]:readLocal()||initial),[loading,setLoading]=useState(!!user),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const state=useRef({habits,revision:0}),busy=useRef(false),alive=useRef(true);
 useEffect(()=>()=>{alive.current=false;},[]);
 async function refresh(){if(busy.current)return;busy.current=true;setLoading(true);setError('');try{const data=await loadCloud(cloud,user.id);state.current=data;if(alive.current)update(data.habits);}catch{if(alive.current)setError('Não foi possível carregar seus hábitos. Verifique a conexão e a configuração do banco.');}finally{busy.current=false;if(alive.current)setLoading(false);}}
 useEffect(()=>{if(user)refresh();},[user?.id]);
 async function setHabits(next){
 if(busy.current)return false;busy.current=true;setSaving(true);setError('');
 try{
 const valid=validateImport(typeof next==='function'?next(state.current.habits):next);
 const data=user?await saveCloud(cloud,valid,state.current.revision):{habits:valid,revision:0};
 if(!user)localStorage.setItem('ritmo-v1',JSON.stringify(valid));
 state.current=data;if(alive.current)update(data.habits);return true;
 }catch(e){if(alive.current)setError(e.code==='40001'?'Outro dispositivo alterou os dados. Atualize a conta e repita sua alteração.':'Não foi possível salvar. Sua alteração não foi confirmada. Verifique a conexão e tente novamente.');return false;}
 finally{busy.current=false;if(alive.current)setSaving(false);}
 }
 async function migrate(){const local=readLocal();if(!local?.length)return false;try{return await setHabits(mergeHabits(state.current.habits,local));}catch{setError('O backup local excede o limite ou contém dados inválidos. Exporte-o antes de continuar.');return false;}}
 return {habits,setHabits,loading,saving,error,refresh,migrate};
}
