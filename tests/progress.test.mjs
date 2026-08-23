import assert from"node:assert/strict";import{state}from"../js/state.js";import{card,validate}from"../js/progress.js";
assert.deepEqual(card("v0001"),{s:0,n:0,f:0,i:0,d:0,l:0,w:0});
assert.equal(validate({schemaVersion:1,progress:{v:1,c:{v0001:{s:2}}}}).progress.c.v0001.s,2);
assert.throws(()=>validate({schemaVersion:1,progress:{v:1,c:{bad:{s:2}}}}));
state.progress={v:1,c:{}};console.log("OK: Fortschrittsformat validiert.");
