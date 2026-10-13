import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from './history.js';
import {validateImport} from './model.js';
const now=new Date(2026,9,12,12);
const habit={id:'a',name:'Ler',category:'Aprendizado',color:'blue',days:[0,1,2,3,4,5,6],createdAt:'2026-10-10',logs:['2026-10-10','2026-10-11']};
test('não cobra dias anteriores à criação e calcula taxas reais',()=>{const a=analyze([habit],7,now);assert.equal(a.expected,3);assert.equal(a.completed,2);assert.equal(a.rate,67);assert.equal(a.activeDays,2);assert.equal(a.daily[0].expected,0);});
test('XP conta registros únicos, ignora futuro e permite subir de nível',()=>{const a=analyze([{...habit,logs:['2026-10-10','2026-10-10','2026-10-13']}],7,now);assert.equal(a.xp,10);assert.equal(a.level,1);assert.equal(a.levelProgress,10);const b=analyze([{...habit,logs:Array.from({length:10},(_,i)=>`2026-10-${String(i+1).padStart(2,'0')}`)}],30,now);assert.equal(b.level,2);assert.equal(b.levelProgress,0);});
test('histórico antigo começa no primeiro registro e backup preserva criação',()=>{const {createdAt,...old}=habit;assert.equal(analyze([old],30,now).expected,3);assert.equal(validateImport([habit])[0].createdAt,habit.createdAt);assert.equal(analyze([],7,now).rate,0);});
