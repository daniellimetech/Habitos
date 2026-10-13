import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadCloud,saveCloud,mergeHabits} from './storage.js';
const h={id:'1',name:'Ler',category:'Aprendizado',color:'green',days:[1],logs:['2026-10-12']};
test('migração une registros sem duplicar e mantém configuração da conta',()=>{const result=mergeHabits([{...h,name:'Ler 5 minutos'}],[{...h,logs:['2026-10-11','2026-10-12']}]);assert.equal(result.length,1);assert.equal(result[0].name,'Ler 5 minutos');assert.deepEqual(result[0].logs,['2026-10-12','2026-10-11']);});
test('save valida antes do envio e propaga erro de concorrência sem confirmar sucesso',async()=>{let calls=0;const client={rpc:async(name,args)=>{calls++;assert.equal(name,'save_habits');assert.equal(args.p_revision,2);return {error:{code:'40001'}};}};await assert.rejects(saveCloud(client,[h],2),e=>e.code==='40001');await assert.rejects(saveCloud(client,[{...h,days:[]}],2));assert.equal(calls,1);});
test('gravação exige confirmação e versão nova',async()=>{const client={rpc:async()=>({data:3,error:null})};assert.deepEqual(await saveCloud(client,[h],2),{habits:[h],revision:3});await assert.rejects(saveCloud({rpc:async()=>({data:2})},[h],2));});
test('carregamento limita consulta ao usuário autenticado e conta nova começa vazia',async()=>{const client={from(table){assert.equal(table,'habit_accounts');return {select(){return {eq(column,user){assert.equal(column,'user_id');assert.equal(user,'user-a');return {maybeSingle:async()=>({data:null})};}};}};}};assert.deepEqual(await loadCloud(client,'user-a'),{habits:[],revision:0});});
