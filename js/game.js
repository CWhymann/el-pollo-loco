import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";
import { Keyboard } from "../classes/keyboard.class.js";

const keyboard = new Keyboard();
const character = new Character(keyboard);

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key === " ") keyboard.SPACE = true;
    if (e.key === "d") keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key === " ") keyboard.SPACE = false;
    if (e.key === "d") keyboard.D = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (character.otherDirection) {
        character.drawFlipped(ctx);
    } else {
        character.draw(ctx);
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Was passiert hier?
// clearRect() -> löscht den Canvas jeden Frame -TafelWischen- :-)
//requestAnimationFrame() -> ruft gameLoop ungefähr60x pro sek. auf, perfekt synchronisiert mit dem Browser
//Der Import von MovaleObjekt ist vorbereitet- ich brauche Ihn gleich
//new Character()-> erstellt Pepe und lädt alle Bilder in den Cache
//character.draw(ctx) -> zeichnet Pepe jeden Frame auf den Canvas
//keydown -> setzt die Taste auf true wenn sie gedrückt wird
//keyup -> setzt sie zurück auf false wenn sie losgelassen wird
//So wissen wir jederzeit welche Tasten gerade gehalten werden
