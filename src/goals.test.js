import {test} from 'node:test';import assert from 'node:assert/strict';
import {recordAmount,amountFor,toggleCompletion,adjustAmount} from './goals.js';import {validateImport} from './model.js';import {addProgram,programs} from './programs.js';import {mergeHabits} from './storage.js';
const h={id:'1',name:'Ler',category:'Aprendizado',color:'purple',days:[1],logs:[],time:'09:00',goal:{target:20,unit:'minutos'}};
test('progresso parcial persiste, atingir a meta conclui e reduzir remove a conclusão',()=>{const partial=recordAmount(h,'2026-10-12',10,'2026-10-13');assert.equal(amountFor(partial,'2026-10-12'),10);assert.equal(partial.logs.length,0);const completed=recordAmount(partial,'2026-10-12',20,'2026-10-13');assert.deepEqual(completed.logs,['2026-10-12']);assert.deepEqual(recordAmount(completed,'2026-10-12',5,'2026-10-13').logs,[]);assert.throws(()=>recordAmount(h,'2026-10-14',20,'2026-10-13'));});
test('marcar e desmarcar mantém quantidade coerente sem duplicar registros',()=>{const checked=toggleCompletion(h,'2026-10-12');assert.equal(amountFor(checked,'2026-10-12'),20);assert.equal(amountFor(toggleCompletion(checked,'2026-10-12'),'2026-10-12'),0);});
test('backup preserva metas, horários e progresso e rejeita valores inválidos',()=>{const record=recordAmount(h,'2026-10-12',10,'2026-10-13');assert.deepEqual(validateImport([record]),[record]);assert.throws(()=>validateImport([{...h,time:'25:00'}]));assert.throws(()=>validateImport([{...h,goal:{target:-2,unit:'minutos'}}]));assert.throws(()=>validateImport([{...h,progress:{'2026-10-12':-1}}]));});
test('programas adicionam hábitos válidos uma vez sem alterar os existentes',()=>{let id=0;const first=addProgram([],programs[0],'2026-10-13',()=>String(++id));assert.equal(first.length,3);assert.equal(validateImport(first).length,3);assert.deepEqual(addProgram(first,programs[0]),first);});
test('migração preserva o maior progresso parcial por data',()=>{const result=mergeHabits([{...h,progress:{'2026-10-12':10}}],[{...h,progress:{'2026-10-12':5,'2026-10-11':15}}]);assert.deepEqual(result[0].progress,{'2026-10-12':10,'2026-10-11':15});});

test('contagem registra cada repetição e conclui somente na quinta, sem XP duplicado',()=>{
 let habit={...h,goal:{target:5,unit:'vezes'}};
 for(let i=1;i<=5;i++){habit=adjustAmount(habit,'2026-10-12',1,'2026-10-13');assert.equal(amountFor(habit,'2026-10-12'),i);assert.equal(habit.logs.length,i===5?1:0);}
 habit=adjustAmount(habit,'2026-10-12',1,'2026-10-13');assert.equal(amountFor(habit,'2026-10-12'),5);assert.equal(habit.logs.length,1);
 habit=adjustAmount(habit,'2026-10-12',-1,'2026-10-13');assert.equal(amountFor(habit,'2026-10-12'),4);assert.equal(habit.logs.length,0);
 for(let i=0;i<6;i++)habit=adjustAmount(habit,'2026-10-12',-1,'2026-10-13');assert.equal(amountFor(habit,'2026-10-12'),0);
 assert.throws(()=>adjustAmount(habit,'2026-10-14',1,'2026-10-13'));
});
