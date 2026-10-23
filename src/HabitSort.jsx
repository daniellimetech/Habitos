import React,{createContext,useContext,useState,useRef} from 'react';
import {createPortal} from 'react-dom';
import {DndContext,DragOverlay,MouseSensor,TouchSensor,KeyboardSensor,useSensor,useSensors,closestCenter} from '@dnd-kit/core';
import {SortableContext,useSortable,verticalListSortingStrategy,sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {GripVertical} from 'lucide-react';
const HandleContext=createContext(null);
export function HabitSort({habits,disabled,onMove,children}){
 const [activeId,setActiveId]=useState(null),active=habits.find(h=>h.id===activeId);
 const sensors=useSensors(useSensor(MouseSensor,{activationConstraint:{distance:6}}),useSensor(TouchSensor,{activationConstraint:{delay:250,tolerance:8}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));
 const name=id=>habits.find(h=>h.id===id)?.name||'hábito';
 return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({active})=>{if(!disabled)setActiveId(active.id);}} onDragCancel={()=>setActiveId(null)} onDragEnd={({active,over})=>{setActiveId(null);if(!disabled&&over&&active.id!==over.id)onMove(active.id,over.id);}} accessibility={{screenReaderInstructions:{draggable:'Para mover um hábito, pressione espaço, use as setas e pressione espaço novamente para soltar. Escape cancela.'},announcements:{onDragStart:({active})=>`Movendo ${name(active.id)}. Use as setas e espaço para soltar.`,onDragOver:({over})=>over?`Posição de ${name(over.id)}.`:'Fora da lista.',onDragEnd:({active,over})=>over?`Soltou ${name(active.id)} na posição escolhida.`:'Movimento cancelado.',onDragCancel:()=> 'Movimento cancelado.'}}}><SortableContext items={habits.map(h=>h.id)} strategy={verticalListSortingStrategy}>{children}</SortableContext>{createPortal(<DragOverlay dropAnimation={null}>{active?<div className="habit-drag-preview"><GripVertical size={20}/><div><strong>{active.name}</strong><small>{active.time?active.time+' · ':''}Solte na nova posição</small></div></div>:null}</DragOverlay>,document.body)}</DndContext>;
}
export function SortableHabit({habit,disabled,className,children,swipe}){
 const {attributes,listeners,setNodeRef,setActivatorNodeRef,transform,transition,isDragging}=useSortable({id:habit.id,disabled});
 const [offset,setOffset]=useState(0),[moving,setMoving]=useState(false),gesture=useRef(null),suppressUntil=useRef(0),actionTouch=useRef(null),lastTouchAction=useRef(0);
 const enabled=!!swipe&&!disabled&&!isDragging;
 function start(e){
  if(!enabled||!e.isPrimary||e.button!==0||e.target.closest('button,input,a,select,textarea'))return;
  gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null,offset:0};
 }
 function move(e){
  const g=gesture.current;if(!g||g.id!==e.pointerId||!enabled)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.axis){if(Math.max(Math.abs(dx),Math.abs(dy))<10)return;g.axis=Math.abs(dx)>Math.abs(dy)*1.4?'x':'y';if(g.axis==='y'){setOffset(0);return;}e.currentTarget.setPointerCapture(e.pointerId);setMoving(true);}
  if(g.axis!=='x')return;
  const allowed=dx>0?swipe.add:swipe.undo;
  g.offset=allowed?Math.max(-96,Math.min(96,dx)):0;setOffset(g.offset);
 }
 function end(e,cancel=false){
  const g=gesture.current;if(!g||g.id!==e.pointerId)return;
  if(g.axis==='x'){suppressUntil.current=Date.now()+350;setOffset(cancel?0:Math.abs(g.offset)>=48?Math.sign(g.offset)*96:0);}
  gesture.current=null;setMoving(false);
 }
 const action=offset>0?swipe?.add:swipe?.undo;
 return <HandleContext.Provider value={{attributes,listeners,setActivatorNodeRef,disabled,name:habit.name}}><div ref={setNodeRef} id={'habit-'+habit.id} data-habit-id={habit.id} tabIndex={-1} className="habit-swipe-shell" style={{transform:CSS.Transform.toString(transform),transition}} onPointerDown={start} onPointerMove={move} onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)} onClickCapture={e=>{if(Date.now()<suppressUntil.current&&!e.target.closest('.habit-swipe-action')){e.preventDefault();e.stopPropagation();}}}>
 {enabled&&action&&offset!==0&&<button type="button" className={'habit-swipe-action '+(offset>0?'swipe-add':'swipe-undo')} aria-label={action.label+' — '+habit.name} onPointerDown={e=>{if(e.pointerType==='touch')actionTouch.current={x:e.clientX,y:e.clientY};}} onPointerCancel={()=>{actionTouch.current=null;}} onPointerUp={e=>{const t=actionTouch.current;actionTouch.current=null;if(e.pointerType==='touch'&&t&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<10){e.preventDefault();lastTouchAction.current=Date.now();suppressUntil.current=Date.now()+350;setOffset(0);action.run();}}} onClick={()=>{if(Date.now()-lastTouchAction.current<500)return;setOffset(0);action.run();}}>{action.label}</button>}
 <div className={className+(isDragging?' is-dragging':'')+(enabled?' swipe-enabled':'')} style={{transform:enabled?`translateX(${offset}px)`:undefined,transition:moving?'none':'transform .18s ease'}}>{children}</div>
 </div></HandleContext.Provider>;
}
export function HabitDragHandle(){
 const {attributes,listeners,setActivatorNodeRef,disabled,name}=useContext(HandleContext);
 return <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} disabled={disabled} className="habit-drag-handle" aria-label={'Segure e arraste '+name} title="Segure e arraste para mover" onContextMenu={e=>e.preventDefault()}><GripVertical size={18}/></button>;
}
