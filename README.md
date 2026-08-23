# Chinesisch lernen

Eine mobile-first Lernapp für deutschsprachige Mandarin-Anfänger. Sie läuft vollständig statisch, speichert den Lernstand in Cookies und verbindet einen kleinen Wiederholungsplan mit Aussprache und interaktiver Strichfolge.

## Lokal starten

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen. Direktes Öffnen als `file://` funktioniert wegen der JSON-Module nicht zuverlässig.

Tests benötigen lediglich Node.js:

```bash
node tests/validate-data.mjs
node tests/progress.test.mjs
```

## Aufbau

- `data/`: versionierter Wortschatz, Zeichen-Metadaten und Lektionen
- `js/`: UI, Zustand, Cookie-Persistenz, Planer, Audio und Hanzi-Writer-Adapter
- `character-data/`: nur die für den aktuellen Datensatz benötigten Strichdaten
- `vendor/`: lokal fixierte Fremdbibliothek

Ein Wort erhält eine stabile ID und getrennte Angaben für Kurzübersetzung, Gebrauchshinweis, Schriftform, Pinyin, Zeichen und Beispiel. Neue Einträge werden gegen HanDeDict und CC-CEDICT geprüft, in kleinen Chargen ergänzt und anschließend mit `validate-data.mjs` validiert.

## GitHub Pages

Repository zu GitHub pushen und unter **Settings → Pages → Build and deployment → GitHub Actions** wählen. Der enthaltene Workflow publiziert die statischen Dateien. Alle Laufzeitpfade sind relativ und funktionieren daher auch unter einem Repository-Unterpfad.

## Datenschutz und Sicherung

Es gibt kein Backend und keine Analyse. Fortschritt und Einstellungen bleiben in Cookies (`SameSite=Lax`, unter HTTPS zusätzlich `Secure`). In den Einstellungen lässt sich eine JSON-Sicherung exportieren und nach Schema-Prüfung wieder importieren.

## Inhalte beitragen

Bitte keine ungeprüften Wortlisten importieren. Jeden Eintrag in beiden Wörterbüchern prüfen, die deutsche Anfängerbedeutung knapp formulieren, einen Gebrauchshinweis und ein einfaches Beispiel ergänzen sowie die Tests ausführen. Lizenz- und Quellenhinweise stehen in [LICENSES.md](LICENSES.md).
