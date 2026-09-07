import{state,defaults}from"./state.js";
const DAY=864e5, prefix="cnlearn_progress_", meta="cnlearn_meta_v1", settingsKey="cnlearn_settings_v1";
const cookieOptions=()=>`; Path=/; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`;
const read=name=>document.cookie.split("; ").find(x=>x.startsWith(name+"="))?.slice(name.length+1)||"";
const write=(name,value,days=730)=>document.cookie=`${name}=${value}; Max-Age=${days*86400}${cookieOptions()}`;
export function loadProgress(){try{const count=Number(read(meta))||0,raw=Array.from({length:count},(_,i)=>read(`${prefix}${i}_v1`)).join("");if(raw)state.progress=validate({schemaVersion:1,progress:JSON.parse(decodeURIComponent(raw))}).progress}catch{state.progress={v:1,c:{}}}try{state.settings={...defaults,...JSON.parse(decodeURIComponent(read(settingsKey)))} }catch{state.settings={...defaults}}}
export function saveProgress(){const raw=encodeURIComponent(JSON.stringify(state.progress)),parts=raw.match(/.{1,3500}/g)||[];const old=Number(read(meta))||0;parts.forEach((p,i)=>write(`${prefix}${i}_v1`,p));for(let i=parts.length;i<old;i++)write(`${prefix}${i}_v1`,"",-1);write(meta,String(parts.length));}
export function saveSettings(){write(settingsKey,encodeURIComponent(JSON.stringify(state.settings)))}
export const today=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/DAY)};
const empty=()=>({s:0,n:0,f:0,i:0,d:0,l:0,w:0,seen:0,skills:{meaning:0,production:0,listening:0,sentence:0,pronunciation:0,writing:0},skillDays:{meaning:[],production:[],listening:[],sentence:[]},confusions:{}});
function normalized(saved){if(!saved)return empty();const legacy=saved.skills?{}:{meaning:Math.min(9,saved.s||0),production:Math.min(9,saved.s||0),listening:Math.min(9,saved.s||0)};return{...empty(),...saved,seen:saved.seen??(saved.n?1:0),skills:{...empty().skills,...legacy,...saved.skills},skillDays:{...empty().skillDays,...saved.skillDays},confusions:{...saved.confusions}}}
export function card(id){return normalized(state.progress.c[id])}
export function update(id,patch){state.progress.c[id]={...card(id),...patch};saveProgress()}
export function introduce(id){const c=card(id);update(id,{seen:(c.seen||0)+1,l:today(),d:today()})}
export function recordSkill(id,skill,correct,confusedWith=""){const c=card(id),skills={...c.skills,[skill]:Math.max(0,Math.min(9,(c.skills[skill]||0)+(correct?1:-1)))},skillDays={...c.skillDays},confusions={...c.confusions};if(correct&&skillDays[skill])skillDays[skill]=[...new Set([...skillDays[skill],today()])].slice(-9);if(!correct&&confusedWith)confusions[confusedWith]=(confusions[confusedWith]||0)+1;update(id,{skills,skillDays,confusions})}
export function recordLessonCheck(id,passed){state.progress.lessons={...state.progress.lessons,[id]:{passed,day:today()}};saveProgress()}
export function reset(){state.progress={v:1,c:{}};saveProgress()}
export function retainedSkill(c,skill){const x=normalized(c),days=x.skillDays[skill]||[];if(!days.length&&x.n>=3)return x.skills[skill];return days.length>=2?x.skills[skill]:Math.min(1,x.skills[skill])}
export function mastery(c){return Math.min(...["meaning","production","listening"].map(k=>retainedSkill(c,k)))}
export function summary(){const cards=Object.values(state.progress.c).map(normalized),day=today();return{started:cards.filter(x=>x.seen||x.n).length,learned:cards.filter(x=>mastery(x)>=2).length,mature:cards.filter(x=>mastery(x)>=5).length,due:cards.filter(x=>(x.seen||x.n)&&x.d<=day).length,written:cards.filter(x=>x.skills.writing||x.w).length}}
export function exportData(){return{schemaVersion:1,exportedAt:new Date().toISOString(),progress:state.progress,settings:state.settings}}
export function validate(x){if(!x||x.schemaVersion!==1||!x.progress||x.progress.v!==1||typeof x.progress.c!=="object"||Array.isArray(x.progress.c))throw Error("Ungültiges Sicherungsformat");for(const[id,c]of Object.entries(x.progress.c)){if(!/^v\d{4}$/.test(id)||!c||typeof c.s!=="number"||c.s<0||c.s>9)throw Error("Ungültige Lerndaten");if(c.skills&&Object.values(c.skills).some(n=>typeof n!=="number"||n<0||n>9))throw Error("Ungültige Kompetenzdaten");if(c.skillDays&&Object.values(c.skillDays).some(ds=>!Array.isArray(ds)||ds.some(d=>!Number.isInteger(d))))throw Error("Ungültige Wiederholungsdaten")}return x}
export function importData(x){const ok=validate(x);state.progress=ok.progress;state.settings={...defaults,...ok.settings};saveProgress();saveSettings()}
