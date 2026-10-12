# Prüfung der Lerninhalte am 12.10.2026

Geprüfter Datensatz: `2026-10-12-1`, 161 Vokabeln, 161 Beispiele, 16 Lektionsaufgaben und 21 Zeichen-Metadaten. Die inhaltliche Durchsicht erfolgte durch Codex, ohne unabhängige Prüfung durch eine muttersprachliche Lehrkraft.

## Vorgehen und Quellen

Die vollständigen Wörterbuchdateien wurden heruntergeladen und die Einträge anhand von Kurzzeichen, Langzeichen und nummerierter Lesung abgeglichen:

- [CC-CEDICT, MDBG-Download](https://www.mdbg.net/chinese/dictionary?page=cedict): 158 direkte Treffer für die gewählte Lesung. Bei 你好吗 wurde die Wendung aus 你、好、吗 geprüft; HanDeDict enthält zusätzlich die gesamte Wendung. Für 后面 und 太阳 unterscheiden sich die bevorzugten Wörterbuchlesungen im neutralen Ton.
- [HanDeDict, Wörterbuchbestand](https://github.com/gugray/HanDeDict/blob/master/handedict.u8): alle 161 gewählten Schriftformen und Lesungen belegt. Deutsche Kernbedeutungen wurden mit dem jeweils passenden Eintrag abgeglichen, nicht mit anders ausgesprochenen Homographen.
- [Yoyo Chinese, Unterrichtsbeispiel für 个](https://cdn.yoyochinese.com/attachment/PDF/LectureNotes/Char-Unit-002-Lesson-01-LN.pdf): gè/ge und sān ge rén unterscheiden Grundton und häufige unbetonte Satzform.

Download-Adressen und SHA-256-Prüfsummen der verwendeten Dateien sowie die ausgewählten Lesungen pro Vokabel stehen in `tests/fixtures/vocabulary-reference.json`. Diese Referenz wurde aus den externen Wörterbuchdateien erzeugt; sie wird beim Test nicht aus der Kursdatei neu erstellt. Lizenzen und Urheberhinweise stehen in [LICENSES.md](../LICENSES.md).

Alle deutschen Bedeutungen, Kurzdefinitionen und Gebrauchshinweise wurden einzeln durchgesehen. Die Beispielsätze wurden auf Grammatik, Bedeutung und Aussprache geprüft; die Lektionsmodelle und akzeptierten Antworten wurden mitgeprüft. Zeichenlesungen und Strichzahlen wurden zusätzlich gegen die Wörterbuchlesungen beziehungsweise vorhandenen Strichdaten geprüft.

## Korrekturen und Präzisierungen

19 Einträge wurden angepasst. Dabei sind sachliche Korrekturen und didaktische Präzisierungen zu unterscheiden; belegte Aussprachevarianten wurden nicht als Fehler behandelt.

| Einträge | Änderung |
| --- | --- |
| 不、有 | Verneinung mit 不 gegenüber 没有 klargestellt; Gebrauch als Nein-Antwort erläutert. |
| 再见 | Die Anrede 老师 auch in der deutschen Beispielübersetzung wiedergegeben. |
| 一 | Tonwechsel mit Beispielen sowie Zählen und Ordnungszahlen erklärt. |
| 吗 | Die irreführende Antwort „ob“ entfernt; Funktion als Ja-Nein-Fragepartikel erklärt. |
| 个 | Grundlesung gè/ge4 eingetragen; unbetontes ge im Satz erklärt und dort beibehalten. Die Antwort „Stück“ entfernt, damit das Zähleinheitswort nicht als Substantiv gelernt wird. |
| 面包 | Den Hinweis auf „viele Backwaren“ auf Brot und Brötchen eingegrenzt. |
| 会 | Erlernte Fähigkeit und Erwartung erklärt; Erlaubnis mit 可以 abgegrenzt. |
| 家 | Zuhause/Familie gegenüber dem Gebäude 房子 deutlicher erklärt. |
| 晚上 | Nacht/nachts ergänzt, passend zum Beispiel bei 睡觉. |
| 月 | Zeitdauer 一个月 gegenüber Kalendermonat 一月 erklärt. |
| 星期 | Sonntag mit 星期日/星期天 ergänzt; Zahlenregel auf Montag bis Samstag beschränkt. |
| 分 | Stellung nach der Minutenzahl präzisiert; 分钟 für eine Zeitdauer genannt. |
| 门 | Das wenig anschauliche Beispiel durch „Die Tür ist links“ ersetzt. |
| 后面、太阳 | Die belegten Varianten mit neutraler zweiter Silbe erklärt. hòumiàn und tàiyáng bleiben gültige Lernlesungen. Das Sonnenbeispiel verwendet nun 今天有太阳. |
| 下 | Bedeutung „fallen“ auf Niederschlag bezogen; Verwendung als Ortswort konkretisiert. |
| 认识 | Kennenlernen sowie Erkennen von Zeichen/Dingen ergänzt. |
| 了 | Die isolierte Antwort „abgeschlossen“ entfernt; vollzogene Handlung und neuer Zustand erklärt. Keine allgemeine Vergangenheitsmarkierung. |

Die Aussprachehilfe erklärt nun ausdrücklich den Unterschied zwischen Grundton auf Wortkarten und gesprochenen Formen von 一、不、个 in Beispielen. Der Offline-Cache wurde auf `cnlearn-v15` erhöht, damit die korrigierten Daten nach Aktivierung des neuen Service Workers ausgeliefert werden.

## Automatische Absicherung und Grenzen

`node tests/vocabulary-reference.test.mjs` prüft alle 161 Schriftformen und gewählten Wörterbuchlesungen, die Übereinstimmung von nummeriertem und tonmarkiertem Pinyin, die Silbenzahl, alle Beispiel- und Lektionsmodell-Lesungen sowie Zeichenlesungen und Strichzahlen. Die Satzprüfung berücksichtigt die dokumentierten Aussprachevarianten, die Tonänderungen von 一/不 und unbetontes 个; sie entscheidet nicht selbst, ob jeder Tonwechsel im Kontext richtig ist.

Neue Vokabeln müssen in den extern geprüften Referenzbestand aufgenommen werden. Die GitHub-Pages-Pipeline führt die Daten- und App-Tests vor der Veröffentlichung aus.

Die Tests prüfen keine deutsche Semantik und können eine sprachliche Prüfung von Änderungen an Bedeutungen, Beispielen und Gebrauchshinweisen nicht ersetzen. Wörterbuchabgleich und redaktionelle Durchsicht liefern keine absolute Fehlerfreiheitsgarantie. Nach dieser Durchsicht sind keine weiteren konkreten Inhaltsfehler bekannt; eine unabhängige Prüfung durch eine qualifizierte Mandarin-Lehrkraft bietet zusätzliche Sicherheit.
