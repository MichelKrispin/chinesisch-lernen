import{state}from"./state.js";
import{card,update,today}from"./progress.js";
const steps=[1,2,4,7,14,30,60,120];
const started=c=>!!(c.seen||c.n);
export const dueItems=()=>state.vocabulary.filter(v=>started(card(v.id))&&card(v.id).d<=today()).sort((a,b)=>card(a.id).d-card(b.id).d);
// Lesson order guides introductions; retention and transfer checks mark mastery, not access.
export const unlockedLessons=()=>state.lessons;
export function lessonReady(lesson){return !!lesson&&lesson.items.every(id=>card(id).skills.meaning>=2&&card(id).skills.production>=2&&card(id).skills.listening>=2&&card(id).skillDays.meaning.length>=2&&card(id).skillDays.production.length>=2&&card(id).skillDays.listening.length>=2)}
export function lessonMastered(lesson){return lessonReady(lesson)&&state.progress.lessons?.[lesson.id]?.passed===true}
export const currentLesson=()=>state.lessons.find(l=>l.items.some(id=>!started(card(id))))||state.lessons.find(l=>!lessonMastered(l));
export const newItems=()=>{const ids=[...new Set(state.lessons.flatMap(l=>l.items))],byId=new Map(state.vocabulary.map(v=>[v.id,v]));return ids.filter(id=>byId.has(id)&&!started(card(id))).slice(0,Math.max(1,Math.min(20,Number(state.settings.dailyNew)||5))).map(id=>byId.get(id))};
export function practiceItems(){return state.vocabulary.filter(v=>started(card(v.id))).sort((a,b)=>{const ac=card(a.id),bc=card(b.id),weak=c=>Math.min(c.skills.meaning,c.skills.production,c.skills.listening);return(ac.practicedAt||0)-(bc.practicedAt||0)||weak(ac)-weak(bc)}).slice(0,Math.max(5,Number(state.settings.dailyNew)||5))}
export function rate(id,rating){
 const c=card(id),day=today(),success=rating!=="again";
 const patch={n:c.n+(success?1:0),f:c.f+(success?0:1),l:day,practicedAt:Date.now()};
 // Extra same-day practice must not turn short-term recall into a long interval.
 if(!success)Object.assign(patch,{s:Math.max(0,c.s-1),i:0,d:day+1,reviewedDay:day});
 else if(c.reviewedDay!==day&&(!c.n||c.d<=day)){
  const i=!c.n?0:Math.min(steps.length-1,c.i+(rating==="easy"?2:rating==="good"?1:0));
  Object.assign(patch,{s:Math.min(9,c.s+1),i,d:day+(rating==="hard"?1:steps[i]),reviewedDay:day});
 }
 update(id,patch);return card(id)
}
export function sessionItems(mode){if(mode==="review")return dueItems();if(mode==="practice")return practiceItems();if(mode==="new")return newItems();return[...dueItems(),...newItems()]}
