import {key,validateImport} from './model.js';
const identity=h=>`${h.time}|${h.name.normalize('NFC').trim().toLocaleLowerCase('pt-BR')}`;
export function parseRoutine(text){
 const lines=text.trim().split(/\r?\n/).filter(l=>l.trim());
 if(!text.trim()||lines.length>200)throw new Error('Cole entre 1 e 200 atividades.');
 return lines.map((line,i)=>{const match=line.trim().match(/^([01]\d|2[0-3]):([0-5]\d)\s*(?:\||[-–—])\s*(.+)$/);if(!match||match[3].trim().length>80)throw new Error(`Linha ${i+1}: use HH:MM | Nome da atividade (até 80 caracteres).`);return {time:`${match[1]}:${match[2]}`,name:match[3].trim()};});
}
export function appendRoutine(existing,rows,days,date=key(),makeId=()=>crypto.randomUUID()){
 const names=new Set(existing.map(identity)),added=[];
 for(const row of rows){if(names.has(identity(row)))continue;names.add(identity(row));added.push({...row,id:makeId(),category:'Pessoal',color:'purple',days,createdAt:date,logs:[]});}
 return {habits:validateImport([...existing,...added]),added:added.length};
}
