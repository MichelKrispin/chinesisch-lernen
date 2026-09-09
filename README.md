# Chinesisch lernen

Vollständig von ChatGPT erstellte Lernapp.
Sie ist statisch, speichert alles in Cookies, hilft bei der Aussprache und der Strichfolge der Zeichen.

Es wird nichts gespeichert; es gibt kein Backend, keine Datenbanken, keine Analyse.
Der Fortschritt wird nur lokal im Browser gespeichert.
Wenn also die Cookies gelöscht werden, dann wird auch der Fortschritt gelöscht.
(Der Fortschritt lässt sich aber exportieren und bei Bedarf wieder importieren.)

# Notiz von ChatGPT

## Lokal starten

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen. Direktes Öffnen als `file://` funktioniert wegen der JSON-Module nicht zuverlässig.

Tests benötigen lediglich Node.js:

```bash
node tests/validate-data.mjs
node tests/progress.test.mjs
node tests/scheduler.test.mjs
node tests/writing.test.mjs
node tests/writing-page.test.mjs
```

## Lernkonzept

Neue Wörter werden zunächst in einem verständlichen Beispiel eingeführt und danach in derselben Sitzung aktiv abgerufen. Fehlerhafte Karten erscheinen nach einigen anderen Aufgaben höchstens zweimal erneut und werden für morgen eingeplant. Die Wiederholung trainiert getrennt Bedeutung, aktiven Abruf, Hörverstehen, lexikalische Töne, Satztransfer, Aussprache und optionales Schreiben. Eine Lektion gilt erst nach erfolgreichen Abrufen an mindestens zwei Tagen und einer freien Can-do-Aufgabe als gemeistert.

Die Einstellung für neue Wörter bestimmt die Portionsgröße, kein Tageslimit. Alle Lektionen sind zugänglich; neue Wörter folgen der Kursreihenfolge. Nach jeder Sitzung sind weitere neue Wörter oder freies Üben möglich. Wiederholungen richten sich nach lokalen Kalendertagen: der erste erfolgreiche Abruf wird morgen wiederholt, spätere fällige Erfolge nach 2, 4, 7, 14, 30, 60 und 120 Tagen. Üben vor dem Termin oder mehrfach am selben Tag verlängert diese Abstände nicht. Unterbrochene Einführungen bleiben fällig.

Der Kurs führt zuerst verwendbare Bausteine und Satzmuster ein. Regelmäßige Formen wie Zahlen über zehn werden aus diesen Bausteinen erzeugt statt als isolierte Wortkarten auswendig gelernt. Auswahlaufgaben dienen vor allem dem Hören; produktive Aufgaben verlangen eine selbst formulierte Antwort.

Pinyin dient als einstellbares Gerüst und wird auf Wunsch mit wachsender Sicherheit ausgeblendet. Unbekannte Wörter in Beispielsätzen besitzen direkt zugängliche Kurzglossen. Die Aussprache stammt aus der lokalen chinesischen Systemstimme; die App kennzeichnet sie ausdrücklich als synthetisch.

Die Aussprache setzt eine chinesische Systemstimme voraus und spricht niemals mit einer fremdsprachigen Ersatzstimme. Mobilgeräte bringen sie mit; auf dem Desktop muss sie vorhanden sein. Unter Linux beziehen Chrome und Firefox ihre Stimmen über `speech-dispatcher` (z. B. mit `espeak-ng`, das Mandarin als `cmn` anbietet) - fehlt das Paket, kennen die Browser gar keine Stimme und die Einstellungen weisen darauf hin.

## Aufbau

Kurze Schreibsessions umfassen bis zu fünf fällige oder neue Zeichen im Gedächtnismodus, mit fälligen Zeichen zuerst. Die Zusammenfassung zeigt fehlerfreie und unterstützte Ergebnisse, Fehler, Hinweise sowie übersprungene oder unterbrochene Aufgaben. Die Session läuft im Arbeitsspeicher; ihre einzelnen Schreibversuche werden weiterhin sofort gespeichert.

Der Schreibplan ist unabhängig vom Wortschatzplan: fehlerhafte oder unterstützte abgeschlossene Gedächtnisversuche werden morgen fällig, unterbrochene bleiben fällig. Fehlerfreie fällige Abrufe verlängern den Abstand über 1, 2, 4, 7, 14, 30, 60 und 120 Tage. Vorzeitige oder weitere erfolgreiche Versuche am selben Tag verlängern ihn nicht. Nachzeichnen und Ansehen verändern diesen Plan nicht. Alte Schreibdaten ohne Plan bleiben kompatibel und werden zur Wiederholung angeboten.

Pro Modus werden außerdem die drei Striche mit den meisten Fehlern in den gespeicherten Versuchen angezeigt. Die Nummerierung beginnt bei Strich 1; Fehler an demselben Strich werden addiert. Strichfehler und Schreibplan sind ebenfalls Teil der Sicherung.

Die Schreibseite speichert pro Zeichen getrennt die letzten 30 Versuche im Nachzeichnen und im Gedächtnismodus. Fehler, angeforderte Hinweise und angefangene Versuche werden sofort in Cookies gesichert; abgeschlossene Versuche werden als fehlerfrei oder mit Fehlern / Hilfe markiert. Ansehen zählt nicht als Versuch. „Schwieriges Zeichen üben“ wählt Zeichen mit einem zuletzt fehlerhaften, unterstützten oder unterbrochenen Gedächtnisversuch; danach kommen ungeübte Zeichen. Export, Import und Zurücksetzen umfassen diese Schreibdaten.

- `data/`: versionierter Wortschatz, Zeichen-Metadaten und Lektionen
- `js/`: UI, Zustand, Cookie-Persistenz, Planer, Audio und Hanzi-Writer-Adapter
- `character-data/`: nur die für den aktuellen Datensatz benötigten Strichdaten
- `vendor/`: lokal fixierte Fremdbibliothek

Ein Wort erhält eine stabile ID und getrennte Angaben für Kurzübersetzung, Gebrauchshinweis, Schriftform, Pinyin, Zeichen und Beispiel.
Neue Einträge werden gegen HanDeDict und CC-CEDICT geprüft, in kleinen Chargen ergänzt und anschließend mit `validate-data.mjs` validiert.

## Inhalte beitragen

Bitte keine ungeprüften Wortlisten importieren.
Jeden Eintrag in beiden Wörterbüchern prüfen, die deutsche Anfängerbedeutung knapp formulieren, einen Gebrauchshinweis und ein einfaches Beispiel ergänzen sowie die Tests ausführen.
Lizenz- und Quellenhinweise stehen in [LICENSES.md](LICENSES.md).
