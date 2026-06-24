import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";

const character = new Character();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.draw(ctx);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Was passiert hier?
// clearRect() -> löscht den Canvas jeden Frame -TafelWischen- :-)
//requestAnimationFrame() -> ruft gameLoop ungefähr60x pro sek. auf, perfekt synchronisiert mit dem Browser
//Der Import von MovaleObjekt ist vorbereitet- ich brauche Ihn gleich
//new Character()-> erstellt Pepe und lädt alle Bilder in den Cache
//character.draw(ctx) -> zeichnet Pepe jeden Frame auf den Canvas
