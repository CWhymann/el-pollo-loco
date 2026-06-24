import { canvas, ctx } from "./canvas.js";
import { MovableObject } from "../classes/movable-object.class.js";

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Was passiert hier?
// clearRect() -> löscht den Canvas jeden Frame -TafelWischen- :-)
//requestAnimationFrame() -> ruft gameLoop ungefähr60x pro sek. auf, perfekt synchronisiert mit dem Browser
//Der Import von MovaleObjekt ist vorbereitet- ich brauche Ihn gleich
