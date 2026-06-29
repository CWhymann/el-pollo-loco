import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { World } from "../classes/world.class.js";
import { initFullscreen } from "./fullscreen.js";
initFullscreen();

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

document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
});
document
    .getElementById("btn-left")
    .addEventListener("touchend", () => (keyboard.LEFT = false));

document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
});
document
    .getElementById("btn-right")
    .addEventListener("touchend", () => (keyboard.RIGHT = false));

document.getElementById("btn-jump").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
});
document
    .getElementById("btn-jump")
    .addEventListener("touchend", () => (keyboard.SPACE = false));

document.getElementById("btn-throw").addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
});
document
    .getElementById("btn-throw")
    .addEventListener("touchend", () => (keyboard.D = false));

document.addEventListener("contextmenu", (e) => e.preventDefault());

const world = new World(character, canvas, ctx);
