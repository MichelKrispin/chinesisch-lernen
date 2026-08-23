import{state,defaults}from"./state.js";
const DAY=864e5, prefix="cnlearn_progress_", meta="cnlearn_meta_v1", settingsKey="cnlearn_settings_v1";
const cookieOptions=()=>`; Path=/; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`;
const read=name=>document.cookie.split("; ").find(x=>x.startsWith(name+"="))?.slice(name.length+1)||"";
const write=(name,value,days=730)=>document.cookie=`${name}=${value}; Max-Age=${days*86400}${cookieOptions()}`;
export function loadProgress(){try{const count=Number(read(meta))||0,raw=Array.from({length:count},(_,i)=>read(`${prefix}${i}_v1`)).join("");if(raw)state.progress=validate({schemaVersion:1,progress:JSON.parse(decodeURIComponent(raw))}).progress}catch{state.progress={v:1,c:{}}}try{state.settings={...defaults,...JSON.parse(decodeURIComponent(read(settingsKey)))} }catch{state.settings={...defaults}}}
export function saveProgress(){const raw=encodeURIComponent(JSON.stringify(state.progress)),parts=raw.match(/.{1,3500}/g)||[];const old=Number(read(meta))||0;parts.forEach((p,i)=>write(`${prefix}${i}_v1`,p));for(let i=parts.length;i<old;i++)write(`${prefix}${i}_v1`,"",-1);write(meta,String(parts.length));}
export function saveSettings(){write(settingsKey,encodeURIComponent(JSON.stringify(state.settings)))}
export function card(id){return state.progress.c[id]||{s:0,n:0,f:0,i:0,d:0,l:0,w:0}}
export function update(id,patch){state.progress.c[id]={...card(id),...patch};saveProgress()}
export function reset(){state.progress={v:1,c:{}};saveProgress()}
export function summary(){const cards=Object.values(state.progress.c),today=Math.floor(Date.now()/DAY);return{started:cards.length,learned:cards.filter(x=>x.s>=3).length,mature:cards.filter(x=>x.s>=8).length,due:cards.filter(x=>x.d<=today).length,written:cards.filter(x=>x.w).length}}
export function exportData(){return{schemaVersion:1,exportedAt:new Date().toISOString(),progress:state.progress,settings:state.settings}}
export function validate(x){if(!x||x.schemaVersion!==1||!x.progress||x.progress.v!==1||typeof x.progress.c!=="object"||Array.isArray(x.progress.c))throw Error("Ungültiges Sicherungsformat");for(const[id,c]of Object.entries(x.progress.c)){if(!/^v\d{4}$/.test(id)||!c||typeof c.s!=="number"||c.s<0||c.s>9)throw Error("Ungültige Lerndaten")}return x}
export function importData(x){const ok=validate(x);state.progress=ok.progress;state.settings={...defaults,...ok.settings};saveProgress();saveSettings()}
