export const dayPeriods=[{id:'anytime',label:'Sem horário',range:'Quando couber no seu dia'},{id:'morning',label:'Manhã',range:'05h–11h59'},{id:'afternoon',label:'Tarde',range:'12h–17h59'},{id:'night',label:'Noite',range:'18h–04h59'}];
export function periodFor(habit){if(!habit.time)return 'anytime';const hour=Number(habit.time.slice(0,2));return hour>=5&&hour<12?'morning':hour>=12&&hour<18?'afternoon':'night';}
export function groupByPeriod(habits){return dayPeriods.map(p=>({...p,habits:habits.filter(h=>periodFor(h)===p.id)}));}
