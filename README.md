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
```

## Lernkonzept

Neue Wörter werden zunächst in einem verständlichen Beispiel eingeführt und danach in derselben Sitzung aktiv abgerufen. Fehlerhafte Karten erscheinen nach einigen anderen Aufgaben erneut. Die Wiederholung trainiert getrennt Bedeutung, aktiven Abruf, Hörverstehen, lexikalische Töne, Satztransfer, Aussprache und optionales Schreiben. Eine Lektion gilt erst nach erfolgreichen Abrufen an mindestens zwei Tagen und einer freien Can-do-Aufgabe als gemeistert.

Der Kurs führt zuerst verwendbare Bausteine und Satzmuster ein. Regelmäßige Formen wie Zahlen über zehn werden aus diesen Bausteinen erzeugt statt als isolierte Wortkarten auswendig gelernt. Auswahlaufgaben dienen vor allem dem Hören; produktive Aufgaben verlangen eine selbst formulierte Antwort.

Pinyin dient als einstellbares Gerüst und wird auf Wunsch mit wachsender Sicherheit ausgeblendet. Unbekannte Wörter in Beispielsätzen besitzen direkt zugängliche Kurzglossen. Die Aussprache stammt aus der lokalen chinesischen Systemstimme; die App kennzeichnet sie ausdrücklich als synthetisch.

## Aufbau

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
