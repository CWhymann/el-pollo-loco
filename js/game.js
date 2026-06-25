import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { World } from "../classes/world.class.js";

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

const world = new World(character, canvas, ctx);
