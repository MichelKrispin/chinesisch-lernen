import {state} from "./state.js";
import {writingCard,writingAttempt,writingReview,writingQueue,writingStrokes,today} from "./progress.js";
import * as writer from "./writing.js";

let selected="",mode="watch",session=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=a=>a.complete&&!a.mistakes&&!a.hints;
const outcome=a=>!a?"Neu":!a.complete?"Unterbrochen":clean(a)?"Fehlerfrei":"Mit Fehlern / Hilfe";
const dueText=c=>{const r=writingReview(c),days=r.due-today();return !writingCard(c).memory.length?"Neu":days<=0?"Heute fällig":days===1?"Morgen fällig":`In ${days} Tagen fällig`};
export function mountWriting(requested){
 if(requested&&state.characters[requested]){selected=requested;session=null}
 selected=selected||Object.keys(state.characters)[0];
 render();
}
function finish(){
 writer.destroy();
 session.ended=true;
 const results=session.results,cleanCount=results.filter(clean).length;
 document.querySelector("#app").innerHTML=`<section class="panel"><p class="eyebrow">Schreibsession beendet</p><h1>${results.filter(a=>a.complete).length} von ${session.queue.length} Zeichen geschrieben</h1><p>${cleanCount} fehlerfrei · ${results.filter(a=>a.complete&&!clean(a)).length} mit Fehlern / Hilfe · ${results.filter(a=>!a.complete).length} übersprungen / unterbrochen</p><p>${results.reduce((n,a)=>n+a.mistakes,0)} Fehler · ${results.reduce((n,a)=>n+a.hints,0)} Hinweise</p><div class="list">${results.map(a=>`<div><span lang="zh-Hans">${a.char}</span> · ${outcome(a)} · ${dueText(a.char)}</div>`).join("")}</div><p>Fehlerhafte Abrufe werden morgen wiederholt. Fehlerfreie fällige Abrufe verlängern den Abstand; zusätzliches Üben am selben Tag nicht.</p><button id="writing-finish">Zurück zum Schreiben</button></section>`;
 document.querySelector("#writing-finish").onclick=()=>{session=null;render()};
}
function render(){
 writer.destroy();
 const root=document.querySelector("#app"),chars=Object.keys(state.characters);
 if(session&&(session.ended||session.index>=session.queue.length)){finish();return}
 if(session){selected=session.queue[session.index];mode="memory"}
 const char=selected,meta=state.characters[char],queue=writingQueue(chars);
 if(!meta){root.innerHTML="<p>Keine Zeichen verfügbar.</p>";return}
 const button=(id,label,disabled=false)=>`<button id="${id}" ${disabled?"disabled":""}>${label}</button>`;
 root.innerHTML=`<section class="writing-screen"><p class="eyebrow">${session?`Schreibsession · ${session.index+1} / ${session.queue.length}`:"Schreiben üben"}</p><h1>${mode==="memory"?"Aus dem Gedächtnis":`<span lang="zh-Hans">${char}</span>`} · ${esc(meta.primaryGerman.join(", ")||meta.pinyin.join(", "))}</h1><p class="meta">${esc(meta.pinyin.join(", "))} · ${meta.strokeCount} Striche · <span id="writing-due">${dueText(char)}</span></p>
 ${session?"":`<div class="tabs">${[["watch","Ansehen"],["trace","Nachzeichnen"],["memory","Aus dem Gedächtnis"]].map(([m,t])=>`<button data-mode="${m}" aria-pressed="${mode===m}" aria-selected="${mode===m}">${t}</button>`).join("")}</div>`}
 <div class="writing-layout"><div class="writer-box"><div id="writer" class="writer-target"></div></div><div class="panel write-controls"><h2 id="write-status" role="status">${mode==="watch"?"Strichfolge ansehen":mode==="trace"?"Zeichne die Kontur nach.":"Schreibe ohne Vorlage."}</h2><p>Fehler und Hinweise werden sofort gespeichert. Ansehen zählt nicht als Schreibversuch.</p><div id="write-result"></div><div class="actions">${button("writing-restart","Erneut üben")}${button("writing-hint","Hinweis",mode==="watch")}${button("writing-next",session?"Überspringen":"Nächstes Zeichen")}</div>${session?button("writing-end","Session beenden"):`<div class="actions">${button("writing-start",`Kurze Session (${Math.min(5,queue.length)}) starten`,!queue.length)}${button("writing-difficult","Schwieriges Zeichen üben")}</div><p>${queue.length} fällige oder neue Zeichen. Pro Session bis zu 5, fällige zuerst.</p>`}</div></div>
 <section class="panel writing-history"><h2>Dein Schreibfortschritt</h2><p>Die letzten 30 Versuche je Zeichen und Modus werden lokal gespeichert.</p><div id="writing-history"></div><h3>Häufige Strichfehler</h3><div id="writing-strokes"></div>${session?"":`<details><summary>Zeichen auswählen</summary><div class="actions" id="writing-characters"></div></details>`}</section></section>`;
 let mistakes=0,hints=0,strokes={},done=false,started=false;
 const record=mode==="watch"?()=>{}:writingAttempt(char,mode);
 const status=root.querySelector("#write-status"),target=root.querySelector("#writer");
 const refresh=()=>{
 const start=root.querySelector("#writing-start");
 if(start){const count=writingQueue(chars).length;start.disabled=!count;start.textContent=`Kurze Session (${Math.min(5,count)}) starten`}
 root.querySelector("#writing-due").textContent=dueText(char);
 root.querySelector("#writing-history").innerHTML=["trace","memory"].map(m=>{
 const a=writingCard(char)[m];return `<p>${m==="trace"?"Nachzeichnen":"Gedächtnis"}: ${a.filter(clean).length} fehlerfrei · ${a.filter(x=>x.complete&&!clean(x)).length} mit Fehlern / Hilfe · ${a.filter(x=>!x.complete).length} offen / unterbrochen</p>`;
 }).join("");
 root.querySelector("#writing-strokes").innerHTML=["trace","memory"].map(m=>{
 const trouble=writingStrokes(char,m).slice(0,3);return `<p>${m==="trace"?"Nachzeichnen":"Gedächtnis"}: ${trouble.length?trouble.map(x=>`Strich ${x.stroke+1}: ${x.count} Fehler`).join(" · "):"Noch keine Strichfehler erfasst."}</p>`;
 }).join("");
 const choices=root.querySelector("#writing-characters");
 if(choices)choices.innerHTML=chars.map(c=>`<a class="button secondary" href="#/write?char=${encodeURIComponent(c)}">${c} · ${outcome(writingCard(c).memory.at(-1))} · ${dueText(c)}</a>`).join("");
 };
 const save=complete=>{started=true;if(session)root.querySelector("#writing-restart").disabled=true;record({mistakes,hints,strokes:{...strokes},complete});root.querySelector("#write-result").textContent=`${mistakes} Fehler · ${hints} Hinweise · gespeichert`;refresh()};
 const collect=()=>{if(session)session.results.push({char,complete:done,mistakes,hints})};
 root.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render()});
 root.querySelector("#writing-hint").onclick=()=>writer.hint();
 root.querySelector("#writing-restart").onclick=()=>{if(session&&started){status.textContent="Nutze einen Hinweis oder gehe zum nächsten Zeichen.";return}render()};
 root.querySelector("#writing-next").onclick=()=>{if(session){collect();session.index++}else selected=chars[(chars.indexOf(char)+1)%chars.length];render()};
 if(session)root.querySelector("#writing-end").onclick=()=>{collect();finish()};
 else{
 root.querySelector("#writing-start").onclick=()=>{session={queue:writingQueue(chars).slice(0,5),index:0,results:[]};render()};
 root.querySelector("#writing-difficult").onclick=()=>{
 const difficult=chars.filter(c=>{const a=writingCard(c).memory.at(-1);return a&&!clean(a)});
 const next=difficult.find(c=>c!==char)||difficult[0]||queue[0];
 if(next){selected=next;mode="memory";render()}else status.textContent="Keine schwierigen oder neuen Zeichen übrig.";
 };
 }
 refresh();
 requestAnimationFrame(()=>{
 if(!target.isConnected)return;
 try{writer.create(target,char,mode,{
 mistake:d=>{mistakes++;if(Number.isInteger(d.strokeNum))strokes[d.strokeNum]=(strokes[d.strokeNum]||0)+1;save(false);status.textContent=`Achte auf Richtung und Lage von Strich ${d.strokeNum+1}.`},
 hint:()=>{hints++;save(false)},
 stroke:d=>{save(false);status.textContent=`Richtig: Strich ${d.strokeNum+1} von ${meta.strokeCount}.`},
 complete:()=>{
 if(done)return;
 if(mode==="watch"){status.textContent="Strichfolge beendet. Jetzt nachzeichnen.";return}
 done=true;save(true);status.textContent=mistakes||hints?"Geschafft – morgen erneut üben.":"✓ Fehlerfrei geschrieben!";
 root.querySelector("#writing-hint").disabled=true;
 if(session){root.querySelector("#writing-restart").disabled=true;root.querySelector("#writing-next").textContent=session.index+1===session.queue.length?"Ergebnis ansehen":"Weiter"}
 },
 error:()=>{status.textContent="Strichdaten konnten nicht geladen werden. Bitte erneut versuchen."}
 })}catch{status.textContent="Schreibmodul nicht verfügbar. Bitte neu laden."}
 });
}
