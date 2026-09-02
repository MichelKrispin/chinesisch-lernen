import{state}from"./state.js";

let currentUtterance=null,voice=null,startTimer=null,retryTimer=null,resumeTimer=null,noVoice=false,probeDone=false,resolveReady;
const ready=new Promise(r=>{resolveReady=r});
const synth=()=>typeof window!=="undefined"&&window.speechSynthesis;
const voiceErrors=["synthesis-failed","synthesis-unavailable","language-unavailable","voice-unavailable"];

function list(){return synth()?.getVoices?.()||[]}
function probed(){return probeDone||list().length>0}

export function supported(){return Boolean(synth()&&typeof window.SpeechSynthesisUtterance==="function")}
// "Verfügbar" heißt: es gibt wirklich eine chinesische Stimme. Solange die Liste
// noch leer ist (Chrome und Firefox liefern sie asynchron), gilt Audio als möglich.
export function available(){return supported()&&!noVoice&&Boolean(chineseVoice()||!probed())}
export function voicesReady(){return ready}

function report(reason){
  if(typeof document!=="undefined")document.dispatchEvent(new CustomEvent("audioerror",{detail:{reason}}));
}

function chineseVoice(){
  const voices=list(),lang=v=>(v.lang||"").toLowerCase().replace(/_/g,"-");
  return voices.find(v=>lang(v)==="zh-cn")
    ||voices.find(v=>lang(v).startsWith("zh-cn"))
    ||voices.find(v=>lang(v).startsWith("cmn"))
    ||voices.find(v=>lang(v).startsWith("zh"))
    ||voices.find(v=>/chinese|mandarin|putonghua|中文|普通话/i.test(v.name||""))
    ||null;
}

function settle(){if(!probeDone){probeDone=true;resolveReady()}}
function clearTimers(){clearTimeout(startTimer);clearTimeout(retryTimer);clearInterval(resumeTimer);startTimer=retryTimer=resumeTimer=null}
function push(engine,utterance){if(engine.paused)engine.resume();engine.speak(utterance)}

export function playChinese(text){
  if(!state.settings.audio){report("disabled");return false}
  if(!supported()){report("unsupported");return false}
  voice=chineseVoice();
  if(voice)noVoice=false;
  // Ohne chinesische Stimme lieber schweigen: eine deutsche Stimme liest Hanzi falsch vor.
  else if(list().length||noVoice){report("novoice");return false}
  const engine=synth();
  clearTimers();
  engine.cancel();
  const utterance=new window.SpeechSynthesisUtterance(String(text));
  utterance.lang=voice?.lang||"zh-CN";
  if(voice)utterance.voice=voice;
  utterance.rate=.85;
  utterance.onstart=()=>{clearTimeout(startTimer);clearTimeout(retryTimer);startTimer=retryTimer=null};
  utterance.onend=()=>{if(currentUtterance===utterance){clearTimers();currentUtterance=null}};
  utterance.onerror=event=>{
    if(currentUtterance!==utterance)return;
    clearTimers();currentUtterance=null;
    const error=event.error||"playback";
    if(["canceled","interrupted"].includes(error))return;
    if(voiceErrors.includes(error)&&!voice){noVoice=true;settle();report("novoice");return}
    report(error==="not-allowed"?"blocked":"playback");
  };
  currentUtterance=utterance;
  try{
    push(engine,utterance);
    resumeTimer=setInterval(()=>{if(currentUtterance===utterance&&engine.paused)engine.resume()},1000);
    // Chrome und Firefox verschlucken auf dem Desktop gelegentlich eine Äußerung,
    // die direkt nach cancel() eingereiht wurde; ein stiller zweiter Versuch genügt.
    retryTimer=setTimeout(()=>{if(currentUtterance===utterance&&!engine.speaking&&!engine.pending)push(engine,utterance)},700);
    startTimer=setTimeout(()=>{if(currentUtterance===utterance&&!engine.speaking){stopAudio();report("blocked")}},5000);
    return true;
  }catch(_error){
    currentUtterance=null;clearTimers();report("playback");return false;
  }
}

export function stopAudio(){
  clearTimers();
  if(supported())synth().cancel();
  currentUtterance=null;
}

if(supported()){
  synth().addEventListener?.("voiceschanged",()=>{const found=chineseVoice();if(found){voice=found;noVoice=false}if(list().length)settle()});
  voice=chineseVoice();
  if(list().length)settle();else setTimeout(settle,3000);
}else settle();
