import { createLevel1 } from "../levels/level1.js";
import { StatusBar } from "../classes/status-bar.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { StartScreen } from "../classes/start-screen.class.js";
import { GameOverScreen } from "../classes/game-over-screen.class.js";
import { WinScreen } from "../classes/win-screen.class.js";
import { AudioManager } from "../classes/audio-manager.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { StartScreenChicken } from "../classes/start-screen-chicken.class.js";
import { ControlsDialog } from "../classes/controls-dialog.class.js";
import { SettingsDialog } from "../classes/settings-dialog.class.js";
import { IntervalHub } from "./interval-hub.class.js";

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
    audioManager = new AudioManager();
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
        this.initAudio();
        this.initButtonListeners();
        this.initCanvasListeners();
        this.draw();
        this.spawnBottle();
    }

    /** Initialises AudioManager: loads volume/mute state and all sounds. */
    initAudio() {
        this.audioManager.loadVolumeState();
        this.audioManager.loadMuteState();
        this.loadSounds();
        this.audioManager.play("background");
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
    }

    /** Registers all HTML button click listeners. */
    initButtonListeners() {
        this.initGameButtons();
        this.initDialogButtons();
        this.initMuteButton();
    }

    /** Registers Start, Restart and Back-to-Start button listeners. */
    initGameButtons() {
        const startButton = document.getElementById("start-button");
        if (startButton)
            startButton.addEventListener("click", () => this.startGame());
        const restartButton = document.getElementById("restart-button");
        if (restartButton)
            restartButton.addEventListener("click", () => this.resetGame());
        const backButton = document.getElementById("back-to-start-button");
        if (backButton)
            backButton.addEventListener("click", () => this.returnToStart());
    }

    /** Registers Controls and Settings button listeners. */
    initDialogButtons() {
        const startScreenElement = document.getElementById("start-screen");
        const controlsButton = document.getElementById("controls-button");
        if (controlsButton) {
            controlsButton.addEventListener("click", () => {
                this.controlsDialogVisible = true;
                if (startScreenElement)
                    startScreenElement.style.visibility = "hidden";
            });
        }
        const settingsButton = document.getElementById("settings-button");
        if (settingsButton) {
            settingsButton.addEventListener("click", () =>
                this.openSettingsDialog(startScreenElement),
            );
        }
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

    /** Registers all canvas mouse and touch event listeners. */
    initCanvasListeners() {
        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener("mousedown", (e) =>
            this.handleCanvasMouseDown(e),
        );
        this.canvas.addEventListener("mousemove", (e) =>
            this.handleCanvasMouseMove(e),
        );
        window.addEventListener("mouseup", () => this.handleCanvasMouseUp());
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
    // #endregion

    // #region Sound Setup
    /** Loads all game sounds by category into the AudioManager. */
    loadSounds() {
        this.loadCharacterSounds();
        this.loadEnemySounds();
        this.loadCollectibleSounds();
        this.loadThrowableSounds();
        this.loadGameSounds();
    }

    /** Loads all character-related sounds. */
    loadCharacterSounds() {
        this.audioManager.loadSound(
            "jump",
            "assets/audio/EPL_sounds/sounds/character/characterJump.wav",
        );
        this.audioManager.loadSound(
            "run",
            "assets/audio/EPL_sounds/sounds/character/characterRun.mp3",
            true,
        );
        this.audioManager.loadSound(
            "damage",
            "assets/audio/EPL_sounds/sounds/character/characterDamage.mp3",
        );
        this.audioManager.loadSound(
            "gameOver",
            "assets/audio/EPL_sounds/sounds/game/gameOver.wav",
        );
        this.audioManager.loadSound(
            "snoring",
            "assets/audio/EPL_sounds/sounds/character/characterSnoring.mp3",
        );
    }

    /** Loads all enemy-related sounds. */
    loadEnemySounds() {
        this.audioManager.loadSound(
            "chickenDead",
            "assets/audio/EPL_sounds/sounds/chicken/chickenDead.mp3",
        );
        this.audioManager.loadSound(
            "chickenDead2",
            "assets/audio/EPL_sounds/sounds/chicken/chickenDead2.mp3",
        );
        this.audioManager.loadSound(
            "chickenKnockout",
            "assets/audio/EPL_sounds/sounds/chicken/chickenKnockout.wav",
        );
        this.audioManager.loadSound(
            "endbossApproach",
            "assets/audio/EPL_sounds/sounds/endboss/endbossApproach.wav",
        );
        this.audioManager.loadSound(
            "endbossHurt",
            "assets/audio/EPL_sounds/sounds/endboss/endbossHurt.mp3",
        );
        this.audioManager.loadSound(
            "endbossDead",
            "assets/audio/EPL_sounds/sounds/endboss/grillen.mp3",
        );
    }

    /** Loads all collectible-related sounds. */
    loadCollectibleSounds() {
        this.audioManager.loadSound(
            "coin",
            "assets/audio/EPL_sounds/sounds/collectibles/collectSound.wav",
        );
        this.audioManager.loadSound(
            "bottlePickup",
            "assets/audio/EPL_sounds/sounds/collectibles/bottleCollectSound.wav",
        );
    }

    /** Loads all throwable-related sounds. */
    loadThrowableSounds() {
        this.audioManager.loadSound(
            "bottleBreak",
            "assets/audio/EPL_sounds/sounds/throwable/bottleBreak.mp3",
        );
        this.audioManager.loadSound(
            "bottleShot",
            "assets/audio/EPL_sounds/sounds/throwable/bottleShot.wav",
        );
    }

    /** Loads all game-state sounds (music, win, start). */
    loadGameSounds() {
        this.audioManager.loadSound(
            "gameWin",
            "assets/audio/EPL_sounds/sounds/game/gameWin.wav",
        );
        this.audioManager.loadSound(
            "gameStart",
            "assets/audio/EPL_sounds/sounds/game/gameStart.mp3",
        );
        this.audioManager.loadSound(
            "background",
            "assets/audio/EPL_sounds/sounds/game/backgroundMusic.mp3",
            true,
            true,
        );
    }
    // #endregion

    // #region Game Control
    /** Starts the game: resets state, loads level and shows game UI. */
    startGame() {
        this.resetCharacterState();
        this.resetStatusBars();
        this.loadLevel();
        this.gameStarted = true;
        this.audioManager.play("gameStart");
        if (this.audioManager.sounds.background.paused)
            this.audioManager.play("background");
        this.updateStartScreenVisibility(false);
    }

    /** Resets the character's position, energy and inventory to defaults. */
    resetCharacterState() {
        this.character.x = 0;
        this.character.y = 155;
        this.character.energy = 100;
        this.character.bottles = 0;
        this.character.coins = 0;
        this.character.speedY = 0;
        this.character.otherDirection = false;
    }

    /** Resets all three status bars to their initial percentages. */
    resetStatusBars() {
        this.healthBar.setPercentage(100);
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
    }

    /** Creates a fresh level instance and assigns world reference to enemies. */
    loadLevel() {
        this.level = createLevel1();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    /**
     * Shows or hides the start screen and game UI.
     * @param {boolean} show - True to show start screen, false to show game UI.
     */
    updateStartScreenVisibility(show) {
        const startScreen = document.getElementById("start-screen");
        const gameUi = document.getElementById("game-ui");
        if (startScreen) startScreen.style.display = show ? "block" : "none";
        if (gameUi) gameUi.style.display = show ? "none" : "flex";
    }

    /** Resets the full game state and restarts immediately without reloading. */
    resetGame() {
        IntervalHub.stopAllIntervals();
        this.audioManager.stopAll(["background"]);
        this.gameOver = false;
        this.gameWon = false;
        this.gameStarted = true;
        this.throwableObjects = [];
        this.resetCharacterState();
        this.resetStatusBars();
        this.loadLevel();
        this.spawnBottle();
        this.audioManager.play("gameStart");
        this.hideEndScreens();
    }

    /** Hides the Game-Over and Win overlay screens. */
    hideEndScreens() {
        const gameOverScreen = document.getElementById("game-over-screen");
        const winScreen = document.getElementById("win-screen");
        if (gameOverScreen) gameOverScreen.style.display = "none";
        if (winScreen) winScreen.style.display = "none";
    }

    /** Stops all level intervals, clears audio and returns to the start screen. */
    returnToStart() {
        IntervalHub.stopAllIntervals();
        this.audioManager.stopAll(["background"]);
        this.gameStarted = false;
        this.gameOver = false;
        this.gameWon = false;
        this.updateStartScreenVisibility(true);
    }
    // #endregion

    // #region Game Loop & Rendering
    /** Main draw loop — clears canvas and delegates to the correct screen. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.gameStarted) {
            this.drawStartScreen();
            return;
        }
        if (this.gameOver) {
            this.drawGameOverScreen();
            return;
        }
        if (this.gameWon) {
            this.drawWinScreen();
            return;
        }
        this.updateCamera();
        this.runCollisionChecks();
        this.drawGameWorld();
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the start screen, animated chicken and any open dialogs. */
    drawStartScreen() {
        this.addToMap(this.startScreen);
        this.addToMap(this.startScreenChicken);
        if (this.controlsDialogVisible) this.addToMap(this.controlsDialog);
        if (this.settingsDialogVisible) this.addToMap(this.settingsDialog);
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the game-over screen and stops the bottle spawn interval. */
    drawGameOverScreen() {
        this.addToMap(this.gameOverScreen);
        if (this.spawnIntervalId)
            IntervalHub.stopInterval(this.spawnIntervalId);
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the win screen and any open overlay dialogs. */
    drawWinScreen() {
        this.addToMap(this.winScreen);
        if (this.settingsDialogVisible) this.addToMap(this.settingsDialog);
        requestAnimationFrame(() => this.draw());
    }

    /** Runs all collision checks for the current frame. */
    runCollisionChecks() {
        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
        this.checkEndbossContact();
        this.removeDeadEnemies();
    }

    /** Renders the full game world: background, enemies, items, HUD. */
    drawGameWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.drawKnockedOutStars();
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.filterAndDrawThrowables();
        this.drawCharacterShadow();
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.drawHud();
    }

    /** Draws knockout stars above every currently stunned ChickenSmall. */
    drawKnockedOutStars() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof ChickenSmall && enemy.isKnockedOut) {
                this.drawKnockoutStars(enemy);
            }
        });
    }

    /** Removes expired throwables, then draws the remaining ones. */
    filterAndDrawThrowables() {
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.thrown || bottle.currentImage < 6,
        );
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Renders the HUD (status bars) and the settings dialog if open. */
    drawHud() {
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        if (this.settingsDialogVisible) this.addToMap(this.settingsDialog);
    }

    /** Draws an elliptical shadow beneath the character, scaled by jump height. */
    drawCharacterShadow() {
        const groundY = 420;
        const heightAboveGround =
            groundY - (this.character.y + this.character.height);
        const scale = Math.max(0.3, 1 - heightAboveGround / 200);
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.character.x + this.character.width / 2,
            groundY,
            35 * scale,
            7.5 * scale,
            0,
            0,
            Math.PI * 2,
        );
        this.ctx.fill();
        this.ctx.restore();
    }
    // #endregion

    // #region Dialog Interaction
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
        const value = this.settingsDialog.getValueFromX(x);
        if (this.draggingSlider === "music") {
            this.settingsDialog.musicVolume = value;
            this.audioManager.setMusicVolume(value);
        } else if (this.draggingSlider === "effects") {
            this.settingsDialog.effectsVolume = value;
            this.audioManager.setEffectsVolume(value);
        }
    }

    /** Stops dragging the active slider knob on mouse release. */
    handleCanvasMouseUp() {
        this.draggingSlider = null;
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
     * Stops dragging or handles dialog closing on touch release.
     * @param {TouchEvent} e - The touch event.
     */
    handleCanvasTouchEnd(e) {
        if (this.draggingSlider) {
            this.draggingSlider = null;
            return;
        }
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
     * Closes a dialog if the click was on its close icon or outside its box.
     * @param {ControlsDialog|SettingsDialog} dialog - The dialog to check.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @param {string} visibilityProp - The World property that flags this dialog's visibility.
     */
    tryCloseDialog(dialog, px, py, visibilityProp) {
        if (dialog.isCloseHit(px, py) || dialog.isOutsideBox(px, py)) {
            this[visibilityProp] = false;
            const el = document.getElementById("start-screen");
            if (el) el.style.visibility = "visible";
        }
    }
    // #endregion

    // #region Camera & Logic
    /** Moves the camera so the character stays near the left quarter of the screen. */
    updateCamera() {
        this.camera_x = -this.character.x + 100;
    }

    /** Triggers the endboss alert the first time the character enters its zone. */
    checkEndbossContact() {
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && this.character.x > 1800 && !endboss.hadFirstContact) {
            endboss.hadFirstContact = true;
            this.audioManager.play("endbossApproach");
        }
    }

    /** Removes all enemies that have been flagged for deletion. */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            (enemy) => !enemy.markedForDeletion,
        );
    }
    // #endregion

    // #region Collision Detection
    /** Checks each enemy against the character and dispatches the right response. */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy))
                this.handleEnemyCollision(enemy);
        });
        if (this.character.isDead() && !this.gameOver) {
            this.gameOver = true;
            this.audioManager.play("gameOver");
        }
    }

    /**
     * Dispatches a collision with an enemy to the correct handler.
     * @param {MovableObject} enemy - The enemy colliding with the character.
     */
    handleEnemyCollision(enemy) {
        if (this.isKnockoutHit(enemy)) this.applyKnockout(enemy);
        else if (this.isJumpKill(enemy)) enemy.hit();
        else if (this.isCharacterHit(enemy)) this.applyCharacterDamage();
    }

    /**
     * Returns true if the collision qualifies as a ChickenSmall knockout.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isKnockoutHit(enemy) {
        return (
            enemy instanceof ChickenSmall &&
            this.character.isAboveGround() &&
            this.character.speedY < 0 &&
            !enemy.isKnockedOut
        );
    }

    /**
     * Stuns a ChickenSmall and plays the knockout sound.
     * @param {ChickenSmall} enemy - The chicken to knock out.
     */
    applyKnockout(enemy) {
        enemy.isKnockedOut = true;
        enemy.knockedOutTime = new Date().getTime();
        this.audioManager.play("chickenKnockout");
    }

    /**
     * Returns true if the character is jumping on top of a killable enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isJumpKill(enemy) {
        return (
            !(enemy instanceof Endboss) &&
            !(enemy instanceof ChickenSmall) &&
            this.character.isAboveGround() &&
            this.character.speedY < 0
        );
    }

    /**
     * Returns true if the character should receive damage from this enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isCharacterHit(enemy) {
        return (
            !this.character.isHurt() &&
            !this.character.isAboveGround() &&
            !(enemy instanceof ChickenSmall && enemy.isKnockedOut) &&
            !enemy.isDying
        );
    }

    /** Reduces the character's health, updates the health bar and plays the damage sound. */
    applyCharacterDamage() {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        this.audioManager.play("damage");
    }

    /** Checks each coin for a collision with the character and collects it. */
    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.character.coins++;
                this.coinBar.setPercentage(
                    this.calculateBarPercentage(
                        this.character.coins,
                        this.totalCoins,
                    ),
                );
                this.audioManager.play("coin");
            }
        });
    }

    /** Checks each ground bottle for a collision with the character and picks it up. */
    checkBottleCollisions() {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles++;
                this.bottleBar.setPercentage(
                    this.calculateBarPercentage(
                        this.character.bottles,
                        this.totalBottles,
                    ),
                );
                this.audioManager.play("bottlePickup");
                return false;
            }
            return true;
        });
    }

    /**
     * Maps a collected-item count to a status bar percentage in 20 % steps.
     * The first item always moves the bar visibly, regardless of the total count.
     * @param {number} collected - Number of items collected so far.
     * @param {number} total - Total items available in the level.
     * @returns {number} Percentage value between 0 and 100.
     */
    calculateBarPercentage(collected, total) {
        if (total <= 0) return 0;
        const step = Math.ceil((collected / total) * 5);
        return Math.min(100, step * 20);
    }

    /** Checks each thrown bottle against every enemy and applies hit effects. */
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.thrown)
                    this.applyBottleHit(bottle, enemy);
            });
        });
    }

    /**
     * Applies a bottle hit to an enemy: marks the bottle as thrown, damages the enemy,
     * and plays the appropriate sounds.
     * @param {ThrowableObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    applyBottleHit(bottle, enemy) {
        bottle.thrown = true;
        enemy.hit();
        this.audioManager.play("bottleBreak");
        if (enemy instanceof Endboss) this.audioManager.play("endbossHurt");
    }
    // #endregion

    // #region Drawing Helpers
    /**
     * Draws every object in the given array onto the canvas.
     * @param {MovableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((obj) => this.addToMap(obj));
    }

    /**
     * Draws a single movable object, flipping it if otherDirection is set.
     * @param {MovableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) mo.drawFlipped(this.ctx);
        else mo.draw(this.ctx);
    }

    /**
     * Draws three orbiting star emojis above a knocked-out ChickenSmall.
     * @param {ChickenSmall} enemy - The stunned chicken.
     */
    drawKnockoutStars(enemy) {
        const time = new Date().getTime();
        const timePassed = time - enemy.knockedOutTime;
        if (timePassed > enemy.knockedOutDuration) return;
        this.ctx.save();
        for (let i = 0; i < 3; i++) {
            const angle = time / 200 + i * 2.09;
            const starX = enemy.x + enemy.width / 2 + Math.cos(angle) * 20;
            const starY = enemy.y - 20 + Math.sin(angle) * 10;
            this.ctx.font = "16px Arial";
            this.ctx.fillText("⭐", starX, starY);
        }
        this.ctx.restore();
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
