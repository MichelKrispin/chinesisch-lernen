let writer,stroke=0,onHint,active=false,generation=0;
export function destroy(){generation++;active=false;writer?.cancelQuiz();writer=null;document.querySelector('.writer-target')?.replaceChildren()}
export function create(el,char,mode,events={}){
 destroy();const token=generation;
 if(!window.HanziWriter)throw Error('Schreibmodul nicht verfügbar');
 const safe=fn=>data=>{if(token===generation)fn?.(data)};
 const size=el.clientWidth||300;stroke=0;onHint=events.hint;active=mode!=='watch';
 writer=window.HanziWriter.create(el,char,{width:size,height:size,padding:12,showOutline:mode!=='memory',showCharacter:mode==='watch',strokeAnimationSpeed:1,delayBetweenStrokes:250,onLoadCharDataError:safe(events.error),charDataLoader:(c,done,fail)=>fetch(`character-data/${encodeURIComponent(c)}.json`).then(r=>{if(!r.ok)throw Error();return r.json()}).then(done).catch(fail)});
 if(mode==='watch')writer.animateCharacter({onComplete:safe(events.complete)});
 else writer.quiz({showHintAfterMisses:2,highlightOnComplete:true,onMistake:safe(events.mistake),onCorrectStroke:safe(d=>{stroke=d.strokeNum+1;events.stroke?.(d)}),onComplete:safe(d=>{active=false;events.complete?.(d)})});
 return writer;
}
export function hint(){if(active&&writer){onHint?.();writer.highlightStroke(stroke)}}
