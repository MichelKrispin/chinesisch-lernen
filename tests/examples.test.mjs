import{readFile}from"node:fs/promises";
import assert from"node:assert/strict";
import{exampleWords}from"../js/examples.js";

const course=JSON.parse(await readFile(new URL("../data/course.json",import.meta.url)));
for(const item of course.items){
  for(const ex of item.examples){
    const words=exampleWords(ex,course.items);
    const hanzi=ex.zh.match(/\p{Script=Han}/gu)?.join("")||"";
    assert.equal(words.map(word=>word.text).join(""),hanzi,`Unvollständige Worttrennung: ${ex.zh}`);
    assert(words.every(word=>word.pinyin),`Fehlendes Pinyin: ${ex.zh}`);
    assert(words.every(word=>word.de),`Fehlende Einzelübersetzung: ${ex.zh}`);
  }
}
console.log(`OK: Wortdetails für ${course.items.length} Beispiele vollständig.`);
