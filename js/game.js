import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { World } from "../classes/world.class.js";
import { initFullscreen } from "./fullscreen.js";

const keyboard = new Keyboard();
const character = new Character(keyboard);

// #region Keyboard Input
/**
 * Registers keyboard input events.
 */
function initKeyboard() {
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") keyboard.LEFT = true;
        if (e.key === "ArrowRight") keyboard.RIGHT = true;
        if (e.key === "ArrowUp") keyboard.UP = true;
        if (e.key === " ") {
            e.preventDefault();
            keyboard.SPACE = true;
        }
        if (e.key === "d") keyboard.D = true;
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") keyboard.LEFT = false;
        if (e.key === "ArrowRight") keyboard.RIGHT = false;
        if (e.key === "ArrowUp") keyboard.UP = false;
        if (e.key === " ") keyboard.SPACE = false;
        if (e.key === "d") keyboard.D = false;
    });
}
// #endregion

// #region Touch Input
/**
 * Registers touch input events for mobile controls.
 */
function initTouchControls() {
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
}
// #endregion

initFullscreen();
initKeyboard();
initTouchControls();

const world = new World(character, canvas, ctx);
