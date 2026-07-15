# 🐔 El Pollo Loco

Ein Jump-and-Run Spiel entwickelt im Rahmen der Developer Akademie.
Steuere Pepe durch die Wüste, sammle Münzen und Flaschen,
besiege Hühner und stelle dich dem Endboss — El Pollo Loco!

---

## 🎮 Features

- Animierter Loading Screen mit drehender Salsa-Flasche
- Vollbildmodus (Fullscreen API)
- Responsive Mobile-Unterstützung im Querformat
- Touch-Steuerung für Smartphones und Tablets
- Hintergrundmusik und Soundeffekte mit Mute-Funktion
- Lautstärkeregelung für Musik und Effekte getrennt
- Steuerung-Dialog mit Tasten- und Touch-Übersicht
- Game Over und Win Screen mit Restart und Back-to-Start
- Münzen und Flaschen einsammeln mit Status-Bars
- Flaschen werfen und Gegner besiegen
- Endboss mit eigener KI und Phasen-Animationen
- Knockout-System für kleine Hühner

---

## 🛠️ Technologien

- HTML5 Canvas
- Vanilla JavaScript (ES6 Module)
- CSS3 (Animationen, Flexbox, Media Queries)
- Web Audio API (über AudioManager)
- Fullscreen API

---

## 📁 Projektstruktur

el-pollo-loco/
├── index.html
├── README.md
├── assets/
│ ├── audio/
│ ├── fonts/
│ ├── icons/
│ └── img/
├── classes/
│ ├── movable-object.class.js # Basisklasse für alle beweglichen Objekte
│ ├── character.class.js # Spielercharakter Pepe
│ ├── endboss.class.js # Endboss El Pollo Loco
│ ├── chicken.class.js # Normales Huhn
│ ├── chicken-small.class.js # Kleines Huhn (Knockout-System)
│ ├── throwable-object.class.js # Geworfene Salsa-Flasche
│ ├── bottle.class.js # Aufsammelbare Flasche
│ ├── coin.class.js # Münze
│ ├── cloud.class.js # Hintergrundwolke
│ ├── background-object.class.js # Hintergrundobjekt
│ ├── status-bar.class.js # HUD-Statusbar (Leben, Flaschen, Münzen)
│ ├── start-screen.class.js # Startscreen-Hintergrund
│ ├── start-screen-chicken.class.js # Animiertes Huhn auf dem Startscreen
│ ├── game-over-screen.class.js # Game Over Overlay
│ ├── win-screen.class.js # Win Screen Overlay
│ ├── controls-dialog.class.js # Steuerung-Dialog (Canvas)
│ ├── settings-dialog.class.js # Lautstärke-Dialog (Canvas)
│ ├── audio-manager.class.js # Sound-Verwaltung
│ ├── keyboard.class.js # Tastatur-Status
│ ├── interval-hub.class.js # Zentrales Interval-Management
│ ├── world.class.js # Hauptklasse der Spielwelt
│ ├── world-audio.class.js # Audio-Initialisierung
│ ├── world-collisions.class.js # Kollisionserkennung
│ ├── world-rendering.class.js # Render-Loop und Zeichnung
│ └── world-game-control.class.js # Spielzustand (Start, Reset, Return)
├── css/
│ ├── reset.css
│ ├── fonts.css
│ ├── style.css
│ └── mobile.css
├── js/
│ ├── canvas.js # Canvas-Element und Kontext
│ ├── game.js # Einstiegspunkt und Boot-Sequenz
│ └── fullscreen.js # Vollbild-Toggle
├── levels/
│ └── level1.js # Level-Aufbau und Gegner-Platzierung
└── impressum/
├── impressum.html
└── impressum.css

---

## 🚀 Installation & Start

1. Repository klonen:

```bash
   git clone https://github.com/CWhymann/el-pollo-loco.git
```

2. Projekt im Browser öffnen:

```bash
   # Mit Live Server in VS Code (empfohlen)
   # Rechtsklick auf index.html → "Open with Live Server"
```

> ⚠️ Das Spiel nutzt ES6 Module — es muss über einen lokalen Server geöffnet werden,
> nicht direkt als Datei (`file://`).

---

## 🎹 Steuerung

### Tastatur

| Taste       | Aktion             |
| ----------- | ------------------ |
| `→`         | Nach rechts laufen |
| `←`         | Nach links laufen  |
| `Leertaste` | Springen           |
| `D`         | Flasche werfen     |

### Mobile (Touch)

| Button | Aktion             |
| ------ | ------------------ |
| `◀`    | Nach links laufen  |
| `▶`    | Nach rechts laufen |
| `▲`    | Springen           |
| `🍶`   | Flasche werfen     |

---

## ✨ Extras

- **Loading Screen** — Animierte Salsa-Flasche mit Fortschrittsbalken beim Laden
- **Fullscreen** — Vollbildmodus über den ⛶ Button
- **Mobile First** — Querformat auf Smartphones und Tablets vollständig spielbar
- **Portrait-Hinweis** — Drehaufforderung im Hochformat
- **Lautstärkeregelung** — Musik und Effekte separat einstellbar via ⚙️
- **Mute** — Alle Sounds auf einmal stummschalten via 🔊

---

## 👨‍💻 Entwickelt von

Christian Wiemann — Developer Akademie 2026
