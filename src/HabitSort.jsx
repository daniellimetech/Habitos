import React,{createContext,useContext,useState} from 'react';
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
export function SortableHabit({habit,disabled,className,children}){
 const {attributes,listeners,setNodeRef,setActivatorNodeRef,transform,transition,isDragging}=useSortable({id:habit.id,disabled});
 return <HandleContext.Provider value={{attributes,listeners,setActivatorNodeRef,disabled,name:habit.name}}><div ref={setNodeRef} id={'habit-'+habit.id} data-habit-id={habit.id} tabIndex={-1} className={className+(isDragging?' is-dragging':'')} style={{transform:CSS.Transform.toString(transform),transition}}>{children}</div></HandleContext.Provider>;
}
export function HabitDragHandle(){
 const {attributes,listeners,setActivatorNodeRef,disabled,name}=useContext(HandleContext);
 return <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} disabled={disabled} className="habit-drag-handle" aria-label={'Segure e arraste '+name} title="Segure e arraste para mover" onContextMenu={e=>e.preventDefault()}><GripVertical size={18}/></button>;
}
