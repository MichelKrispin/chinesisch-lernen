import{state}from"./state.js";import{card,update}from"./progress.js";
const day=()=>Math.floor(Date.now()/864e5),steps=[1,2,4,7,14,30,60,120];
export const dueItems=()=>state.vocabulary.filter(v=>card(v.id).n&&card(v.id).d<=day());
export const newItems=()=>state.vocabulary.filter(v=>!card(v.id).n).slice(0,state.settings.dailyNew);
export function rate(id,rating){const c=card(id),good=rating==="good"||rating==="easy";let s=Math.max(0,Math.min(9,c.s+(good?1:-1)));let idx=rating==="again"?0:Math.min(steps.length-1,Math.max(0,c.i)+(rating==="easy"?2:rating==="good"?1:0));const days=rating==="again"?0:rating==="hard"?1:steps[idx];update(id,{s,n:c.n+(good?1:0),f:c.f+(good?0:1),i:idx,d:day()+days,l:day()});return card(id)}
export function sessionItems(mode){const due=dueItems();return mode==="review"?due:[...due,...newItems()].slice(0,Math.max(5,state.settings.dailyNew+due.length))}
