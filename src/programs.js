import {key} from './model.js';
export const programs=[
 {id:'focus',name:'Foco profundo',description:'Menos distração, mais espaço para suas prioridades.',category:'Aprendizado',color:'blue',icon:'🎯',habits:[['Planejar as prioridades',5,'minutos','08:00'],['Sessão de foco',25,'minutos','09:00'],['Ler e aprender',10,'páginas','19:00']]},
 {id:'body',name:'Corpo em movimento',description:'Hidrate, movimente e recupere sua energia.',category:'Saúde',color:'green',icon:'💚',habits:[['Beber água',8,'copos','08:00'],['Caminhar',20,'minutos','17:30'],['Alongar o corpo',5,'minutos','18:00']]},
 {id:'growth',name:'Aprender um pouco mais',description:'Dê um passo por dia em direção ao que quer dominar.',category:'Aprendizado',color:'orange',icon:'🧠',habits:[['Estudar uma habilidade',20,'minutos','18:00'],['Praticar o que aprendi',10,'minutos','18:30']]},
 {id:'creative',name:'Faísca criativa',description:'Escreva, desenhe e dê vida às suas ideias.',category:'Pessoal',color:'purple',icon:'✨',habits:[['Criar sem distrações',15,'minutos','16:00'],['Anotar novas ideias',3,'vezes','20:00']]},
 {id:'morning',name:'Manhã com intenção',description:'Um começo leve para encontrar seu próprio ritmo.',category:'Bem-estar',color:'orange',icon:'☀️',habits:[['Respirar com calma',3,'minutos','07:00'],['Meditar',5,'minutos','07:10'],['Escrever no diário',5,'minutos','07:20']]},
 {id:'study-weekly',name:'Agenda executável',description:'Sua agenda semanal de Faculdade, TCE-GO, GR e descanso. Repete toda semana, sem substituir os hábitos atuais.',category:'Aprendizado',color:'blue',icon:'📚',featured:true,weekly:true,habits:[
 ['Faculdade',60,'minutos','19:00',[1,3]],
 ['TCE-GO: diagnóstico e questões',60,'minutos','20:00',[1]],
 ['TCE-GO: Banco de Dados e questões',90,'minutos','19:00',[2]],
 ['TCE-GO: Lógica e erros',60,'minutos','20:00',[3]],
 ['GR — sem atividades da Temporada',null,null,'20:00',[4],'Pessoal'],
 ['TCE-GO: Engenharia de Software e questões',90,'minutos','19:00',[5]],
 ['TCE-GO: questões mistas',60,'minutos','08:00',[6]],
 ['Professor Online: validação',120,'minutos','09:00',[6]],
 ['Família, culto e descanso',null,null,'',[0],'Bem-estar']
 ]}
];
export function programHasHabit(habits,program,item){
 const [name,,,time,days]=item;
 return habits.some(h=>h.name.toLocaleLowerCase('pt-BR')===name.toLocaleLowerCase('pt-BR')&&(!program.weekly||(h.time||'')===(time||'')&&h.days.length===days.length&&days.every(d=>h.days.includes(d))));
}
export function addProgram(habits,program,date=key(),makeId=()=>crypto.randomUUID()){
 const added=program.habits.filter(item=>!programHasHabit(habits,program,item)).map(([name,target,unit,time,days,category])=>({id:makeId(),name,category:category||program.category,color:program.color,...(time?{time}:{}),...(target?{goal:{target,unit}}:{}),days:days?[...days]:[0,1,2,3,4,5,6],createdAt:date,logs:[]}));
 if(habits.length+added.length>200)throw new Error('O limite é de 200 hábitos.');return [...habits,...added];
}
export function programHabitSchedule([,target,unit,time,days]){return [...(days?[days.map(d=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d]).join(' / ')]:[]),time||'Sem horário',...(target?[target+' '+unit]:[])].join(' · ');}
