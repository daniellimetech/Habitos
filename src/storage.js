import {validateImport} from './model.js';
export async function loadCloud(client,userId){
 const {data,error}=await client.from('habit_accounts').select('habits,revision').eq('user_id',userId).maybeSingle();
 if(error)throw error;
 return {habits:data?validateImport(data.habits):[],revision:data?.revision||0};
}
export async function saveCloud(client,habits,revision){
 const valid=validateImport(habits);
 const {data,error}=await client.rpc('save_habits',{p_habits:valid,p_revision:revision});
 if(error)throw error;
 if(!Number.isInteger(data)||data<=revision)throw new Error('Resposta de gravação inválida');
 return {habits:valid,revision:data};
}
export function mergeHabits(remote,local){
 const existing=new Map(remote.map(h=>[h.id,h]));
 for(const h of local){const old=existing.get(h.id);existing.set(h.id,old?{...old,logs:[...new Set([...old.logs,...h.logs])],...((old.progress||h.progress)?{progress:Object.fromEntries([...new Set([...Object.keys(old.progress||{}),...Object.keys(h.progress||{})])].map(d=>[d,Math.max(old.progress?.[d]||0,h.progress?.[d]||0)]))}:{})}:h);}
 return validateImport([...existing.values()]);
}
