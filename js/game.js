import { canvas, ctx } from "./canvas.js";
import { Character } from "../classes/character.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { World } from "../classes/world.class.js";
import { initFullscreen } from "./fullscreen.js";

const keyboard = new Keyboard();
const character = new Character(keyboard);

// #region Keyboard Input
/**
 * Registers keydown and keyup listeners for all game-relevant keys.
 * Prevents the default Space behaviour to stop HTML buttons being re-triggered.
 */
function initKeyboard() {
    window.addEventListener("keydown", (e) => handleKeyDown(e));
    window.addEventListener("keyup", (e) => handleKeyUp(e));
}

/**
 * Sets the matching keyboard flag to true on key press.
 * @param {KeyboardEvent} e - The keydown event.
 */
function handleKeyDown(e) {
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key === " ") {
        e.preventDefault();
        keyboard.SPACE = true;
    }
    if (e.key === "d") keyboard.D = true;
}

/**
 * Resets the matching keyboard flag to false on key release.
 * @param {KeyboardEvent} e - The keyup event.
 */
function handleKeyUp(e) {
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key === " ") keyboard.SPACE = false;
    if (e.key === "d") keyboard.D = false;
}
// #endregion

// #region Touch Input
/**
 * Registers touchstart and touchend listeners for all on-screen buttons.
 * Prevents context menus on long-press.
 */
function initTouchControls() {
    registerTouchButton("btn-left", "LEFT");
    registerTouchButton("btn-right", "RIGHT");
    registerTouchButton("btn-jump", "SPACE");
    registerTouchButton("btn-throw", "D");
    document.addEventListener("contextmenu", (e) => e.preventDefault());
}

/**
 * Binds touchstart and touchend on a button element to a keyboard flag.
 * @param {string} id - The HTML element ID of the touch button.
 * @param {string} key - The Keyboard property to toggle (e.g. 'LEFT').
 */
function registerTouchButton(id, key) {
    const btn = document.getElementById(id);
    btn.addEventListener(
        "touchstart",
        (e) => {
            e.preventDefault();
            keyboard[key] = true;
        },
        { passive: false },
    );
    btn.addEventListener("touchend", () => {
        keyboard[key] = false;
    });
}
// #endregion

// #region Imprint Navigation
/**
 * Registers the click event for navigating to the imprint page.
 */
function initImprintLink() {
    const imprintButton = document.getElementById("imprint-button");
    if (imprintButton) {
        imprintButton.addEventListener("click", () => {
            window.location.href = "impressum/impressum.html";
        });
    }
}
// #endregion

// #region Loading Screen
/**
 * Initialises the loading screen progression and handles transitioning to the game.
 */
function initLoadingScreen() {
    const screen = document.getElementById("loading-screen");
    const wrapper = document.getElementById("game-wrapper");
    if (screen && wrapper) startProgressInterval(screen, wrapper);
}

/**
 * Starts the progression simulation interval.
 * @param {HTMLElement} screen 
 * @param {HTMLElement} wrapper 
 */
function startProgressInterval(screen, wrapper) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            finishLoading(screen, wrapper);
        }
        updateLoadingProgress(progress);
    }, 100);
}

/**
 * Updates the loading bar and text percentage.
 * @param {number} progress 
 */
function updateLoadingProgress(progress) {
    const loadingBar = document.getElementById("loading-bar");
    const loadingPercent = document.getElementById("loading-percent");
    if (loadingBar) loadingBar.style.width = `${progress}%`;
    if (loadingPercent) loadingPercent.textContent = `${progress}%`;
}

/**
 * Initiates the transition to fade out loading screen and show game wrapper.
 * @param {HTMLElement} screen 
 * @param {HTMLElement} wrapper 
 */
function finishLoading(screen, wrapper) {
    setTimeout(() => {
        screen.style.transition = "opacity 0.5s ease-out";
        screen.style.opacity = "0";
        wrapper.style.display = "flex";
        hideLoadingScreen(screen);
    }, 300);
}

/**
 * Fully hides the loading screen after the fade animation.
 * @param {HTMLElement} screen 
 */
function hideLoadingScreen(screen) {
    setTimeout(() => {
        screen.style.display = "none";
    }, 500);
}
// #endregion

initLoadingScreen();
initFullscreen();
initKeyboard();
initTouchControls();
initImprintLink();
const world = new World(character, canvas, ctx);
