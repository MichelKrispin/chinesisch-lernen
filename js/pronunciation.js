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
    <div class="tone-grid"><div><strong>1 · mā</strong><p>hoch und gleichmäßig</p>${sample("妈","mā","Mutter")}</div><div><strong>2 · má</strong><p>steigend</p>${sample("麻","má","Hanf")}</div><div><strong>3 · mǎ</strong><p>tief, allein oft fallend und steigend</p>${sample("马","mǎ","Pferd")}</div><div><strong>4 · mà</strong><p>kurz und deutlich fallend</p>${sample("骂","mà","schimpfen")}</div><div><strong>neutral · ma</strong><p>kurz und unbetont</p>${sample("吗","ma","Fragepartikel")}</div></div>
    <p>Im Satz verändert sich die tatsächliche Tonkurve. Vor einem weiteren dritten Ton klingt der erste dritte Ton meist steigend: <strong>nǐ hǎo</strong> wird ungefähr <strong>ní hǎo</strong> gesprochen. Die Schreibweise bleibt nǐ hǎo.</p>
    ${sample("你好","nǐ hǎo","Hallo")}</section>
  <section class="panel" id="schreibregeln"><h2>Wichtige Schreibregeln</h2><ul>
    <li>Nach <strong>j, q, x</strong> und am Silbenanfang <strong>y</strong> fallen die Punkte von ü weg: <strong>qù</strong> und <strong>yú</strong> enthalten trotzdem den ü-Laut. Nach <strong>n</strong> und <strong>l</strong> bleiben die Punkte: <strong>nǚ</strong>, <strong>lǜ</strong>.</li>
    <li><strong>ui</strong> ist eine verkürzte Schreibweise von <strong>uei</strong>, <strong>iu</strong> von <strong>iou</strong>. Lies beide als eine Silbe.</li>
    <li><strong>y</strong> und <strong>w</strong> stehen oft am Anfang von Silben ohne anderen Anlaut: <strong>yī</strong>, <strong>wǒ</strong>. Sie helfen beim Lesen und Trennen der Silben.</li>
    <li>Das Tonzeichen steht auf dem tragenden Vokal: zuerst <strong>a</strong> oder <strong>e</strong>, sonst auf <strong>o</strong>; bei <strong>iu/ui</strong> auf dem letzten Vokal. Beispiele: <strong>hǎo</strong>, <strong>xiè</strong>, <strong>liù</strong>, <strong>shuǐ</strong>.</li>
  </ul><div class="sound-samples">${sample("去","qù","gehen")}${sample("鱼","yú","Fisch")}${sample("女","nǚ","Frau")}${sample("六","liù","sechs")}${sample("水","shuǐ","Wasser")}</div>
  <p class="meta">Die Beispiele sind eine Einstiegshilfe. Vergleiche die Synthesestimme zusätzlich mit Muttersprachlern; regionale Aussprache kann abweichen.</p></section>
</article>`}
