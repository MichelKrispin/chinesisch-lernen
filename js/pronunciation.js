const TONES={
  1:{label:"1. Ton",symbol:"ā",description:"Hoch beginnen und die Tonhöhe gleichmäßig halten.",path:"M 42 22 L 156 22"},
  2:{label:"2. Ton",symbol:"á",description:"In mittlerer Tonhöhe beginnen und nach oben gleiten.",path:"M 42 60 Q 92 46 156 22"},
  3:{label:"3. Ton",symbol:"ǎ",description:"Tief sprechen. Allein oder am Ende einer Sprechgruppe kann die Stimme erst sinken und dann wieder steigen. Im Satz bleibt der Ton häufig tief; vor einem weiteren dritten Ton wird er steigend gesprochen.",path:"M 42 68 Q 72 94 94 84 Q 126 64 156 36"},
  4:{label:"4. Ton",symbol:"à",description:"Hoch beginnen und die Stimme deutlich nach unten fallen lassen.",path:"M 42 22 L 156 86"},
  5:{label:"Neutraler Ton",symbol:"a",description:"Kurz und unbetont sprechen. Die Tonhöhe hängt von der vorherigen Silbe ab; es gibt keinen festen Tonverlauf. Im nummerierten Pinyin steht dafür hier 5."}
};

export function toneDrawing(tone){
  const info=TONES[tone];if(!info)return"";
  const contour=info.path?`<path class="tone-contour" d="${info.path}"/>`:'<path class="tone-variable" d="M 92 28 V 80"/><circle class="tone-neutral-dot" cx="92" cy="54" r="4"/>';
  return `<svg class="tone-drawing" viewBox="0 0 180 110" role="img" aria-label="${info.label}: ${tone===5?"kurz, Tonhöhe variabel":tone===3?"tief, einzeln fallend und steigend":tone===1?"hoch und gleichmäßig":tone===2?"steigend":"fallend"}"><path class="tone-gridlines" d="M 36 22 H 164 M 36 54 H 164 M 36 86 H 164"/><path class="tone-axes" d="M 36 14 V 90 H 164"/><text x="2" y="25">hoch</text><text x="7" y="89">tief</text>${contour}<text x="43" y="106">${tone===5?"kurz · Höhe variabel":"Silbenverlauf →"}</text></svg>`;
}

export function toneFeedback(tone){
  const info=TONES[tone];if(!info)return"";
  return `<div class="tone-feedback">${toneDrawing(tone)}<div><strong>Richtiger Ton: ${info.label}${tone===5?" (5)":""}</strong><p><span class="tone-symbol">${info.symbol}</span> · ${info.description}</p></div></div>`;
}

// Audio examples use Hanzi: a Mandarin speech voice would read Latin letters as letter names.
const sample=(hanzi,pinyin,meaning)=>`<button type="button" class="sound-sample secondary" data-audio="${hanzi}" aria-label="${pinyin} anhören"><span lang="zh-Hans">${hanzi}</span><strong>${pinyin}</strong><small>${meaning}</small><span aria-hidden="true">▶</span></button>`;
const row=(letters,description,examples)=>`<tr><th scope="row">${letters}</th><td>${description}</td><td><div class="sound-samples">${examples.map(x=>sample(...x)).join("")}</div></td></tr>`;

export function pronunciationGuide(){return `<article class="pronunciation-page">
  <header class="panel"><p class="eyebrow">Aussprachehilfe</p><h1>Pinyin lesen und hören</h1>
    <p>Pinyin schreibt die Aussprache des Mandarin mit lateinischen Buchstaben. Eine Silbe besteht oft aus einem Anlaut, einem Auslaut und einem Ton. Die Buchstaben werden nicht immer wie im Deutschen gesprochen. Tippe auf die chinesischen Beispiele und sprich sie nach.</p>
    <p class="meta">Die Hörbeispiele verwenden die chinesische Systemstimme deines Geräts.</p></header>
  <nav class="guide-jumps" aria-label="Abschnitte der Aussprachehilfe"><button type="button" data-guide-target="anlaute">Anlaute</button><button type="button" data-guide-target="auslaute">Auslaute</button><button type="button" data-guide-target="toene">Töne</button><button type="button" data-guide-target="schreibregeln">Schreibregeln</button></nav>
  <section class="panel" id="anlaute"><h2>Anlaute</h2><p>Vergleiche besonders die Luft bei <strong>b/p, d/t und g/k</strong>: Der zweite Laut jedes Paars wird mit deutlich mehr Luft gesprochen. Die Buchstaben bezeichnen hier keinen deutschen Gegensatz von stimmhaft und stimmlos.</p>
    <div class="guide-table-wrap"><table class="guide-table"><thead><tr><th>Buchstaben</th><th>So formst du den Laut</th><th>Hörbeispiele</th></tr></thead><tbody>
    ${row("b · p", "Beide mit den Lippen; p mit kräftigem Luftstoß.", [["八","bā","acht"],["怕","pà","Angst haben"]])}
    ${row("d · t", "Zungenspitze vorn; t mit kräftigem Luftstoß.", [["大","dà","groß"],["他","tā","er"]])}
    ${row("g · k", "Zungenrücken hinten; k mit kräftigem Luftstoß.", [["哥","gē","älterer Bruder"],["看","kàn","ansehen"]])}
    ${row("m · f · n · l", "Diese Laute ähneln den deutschen m, f, n und l. Höre trotzdem auf die ganze Silbe und ihren Ton.", [["妈","mā","Mutter"],["饭","fàn","gekochter Reis"],["你","nǐ","du"],["来","lái","kommen"]])}
    ${row("h", "Ein kräftiger Reibelaut hinten im Mund, etwa in Richtung des deutschen ach-Lauts.", [["好","hǎo","gut"]])}
    ${row("j · q · x", "Zungenrücken weit vorn, Zungenspitze unten. q hat einen Luftstoß; x ist ein heller Reibelaut.", [["九","jiǔ","neun"],["七","qī","sieben"],["谢","xiè","danken"]])}
    ${row("zh · ch · sh · r", "Zungenspitze leicht nach hinten zum Gaumen heben. ch hat einen deutlichen Luftstoß.", [["这","zhè","dies"],["吃","chī","essen"],["十","shí","zehn"],["人","rén","Mensch"]])}
    ${row("z · c · s", "Zungenspitze bleibt vorn. z klingt etwa wie ds, c wie ein behauchtes ts, s wie ein scharfes s.", [["在","zài","sich befinden"],["菜","cài","Gericht"],["三","sān","drei"]])}
    </tbody></table></div></section>
  <section class="panel" id="auslaute"><h2>Auslaute und Buchstabenfolgen</h2><p>Ein Auslaut kann aus mehreren Buchstaben bestehen. Höre die ganze Silbe; einzelne Buchstaben getrennt vorzulesen führt leicht in die Irre.</p>
    <div class="guide-table-wrap"><table class="guide-table"><thead><tr><th>Buchstaben</th><th>So formst du den Laut</th><th>Hörbeispiele</th></tr></thead><tbody>
    ${row("a · o · e", "a ist offen; o hat runde Lippen; für e ziehst du die Zunge etwas zurück und lässt die Lippen ungerundet.", [["大","dà","groß"],["我","wǒ","ich"],["喝","hē","trinken"]])}
    ${row("i · u · ü", "i meist wie deutsches i, u wie deutsches u, ü mit gerundeten Lippen wie deutsches ü.", [["你","nǐ","du"],["不","bù","nicht"],["女","nǚ","Frau"]])}
    ${row("ai · ei · ao · ou", "Gleitlaute: Beginne beim ersten Vokal und gleite ohne Pause zum zweiten.", [["来","lái","kommen"],["谁","shéi","wer"],["好","hǎo","gut"],["有","yǒu","haben"]])}
    ${row("an · ang / en · eng", "Bei -n berührt die Zunge vorn den Gaumen; bei -ng bleibt sie hinten.", [["三","sān","drei"],["忙","máng","beschäftigt"],["很","hěn","sehr"],["冷","lěng","kalt"]])}
    ${row("in · ing", "Auch hier unterscheidet sich die Endung durch die Zungenposition: vorn bei -n, hinten bei -ng.", [["新","xīn","neu"],["听","tīng","hören"]])}
    ${row("ia · ie · iao · ian", "Das i führt in den folgenden Vokal. Die ganze Folge bleibt Teil einer einzigen Silbe.", [["家","jiā","Zuhause"],["谢","xiè","danken"],["小","xiǎo","klein"],["钱","qián","Geld"]])}
    ${row("uo · uai · uang", "Das u beginnt als kurzer Gleitlaut mit gerundeten Lippen.", [["多","duō","viel"],["快","kuài","schnell"],["黄","huáng","gelb"]])}
    ${row("ong · er", "Bei -ong endet die Silbe mit einem hinteren Nasallaut; er ist eine eigene Silbe mit r-Färbung.", [["中","zhōng","Mitte"],["二","èr","zwei"]])}
    ${row("i nach z/c/s/zh/ch/sh/r", "Dieses i klingt nicht wie deutsches i. Die Zungenstellung des Anlauts bleibt erhalten.", [["四","sì","vier"],["吃","chī","essen"],["是","shì","sein"]])}
    </tbody></table></div></section>
  <section class="panel" id="toene"><h2>Die vier Töne und der neutrale Ton</h2><p>Der Ton gehört zur Silbe und kann die Bedeutung ändern. Die Striche über dem Vokal zeigen den Ton; bei nummeriertem Pinyin stehen 1 bis 4 beziehungsweise 5 für neutral dahinter.</p>
    <p>Die Zeichnungen zeigen die Tonhöhe im Verlauf einer Silbe: links beginnt sie, rechts endet sie. Oben bedeutet hoch, unten tief. Die Linien sind eine Orientierung, keine genaue Messung deiner Stimme.</p>
    <div class="tone-grid">${[[1,"妈","mā","Mutter"],[2,"麻","má","Hanf"],[3,"马","mǎ","Pferd"],[4,"骂","mà","schimpfen"],[5,"吗","ma","Fragepartikel"]].map(([tone,hanzi,pinyin,meaning])=>`<div><strong>${TONES[tone].label} · ${pinyin}</strong>${toneDrawing(tone)}<p>${TONES[tone].description}</p>${sample(hanzi,pinyin,meaning)}</div>`).join("")}</div>
    <p>Im Satz verändert sich die tatsächliche Tonkurve. Vor einem weiteren dritten Ton klingt der erste dritte Ton meist steigend: <strong>nǐ hǎo</strong> wird ungefähr <strong>ní hǎo</strong> gesprochen. Die Schreibweise bleibt nǐ hǎo.</p>
    ${sample("你好","nǐ hǎo","Hallo")}
    <p>Die Wortkarten zeigen bei <strong>一、 不、 个</strong> die Grundtöne <strong>yī, bù, gè</strong>. In den Beispielen stehen die gesprochenen Formen: <strong>yí ge rén</strong> (eine Person), <strong>yì nián</strong> (ein Jahr) und <strong>bú shì</strong> (nicht sein). 个 wird im Satz oft unbetont <strong>ge</strong> gesprochen.</p></section>
  <section class="panel" id="schreibregeln"><h2>Wichtige Schreibregeln</h2><ul>
    <li>Nach <strong>j, q, x</strong> und am Silbenanfang <strong>y</strong> fallen die Punkte von ü weg: <strong>qù</strong> und <strong>yú</strong> enthalten trotzdem den ü-Laut. Nach <strong>n</strong> und <strong>l</strong> bleiben die Punkte: <strong>nǚ</strong>, <strong>lǜ</strong>.</li>
    <li><strong>ui</strong> ist eine verkürzte Schreibweise von <strong>uei</strong>, <strong>iu</strong> von <strong>iou</strong>. Lies beide als eine Silbe.</li>
    <li><strong>y</strong> und <strong>w</strong> stehen oft am Anfang von Silben ohne anderen Anlaut: <strong>yī</strong>, <strong>wǒ</strong>. Sie helfen beim Lesen und Trennen der Silben.</li>
    <li>Das Tonzeichen steht auf dem tragenden Vokal: zuerst <strong>a</strong> oder <strong>e</strong>, sonst auf <strong>o</strong>; bei <strong>iu/ui</strong> auf dem letzten Vokal. Beispiele: <strong>hǎo</strong>, <strong>xiè</strong>, <strong>liù</strong>, <strong>shuǐ</strong>.</li>
  </ul><div class="sound-samples">${sample("去","qù","gehen")}${sample("鱼","yú","Fisch")}${sample("女","nǚ","Frau")}${sample("六","liù","sechs")}${sample("水","shuǐ","Wasser")}</div>
  <p class="meta">Die Beispiele sind eine Einstiegshilfe. Vergleiche die Synthesestimme zusätzlich mit Muttersprachlern; regionale Aussprache kann abweichen.</p></section>
</article>`}
