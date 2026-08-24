import{state}from"./state.js";

let currentUtterance=null,voice=null,startTimer=null,resumeTimer=null;
const synth=()=>typeof window!=="undefined"&&window.speechSynthesis;

export function available(){return Boolean(synth()&&typeof window.SpeechSynthesisUtterance==="function")}

function report(reason){
  if(typeof document!=="undefined")document.dispatchEvent(new CustomEvent("audioerror",{detail:{reason}}));
}

function chineseVoice(){
  const voices=synth()?.getVoices?.()||[],lang=v=>(v.lang||"").toLowerCase().replace("_","-");
  return voices.find(v=>lang(v)==="zh-cn")
    ||voices.find(v=>lang(v).startsWith("zh-cn"))
    ||voices.find(v=>lang(v).startsWith("cmn"))
    ||voices.find(v=>lang(v).startsWith("zh"))
    ||null;
}

function clearTimers(){clearTimeout(startTimer);clearInterval(resumeTimer);startTimer=resumeTimer=null}

export function playChinese(text){
  if(!state.settings.audio){report("disabled");return false}
  if(!available()){report("unsupported");return false}
  const engine=synth();
  clearTimers();
  engine.cancel();
  const utterance=new window.SpeechSynthesisUtterance(String(text));
  utterance.lang="zh-CN";
  voice=chineseVoice()||voice;
  if(voice)utterance.voice=voice;
  utterance.rate=.85;
  utterance.onstart=()=>clearTimeout(startTimer);
  utterance.onend=()=>{if(currentUtterance===utterance){clearTimers();currentUtterance=null}};
  utterance.onerror=event=>{
    if(currentUtterance!==utterance)return;
    clearTimers();currentUtterance=null;
    if(!["canceled","interrupted"].includes(event.error))report(event.error||"playback");
  };
  currentUtterance=utterance;
  try{
    if(engine.paused)engine.resume();
    engine.speak(utterance);
    resumeTimer=setInterval(()=>{if(currentUtterance===utterance&&engine.paused)engine.resume()},1000);
    startTimer=setTimeout(()=>{if(currentUtterance===utterance&&!engine.speaking){stopAudio();report("blocked")}},4000);
    return true;
  }catch(_error){
    currentUtterance=null;clearTimers();report("playback");return false;
  }
}

export function stopAudio(){
  clearTimers();
  if(available())synth().cancel();
  currentUtterance=null;
}

if(available()){
  synth().addEventListener?.("voiceschanged",()=>{voice=chineseVoice()});
  voice=chineseVoice();
}
