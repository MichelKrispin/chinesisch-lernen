import assert from "node:assert/strict";
import {state} from "../js/state.js";
import {mountWriting} from "../js/writing-page.js";
import {writingCard} from "../js/progress.js";

// Exercise page event wiring with a small DOM and a controllable writer.
let nodes=new Map(),quiz,animation;
class Element {
 constructor(){this.isConnected=true;this.dataset={};this.disabled=false}
 set innerHTML(html){this.html=html}
 get innerHTML(){return this.html||""}
 replaceChildren(){}
 querySelector(selector){return document.querySelector(selector)}
 querySelectorAll(){return []}
}
const root=new Element();
Object.defineProperty(root,"innerHTML",{
 get(){return this.html},
 set(html){
  for(const node of nodes.values())node.isConnected=false;
  nodes=new Map();this.html=html;
  for(const match of html.matchAll(/id="([^"]+)"/g))nodes.set("#"+match[1],new Element());
 }
});
globalThis.location={protocol:"http:"};
globalThis.document={cookie:"",querySelector:s=>s==="#app"?root:s===".writer-target"?nodes.get("#writer"):nodes.get(s)};
globalThis.requestAnimationFrame=fn=>fn();
globalThis.window={HanziWriter:{create:()=>({
 cancelQuiz(){},highlightStroke(){},animateCharacter(o){animation=o},quiz(o){quiz=o}
})}};
state.characters=Object.fromEntries(["一","二","三","四","五","十"].map(character=>[character,{primaryGerman:["Zahl"],pinyin:["yī"],strokeCount:1}]));
state.progress={v:1,c:{}};
const click=id=>{const b=nodes.get(id);assert.ok(b,id);assert.ok(!b.disabled,id+" enabled");b.onclick()};
mountWriting();
animation.onComplete();
assert.equal(state.progress.writing,undefined,"Watching earns no attempt");
click("#writing-start");
assert.match(root.innerHTML,/Schreibsession · 1 \/ 5/);
quiz.onMistake({strokeNum:0});
click("#writing-hint");
quiz.onCorrectStroke({strokeNum:0});
quiz.onComplete();
assert.equal(writingCard("一").memory[0].strokes[0],1);
assert.equal(writingCard("一").memory[0].hints,1);
click("#writing-next");
quiz.onCorrectStroke({strokeNum:0});quiz.onComplete();
click("#writing-next");
click("#writing-next"); // Skip the third character without claiming success.
quiz.onMistake({strokeNum:0});
click("#writing-next"); // Interrupted fourth character.
quiz.onCorrectStroke({strokeNum:0});quiz.onComplete();
click("#writing-next");
assert.match(root.innerHTML,/3 von 5 Zeichen geschrieben/);
assert.match(root.innerHTML,/2 fehlerfrei · 1 mit Fehlern \/ Hilfe · 2 übersprungen \/ unterbrochen/);
assert.match(root.innerHTML,/2 Fehler · 1 Hinweise/);
click("#writing-finish");
click("#writing-start");
click("#writing-end");
assert.match(root.innerHTML,/0 von/,"Early session ending shows summary");
console.log("OK: Writing page sessions, hints, skips, interruption and summary.");
