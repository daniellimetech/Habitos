import {test} from 'node:test';
import {PGlite} from '@electric-sql/pglite';import fs from 'node:fs';import assert from 'node:assert/strict';
test('PostgreSQL: isolamento, acesso anônimo, gravação atômica e migração reaplicável',async()=>{
const db=new PGlite();await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated; insert into auth.users values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');`);
const schema=fs.readFileSync(new URL('./schema.sql',import.meta.url),'utf8');await db.exec(schema);await db.exec(schema);
await db.exec(`set role anon;`);await assert.rejects(db.query(`select public.save_habits('[]',0)`),e=>e.code==='42501');await assert.rejects(db.query(`select * from public.habit_accounts`),e=>e.code==='42501');
await db.exec(`reset role; set role authenticated; set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';`);
assert.equal((await db.query(`select public.save_habits('[{"id":"a"}]',0) as revision`)).rows[0].revision,1);
await assert.rejects(db.query(`select public.save_habits('[]',0)`),e=>e.code==='40001');assert.equal((await db.query(`select public.save_habits('[{"id":"b"}]',1) as revision`)).rows[0].revision,2);
await assert.rejects(db.query(`select public.save_habits('[]',1)`),e=>e.code==='40001');await assert.rejects(db.query(`update public.habit_accounts set habits='[]'`),e=>e.code==='42501');
assert.equal((await db.query('select habits from public.habit_accounts')).rows[0].habits[0].id,'b');
await db.exec(`set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';`);assert.equal((await db.query('select * from public.habit_accounts')).rows.length,0);await db.query(`select public.save_habits('[]',0)`);assert.equal((await db.query('select * from public.habit_accounts')).rows.length,1);
await db.close();
});
