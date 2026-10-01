import{readFile}from"node:fs/promises";import assert from"node:assert/strict";
const load=async p=>JSON.parse(await readFile(new URL(`../${p}`,import.meta.url))),v=await load("data/course.json"),chars=await load("data/characters.json"),lessons=await load("data/lessons.json");
assert.equal(v.schemaVersion,2);assert(v.items.length>=90,"Der erweiterte Wortschatz sollte mindestens 90 Einträge enthalten");
const ids=new Set,orders=new Set,known=new Set(chars.characters.map(x=>x.character));
for(const x of v.items){assert.match(x.id,/^v\d{4}$/);assert(!ids.has(x.id),`Doppelte ID ${x.id}`);ids.add(x.id);assert(x.simplified&&x.pinyin&&x.shortGerman);assert.match(x.pinyinNumbered,/^[a-zü:]+[1-5](?: ?[a-zü:]+[1-5])*$/i);assert(Number.isInteger(x.level)&&Number.isInteger(x.order));assert(!orders.has(x.order),`Doppelte Reihenfolge ${x.order}`);orders.add(x.order);assert(x.characters.every(c=>known.has(c)),`Fehlendes Zeichen bei ${x.id}`);assert.equal(v.verification,"dictionary_checked")}
const lessonIds=new Set(lessons.map(x=>x.id)),assigned=[];
for(const lesson of lessons){assert(lesson.title&&lesson.objective&&lesson.canDo,`Fehlendes Lernziel bei ${lesson.id}`);assert(lesson.check?.prompt&&lesson.check?.accepted?.length&&lesson.check?.model,`Fehlender Transfercheck bei ${lesson.id}`);if(lesson.unlockAfter)assert(lessonIds.has(lesson.unlockAfter),`Unbekannte Voraussetzung bei ${lesson.id}`);for(const id of lesson.items){assert(ids.has(id),`Unbekannte Lektions-ID ${id}`);assigned.push(id)}}
assert.equal(new Set(assigned).size,v.items.length,"Jedes Wort muss genau einer Lektion zugeordnet sein");
assert.equal(assigned.length,v.items.length,"Eine Vokabel ist mehreren Lektionen zugeordnet");
const forms=new Set(v.items.map(x=>x.simplified));for(const n of ["一","二","三","四","五","六","七","八","九","十"])assert(forms.has(n),`Zahl ${n} fehlt`);
console.log(`OK: ${ids.size} Wörter, ${known.size} Zeichen, ${lessons.length} Lektionen.`);
