import React from 'react';
import {Droplets,BookOpen,Sunrise,Heart,Footprints,Brain,Briefcase,CalendarCheck,Coffee,Moon,Utensils,ShowerHead,Dumbbell,Flower2,Wallet,Target} from 'lucide-react';
export default function HabitIcon({habit}){
 const name=habit.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const match=[[/agua|hidrata/,Droplets],[/biblia|ler|leitura|pagina/,BookOpen],[/acord|despert/,Sunrise],[/banho/,ShowerHead],[/cafe/,Coffee],[/jantar|almoc|comer|refeic/,Utensils],[/dorm|sono/,Moon],[/agenda|planej|revis/,CalendarCheck],[/trabalh/,Briefcase],[/financ|dinheiro/,Wallet],[/caminh|corr|tenis/,Footprints],[/trein|academ|exerc/,Dumbbell],[/medit|orar|santif/,Flower2],[/estud|aprend/,Brain]].find(([pattern])=>pattern.test(name));
 const Icon=match?.[1]||({'Saúde':Heart,'Aprendizado':BookOpen,'Bem-estar':Flower2}[habit.category])||Target;
 return <Icon size={28} strokeWidth={1.8} aria-hidden="true"/>;
}
