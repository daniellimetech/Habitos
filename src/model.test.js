import {test} from 'node:test';
import assert from 'node:assert/strict';
import {key,scheduled,streak,validateImport} from './model.js';
test('datas usam o calendário local e frequência respeita o dia',()=>{const d=new Date(2026,9,12,12);assert.equal(key(d),'2026-10-12');assert.equal(scheduled({days:[1]},d),true);assert.equal(scheduled({days:[0]},d),false);});
test('sequências ignoram dias não programados e toleram hoje pendente',()=>{const h={days:[1,3,5],logs:['2026-10-09','2026-10-07','2026-10-05']};assert.equal(streak(h,new Date(2026,9,12,12)),3);assert.equal(streak({...h,logs:['2026-10-09','2026-10-05']},new Date(2026,9,12,12)),1);});
test('importação valida os dados e rejeita IDs repetidos ou dias inválidos',()=>{const h={id:'a',name:'Ler',category:'Aprendizado',color:'blue',days:[1],logs:['2026-10-12']};assert.deepEqual(validateImport([h]),[h]);assert.throws(()=>validateImport([h,h]));assert.throws(()=>validateImport([{...h,days:[7]}]));assert.throws(()=>validateImport([{...h,logs:['invalid']} ]));});
