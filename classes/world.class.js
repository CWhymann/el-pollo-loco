import { StatusBar } from "../classes/status-bar.class.js";
import { StartScreen } from "../classes/start-screen.class.js";
import { GameOverScreen } from "../classes/game-over-screen.class.js";
import { WinScreen } from "../classes/win-screen.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { StartScreenChicken } from "../classes/start-screen-chicken.class.js";
import { ControlsDialog } from "../classes/controls-dialog.class.js";
import { SettingsDialog } from "../classes/settings-dialog.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { WorldAudio } from "./world-audio.class.js";
import { WorldCollisions } from "./world-collisions.class.js";
import { WorldRendering } from "./world-rendering.class.js";
import { WorldGameControl } from "./world-game-control.class.js";

/**
 * Represents the main game world.
 * Manages the game loop, rendering, collisions, audio and UI state.
 */
// #region class World
export class World {
    // #region Properties
    character;
    level = null;
    canvas;
    ctx;
    camera_x = 0;
    throwableObjects = [];
    healthBar = new StatusBar(10, 10, "health");
    bottleBar = new StatusBar(10, 60, "bottle");
    coinBar = new StatusBar(10, 110, "coin");
    totalCoins = 0;
    totalBottles = 0;
    gameStarted = false;
    startScreen = new StartScreen();
    startScreenChicken = new StartScreenChicken();
    controlsDialog = new ControlsDialog();
    controlsDialogVisible = false;
    settingsDialog = new SettingsDialog();
    settingsDialogVisible = false;
    draggingSlider = null;
    gameOver = false;
    gameOverScreen = new GameOverScreen();
    gameWon = false;
    winScreen = new WinScreen();
    spawnIntervalId = null;
    // #endregion

    // #region Constructor
    /**
     * @param {Character} character - The player character.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    constructor(character, canvas, ctx) {
        this.character = character;
        this.canvas = canvas;
        this.ctx = ctx;
        this.character.world = this;
        this.audio = new WorldAudio();
        this.audioManager = this.audio.audioManager;
        this.collisions = new WorldCollisions(this);
        this.rendering = new WorldRendering(this);
        this.gameControl = new WorldGameControl(this);
        this.initAudio();
        this.initButtonListeners();
        this.initCanvasListeners();
        this.rendering.draw();
        this.spawnBottle();
    }

    /** Initialises audio: plays background music and resets collectible bars. */
    initAudio() {
        this.audioManager.play("background");
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
    }
    // #endregion

    // #region Button Listeners
    /** Registers all HTML button click listeners. */
    initButtonListeners() {
        this.initGameButtons();
        this.initDialogButtons();
        this.initMuteButton();
    }

    /** Registers the Start button listener. */
    initStartButton() {
        const startButton = document.getElementById("start-button");
        if (startButton)
            startButton.addEventListener("click", () =>
                this.gameControl.startGame(),
            );
    }

    /** Registers the Restart button listener. */
    initRestartButton() {
        const restartButton = document.getElementById("restart-button");
        if (restartButton)
            restartButton.addEventListener("click", () =>
                this.gameControl.resetGame(),
            );
    }

    /** Registers the Back-to-Start button listener. */
    initBackButton() {
        const backButton = document.getElementById("back-to-start-button");
        if (backButton)
            backButton.addEventListener("click", () =>
                this.gameControl.returnToStart(),
            );
    }

    /** Registers Start, Restart and Back-to-Start button listeners. */
    initGameButtons() {
        this.initStartButton();
        this.initRestartButton();
        this.initBackButton();
    }

    /** Registers the Controls button listener. */
    initControlsButton(startScreenElement) {
        const controlsButton = document.getElementById("controls-button");
        if (controlsButton) {
            controlsButton.addEventListener("click", () => {
                this.controlsDialogVisible = true;
                if (startScreenElement)
                    startScreenElement.style.visibility = "hidden";
            });
        }
    }

    /** Registers the Settings button listener. */
    initSettingsButton(startScreenElement) {
        const settingsButton = document.getElementById("settings-button");
        if (settingsButton) {
            settingsButton.addEventListener("click", () =>
                this.openSettingsDialog(startScreenElement),
            );
        }
    }

    /** Registers Controls and Settings button listeners. */
    initDialogButtons() {
        const startScreenElement = document.getElementById("start-screen");
        this.initControlsButton(startScreenElement);
        this.initSettingsButton(startScreenElement);
    }

    /**
     * Opens the settings dialog and syncs slider values with AudioManager.
     * @param {HTMLElement} startScreenElement - The start screen element to hide.
     */
    openSettingsDialog(startScreenElement) {
        this.settingsDialog.musicVolume = this.audioManager.musicVolume;
        this.settingsDialog.effectsVolume = this.audioManager.effectsVolume;
        this.settingsDialogVisible = true;
        if (startScreenElement) startScreenElement.style.visibility = "hidden";
    }

    /** Registers the mute button click listener and sets the initial icon. */
    initMuteButton() {
        const muteButton = document.getElementById("mute-button");
        if (!muteButton) return;
        muteButton.textContent = this.audioManager.isMuted ? "🔇" : "🔊";
        muteButton.addEventListener("click", () => {
            this.audioManager.toggleMute();
            muteButton.textContent = this.audioManager.isMuted ? "🔇" : "🔊";
        });
    }
    // #endregion

    // #region Canvas Listeners
    /** Registers all canvas mouse and touch event listeners. */
    initCanvasListeners() {
        this.initMouseListeners();
        this.initTouchListeners();
    }

    /** Registers all mouse event listeners on the canvas. */
    initMouseListeners() {
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener("mousedown", (e) =>
            this.handleCanvasMouseDown(e),
        );
        this.canvas.addEventListener("mousemove", (e) =>
            this.handleCanvasMouseMove(e),
        );
        window.addEventListener("mouseup", () => this.handleCanvasMouseUp());
    }

    /** Registers all touch event listeners on the canvas. */
    initTouchListeners() {
        this.canvas.addEventListener(
            "touchstart",
            (e) => this.handleCanvasTouchStart(e),
            { passive: false },
        );
        this.canvas.addEventListener(
            "touchmove",
            (e) => this.handleCanvasTouchMove(e),
            { passive: false },
        );
        this.canvas.addEventListener("touchend", (e) =>
            this.handleCanvasTouchEnd(e),
        );
    }

    /**
     * Handles canvas clicks to close any open overlay dialog.
     * @param {MouseEvent} e - The click event.
     */
    handleCanvasClick(e) {
        if (!this.controlsDialogVisible && !this.settingsDialogVisible) return;
        const { x: px, y: py } = this.getCanvasCoords(e);
        if (this.controlsDialogVisible)
            this.tryCloseDialog(
                this.controlsDialog,
                px,
                py,
                "controlsDialogVisible",
            );
        if (this.settingsDialogVisible)
            this.tryCloseDialog(
                this.settingsDialog,
                px,
                py,
                "settingsDialogVisible",
            );
    }

    /**
     * Starts dragging a volume slider knob if the click landed on one.
     * @param {MouseEvent} e - The mouse event.
     */
    handleCanvasMouseDown(e) {
        if (!this.settingsDialogVisible) return;
        const { x, y } = this.getCanvasCoords(e);
        if (this.settingsDialog.isMusicSliderHit(x, y))
            this.draggingSlider = "music";
        else if (this.settingsDialog.isEffectsSliderHit(x, y))
            this.draggingSlider = "effects";
    }

    /**
     * Updates the dragged slider value and applies it to the AudioManager.
     * @param {MouseEvent} e - The mouse event.
     */
    handleCanvasMouseMove(e) {
        if (!this.draggingSlider) return;
        const { x } = this.getCanvasCoords(e);
        this.applySliderValue(x);
    }

    /** Stops dragging the active slider knob on mouse release. */
    handleCanvasMouseUp() {
        this.draggingSlider = null;
    }

    /**
     * Converts browser mouse coordinates to internal canvas coordinates.
     * @param {MouseEvent} e - The mouse event.
     * @returns {{x: number, y: number}} The point in canvas space.
     */
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }

    /**
     * Starts dragging a volume slider knob if the touch landed on one.
     * @param {TouchEvent} e - The touch event.
     */
    handleCanvasTouchStart(e) {
        if (!this.settingsDialogVisible) return;
        const { x, y } = this.getTouchCoords(e);
        if (this.settingsDialog.isMusicSliderHit(x, y))
            this.draggingSlider = "music";
        else if (this.settingsDialog.isEffectsSliderHit(x, y))
            this.draggingSlider = "effects";
    }

    /**
     * Updates the dragged slider value via touch and applies it to AudioManager.
     * @param {TouchEvent} e - The touch event.
     */
    handleCanvasTouchMove(e) {
        if (!this.draggingSlider) return;
        e.preventDefault();
        const { x } = this.getTouchCoords(e);
        this.applySliderValue(x);
    }

    /**
     * Stops dragging or handles dialog closing on touch release.
     * @param {TouchEvent} e - The touch event.
     */
    handleCanvasTouchEnd(e) {
        if (this.draggingSlider) {
            this.draggingSlider = null;
            return;
        }
        this.closeTouchDialog(e);
    }

    /**
     * Closes any open dialog on touch release outside or on close icon.
     * @param {TouchEvent} e - The touch event.
     */
    closeTouchDialog(e) {
        if (!this.controlsDialogVisible && !this.settingsDialogVisible) return;
        const { x: px, y: py } = this.getTouchCoords(e);
        if (this.controlsDialogVisible)
            this.tryCloseDialog(
                this.controlsDialog,
                px,
                py,
                "controlsDialogVisible",
            );
        if (this.settingsDialogVisible)
            this.tryCloseDialog(
                this.settingsDialog,
                px,
                py,
                "settingsDialogVisible",
            );
    }

    /**
     * Converts touch coordinates to internal canvas coordinates.
     * @param {TouchEvent} e - The touch event.
     * @returns {{x: number, y: number}} The point in canvas space.
     */
    getTouchCoords(e) {
        const touch = e.touches[0] || e.changedTouches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
        };
    }

    /**
     * Applies the current slider x position to the correct AudioManager volume.
     * @param {number} x - The x coordinate in canvas space.
     */
    applySliderValue(x) {
        const value = this.settingsDialog.getValueFromX(x);
        if (this.draggingSlider === "music") {
            this.settingsDialog.musicVolume = value;
            this.audioManager.setMusicVolume(value);
        } else if (this.draggingSlider === "effects") {
            this.settingsDialog.effectsVolume = value;
            this.audioManager.setEffectsVolume(value);
        }
    }

    /**
     * Closes a dialog if the click was on its close icon or outside its box.
     * @param {ControlsDialog|SettingsDialog} dialog - The dialog to check.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @param {string} visibilityProp - The World property that flags visibility.
     */
    tryCloseDialog(dialog, px, py, visibilityProp) {
        if (dialog.isCloseHit(px, py) || dialog.isOutsideBox(px, py)) {
            this[visibilityProp] = false;
            const el = document.getElementById("start-screen");
            if (el) el.style.visibility = "visible";
        }
    }
    // #endregion

    // #region Camera
    /** Moves the camera so the character stays near the left quarter of the screen. */
    updateCamera() {
        this.camera_x = -this.character.x + 100;
    }
    // #endregion

    // #region Spawning
    /** Spawns a new ground bottle every 10 seconds if fewer than 5 are on the floor. */
    spawnBottle() {
        this.spawnIntervalId = IntervalHub.startInterval(() => {
            if (this.level && this.level.bottles.length < 5) {
                const x = 200 + Math.random() * 1800;
                this.level.bottles.push(new Bottle(x, 380));
            }
        }, 10000);
    }
    // #endregion
}
// #endregion class World
