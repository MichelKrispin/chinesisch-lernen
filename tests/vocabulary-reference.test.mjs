import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { exampleWords } from "../js/examples.js";

const load = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url)));
const course = await load("data/course.json");
const reference = await load("tests/fixtures/vocabulary-reference.json");
const lessons = await load("data/lessons.json");
const characters = await load("data/characters.json");
const byId = new Map(reference.items.map(item => [item.id, item]));
const byForm = new Map(reference.items.map(item => [item.simplified, item]));
const normalize = text => text.toLowerCase().normalize("NFC").replace(/[\s'’]/g, "");

function marked(numbered) {
  return numbered.replace(/([a-zü]+)([1-5])/gi, (_, raw, tone) => {
    const syllable = raw.toLowerCase();
    if (tone === "5") return syllable;
    let index = syllable.indexOf("a");
    if (index < 0) index = syllable.indexOf("e");
    if (index < 0) index = syllable.indexOf("ou");
    if (index < 0) index = Math.max(...[...syllable].map((letter, i) => /[iouü]/.test(letter) ? i : -1));
    assert(index >= 0, `Kein Tonträger: ${raw}${tone}`);
    const tones = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", ü: "ǖǘǚǜ" };
    return syllable.slice(0, index) + tones[syllable[index]][Number(tone) - 1] + syllable.slice(index + 1);
  });
}

assert.equal(byId.size, reference.items.length, "Doppelte Referenz-ID");
assert.equal(course.items.length, reference.items.length, "Neue Wörter benötigen einen Wörterbuchabgleich");
for (const item of course.items) {
  const ref = byId.get(item.id);
  assert(ref, `Ungeprüfte Vokabel: ${item.id}`);
  assert.equal(item.simplified, ref.simplified, `Schriftform: ${item.id}`);
  assert.equal(item.traditional, ref.traditional, `Langzeichen: ${item.id}`);
  const readings = Object.values(ref.readings).flat();
  assert(readings.includes(normalize(item.pinyinNumbered)), `Nicht belegte Lesung: ${item.simplified}`);
  assert.equal(normalize(item.pinyin), normalize(marked(item.pinyinNumbered)), `Tonzeichen: ${item.simplified}`);
  assert.equal(item.pinyinNumbered.match(/[1-5]/g).length, [...item.simplified].length, `Silbenzahl: ${item.simplified}`);
}

function checkSentence(example, label) {
  const words = exampleWords(example, course.items);
  const spoken = example.pinyin.match(/\p{L}+(?:['’]\p{L}+)*/gu) || [];
  assert.equal(spoken.length, words.length, `Worttrennung: ${label}`);
  assert.equal(words.map(word => word.text).join(""), (example.zh.match(/\p{Script=Han}/gu) || []).join(""), `Zeichenabdeckung: ${label}`);
  for (const [index, word] of words.entries()) {
    const ref = byForm.get(word.text);
    assert(ref, `Ungeprüftes Beispielwort: ${word.text} (${label})`);
    const readings = Object.values(ref.readings).flat().map(marked);
    // Examples show the spoken tones of 一 and 不 and the reduced classifier 个.
    if (word.text === "一") readings.push("yí", "yì");
    if (word.text === "不") readings.push("bú");
    if (word.text === "个") readings.push("ge");
    assert(readings.map(normalize).includes(normalize(spoken[index])), `Beispiel-Lesung: ${word.text} → ${spoken[index]} (${label})`);
  }
}

for (const item of course.items) for (const example of item.examples) checkSentence(example, item.id);
for (const lesson of lessons) checkSentence({ zh: lesson.check.model, pinyin: lesson.check.pinyin }, lesson.id);
for (const character of characters.characters) {
  const ref = byForm.get(character.character);
  // 谢, 再, 见, 什 and 么 are taught as parts of checked compound words.
  const containing = ref ? [ref] : reference.items.filter(item => item.simplified.includes(character.character));
  for (const pinyin of character.pinyin) {
    assert(containing.some(item => Object.values(item.readings).flat().some(reading => {
      const syllables = reading.match(/[a-zü]+?[1-5]/g);
      return normalize(marked(syllables[item.simplified.indexOf(character.character)] || "")) === normalize(pinyin);
    })), `Zeichen-Lesung: ${character.character}`);
  }
  const strokes = await load(`character-data/${character.character}.json`);
  assert.equal(character.strokeCount, strokes.strokes.length, `Strichzahl: ${character.character}`);
}

console.log(`OK: ${course.items.length} Wörterbuch-Lesungen, alle Beispiele, ${lessons.length} Lektionsmodelle und ${characters.characters.length} Zeichen geprüft.`);
