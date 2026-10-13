import {key} from './model.js';
export const programs=[
 {id:'focus',name:'Foco profundo',description:'Menos distração, mais espaço para suas prioridades.',category:'Aprendizado',color:'blue',icon:'🎯',habits:[['Planejar as prioridades',5,'minutos','08:00'],['Sessão de foco',25,'minutos','09:00'],['Ler e aprender',10,'páginas','19:00']]},
 {id:'body',name:'Corpo em movimento',description:'Hidrate, movimente e recupere sua energia.',category:'Saúde',color:'green',icon:'💚',habits:[['Beber água',8,'copos','08:00'],['Caminhar',20,'minutos','17:30'],['Alongar o corpo',5,'minutos','18:00']]},
 {id:'growth',name:'Aprender um pouco mais',description:'Dê um passo por dia em direção ao que quer dominar.',category:'Aprendizado',color:'orange',icon:'🧠',habits:[['Estudar uma habilidade',20,'minutos','18:00'],['Praticar o que aprendi',10,'minutos','18:30']]},
 {id:'creative',name:'Faísca criativa',description:'Escreva, desenhe e dê vida às suas ideias.',category:'Pessoal',color:'purple',icon:'✨',habits:[['Criar sem distrações',15,'minutos','16:00'],['Anotar novas ideias',3,'vezes','20:00']]},
 {id:'morning',name:'Manhã com intenção',description:'Um começo leve para encontrar seu próprio ritmo.',category:'Bem-estar',color:'orange',icon:'☀️',habits:[['Respirar com calma',3,'minutos','07:00'],['Meditar',5,'minutos','07:10'],['Escrever no diário',5,'minutos','07:20']]}
];
export function addProgram(habits,program,date=key(),makeId=()=>crypto.randomUUID()){
 const names=new Set(habits.map(h=>h.name.toLocaleLowerCase('pt-BR')));
 const added=program.habits.filter(([name])=>!names.has(name.toLocaleLowerCase('pt-BR'))).map(([name,target,unit,time])=>({id:makeId(),name,category:program.category,color:program.color,time,goal:{target,unit},days:[0,1,2,3,4,5,6],createdAt:date,logs:[]}));
 if(habits.length+added.length>200)throw new Error('O limite é de 200 hábitos.');return [...habits,...added];
}
