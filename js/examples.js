export const EXAMPLE_GLOSSES={"学生":["xuésheng","Schüler/in"],"老师":["lǎoshī","Lehrer/in"],"德国":["Déguó","Deutschland"],"中国":["Zhōngguó","China"],"茶":["chá","Tee"],"很":["hěn","sehr; Bindewort vor Adjektiven"],"吗":["ma","Fragepartikel"],"个":["ge","allgemeines Zähleinheitswort"],"喝":["hē","trinken"],"没":["méi","nicht haben / nicht vorhanden"],"都":["dōu","alle"],"写":["xiě","schreiben"]};

export function exampleWords(ex,items){
  const explicit=ex.glosses||[];
  const extras=Object.entries(EXAMPLE_GLOSSES).map(([text,[pinyin,de]])=>({text,pinyin,de}));
  const vocabulary=items.filter(v=>!v.pinyin.includes(" ")).map(v=>({text:v.simplified,pinyin:v.pinyin,de:v.shortGerman}));
  const entries=[...explicit,...vocabulary.filter(x=>!explicit.some(g=>g.text===x.text)),...extras.filter(x=>![...explicit,...vocabulary].some(g=>g.text===x.text))].sort((a,b)=>b.text.length-a.text.length),words=[];
  for(let i=0;i<ex.zh.length;){
    const entry=entries.find(x=>ex.zh.startsWith(x.text,i));
    if(entry){words.push(entry);i+=entry.text.length}
    else{const text=ex.zh[i++];if(/\p{Script=Han}/u.test(text))words.push({text,pinyin:"",de:""})}
  }
  const spoken=ex.pinyin.match(/\p{L}+(?:['’]\p{L}+)*/gu)||[];
  return words.map((word,i)=>({...word,pinyin:spoken.length===words.length?spoken[i]:word.pinyin}));
}
