import{state}from"./state.js";let voice,currentUtterance;
export function available(){return"speechSynthesis"in window}
function chineseVoice(){const voices=speechSynthesis.getVoices();return voices.find(v=>v.lang.toLowerCase()==="zh-cn")||voices.find(v=>v.lang.toLowerCase().startsWith("zh"))}
export function playChinese(text){if(!state.settings.audio||!available())return false;speechSynthesis.cancel();let spoken=false;const speak=()=>{if(spoken)return;spoken=true;const u=new SpeechSynthesisUtterance(text);u.lang="zh-CN";voice=voice||chineseVoice();if(voice)u.voice=voice;u.rate=.85;u.onend=u.onerror=()=>{if(currentUtterance===u)currentUtterance=null};currentUtterance=u;speechSynthesis.speak(u)};if(speechSynthesis.getVoices().length)speak();else{const fallback=setTimeout(speak,250);speechSynthesis.addEventListener("voiceschanged",()=>{clearTimeout(fallback);speak()},{once:true})}return true}
export const stopAudio=()=>{if(available())speechSynthesis.cancel();currentUtterance=null};
