export function orderedHabits(habits){
 return [...habits].sort((a,b)=>{
  if(Number.isInteger(a.order)||Number.isInteger(b.order))return (a.order??Infinity)-(b.order??Infinity);
  return (a.time||'99:99').localeCompare(b.time||'99:99');
 });
}
export function moveHabit(habits,id,direction,visibleIds){
 const sorted=orderedHabits(habits),visible=new Set(visibleIds),subset=sorted.filter(h=>visible.has(h.id));
 const from=subset.findIndex(h=>h.id===id),to=from+direction;
 if(![-1,1].includes(direction)||from<0||to<0||to>=subset.length)return habits;
 const a=sorted.findIndex(h=>h.id===id),b=sorted.findIndex(h=>h.id===subset[to].id);
 [sorted[a],sorted[b]]=[sorted[b],sorted[a]];
 return sorted.map((h,order)=>({...h,order}));
}
