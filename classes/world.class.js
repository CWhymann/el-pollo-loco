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
import { IntervalHub } from "./interval-hub.class.js";

/**
 * Represents the main game world.
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

        this.audioManager.loadMuteState();
        this.loadSounds();
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);

        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", () => this.startGame());
        }

        const restartButton = document.getElementById("restart-button");
        if (restartButton) {
            restartButton.addEventListener("click", () => this.resetGame());
        }

        const backToStartButton = document.getElementById(
            "back-to-start-button",
        );
        if (backToStartButton) {
            backToStartButton.addEventListener("click", () =>
                this.returnToStart(),
            );
        }

        const controlsButton = document.getElementById("controls-button");
        const startScreenElement = document.getElementById("start-screen");
        if (controlsButton) {
            controlsButton.addEventListener("click", () => {
                this.controlsDialogVisible = true;
                if (startScreenElement)
                    startScreenElement.style.visibility = "hidden";
            });
        }

        const muteButton = document.getElementById("mute-button");
        if (muteButton) {
            muteButton.textContent = this.audioManager.isMuted ? "🔇" : "🔊";
            muteButton.addEventListener("click", () => {
                this.audioManager.toggleMute();
                muteButton.textContent = this.audioManager.isMuted
                    ? "🔇"
                    : "🔊";
            });
        }

        this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
        this.draw();
        this.spawnBottle();
    }
    // #endregion

    // #region Sound Setup
    /** Loads all game sounds into the AudioManager. */
    loadSounds() {
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
            "characterDead",
            "assets/audio/EPL_sounds/sounds/character/characterDead.wav",
        );
        this.audioManager.loadSound(
            "snoring",
            "assets/audio/EPL_sounds/sounds/character/characterSnoring.mp3",
        );
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
            "coin",
            "assets/audio/EPL_sounds/sounds/collectibles/collectSound.wav",
        );
        this.audioManager.loadSound(
            "bottlePickup",
            "assets/audio/EPL_sounds/sounds/collectibles/bottleCollectSound.wav",
        );
        this.audioManager.loadSound(
            "endbossApproach",
            "assets/audio/EPL_sounds/sounds/endboss/endbossApproach.wav",
        );
        this.audioManager.loadSound(
            "gameStart",
            "assets/audio/EPL_sounds/sounds/game/gameStart.mp3",
        );
        this.audioManager.loadSound(
            "bottleBreak",
            "assets/audio/EPL_sounds/sounds/throwable/bottleBreak.mp3",
        );
        this.audioManager.loadSound(
            "bottleShot",
            "assets/audio/EPL_sounds/sounds/throwable/bottleShot.wav",
        );
    }
    // #endregion

    // #region Game Control
    /**
     * Starts the game by loading the level and hiding screens.
     */
    startGame() {
        this.character.x = 0;
        this.character.y = 155;
        this.character.energy = 100;
        this.character.bottles = 0;
        this.character.coins = 0;
        this.character.speedY = 0;
        this.character.otherDirection = false;

        this.healthBar.setPercentage(100);
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);

        this.level = createLevel1();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });

        this.gameStarted = true;
        this.audioManager.play("gameStart");
        const startScreen = document.getElementById("start-screen");
        if (startScreen) startScreen.style.display = "none";
        const gameUi = document.getElementById("game-ui");
        if (gameUi) gameUi.style.display = "flex";
    }

    /**
     * Resets the game state, stops all intervals and restarts immediately.
     */
    resetGame() {
        IntervalHub.stopAllIntervals();
        this.gameOver = false;
        this.gameWon = false;
        this.gameStarted = true;

        this.character.x = 0;
        this.character.y = 155;
        this.character.energy = 100;
        this.character.bottles = 0;
        this.character.coins = 0;
        this.character.speedY = 0;
        this.character.otherDirection = false;

        this.healthBar.setPercentage(100);
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);

        this.throwableObjects = [];

        this.level = createLevel1();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });

        this.spawnBottle();
        this.audioManager.play("gameStart");
        const gameOverScreen = document.getElementById("game-over-screen");
        const winScreen = document.getElementById("win-screen");
        if (gameOverScreen) gameOverScreen.style.display = "none";
        if (winScreen) winScreen.style.display = "none";
    }
    /**
     * Stops the game and returns to the start screen (Menu).
     */
    returnToStart() {
        IntervalHub.stopAllIntervals();
        this.audioManager.stopAll();
        this.gameStarted = false;
        this.gameOver = false;
        this.gameWon = false;

        const startScreenElement = document.getElementById("start-screen");
        if (startScreenElement) {
            startScreenElement.style.display = "block";
        }
        const gameUi = document.getElementById("game-ui");
        if (gameUi) gameUi.style.display = "none";
    }
    // #endregion

    // #region Game Loop & Rendering
    /**
     * Main draw loop.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) {
            this.addToMap(this.startScreen);
            this.addToMap(this.startScreenChicken);
            if (this.controlsDialogVisible) this.addToMap(this.controlsDialog);
            requestAnimationFrame(() => this.draw());
            return;
        }
        if (this.gameOver) {
            this.addToMap(this.gameOverScreen);
            if (this.spawnIntervalId)
                IntervalHub.stopInterval(this.spawnIntervalId);
            requestAnimationFrame(() => this.draw());
            return;
        }
        if (this.gameWon) {
            this.addToMap(this.winScreen);
            requestAnimationFrame(() => this.draw());
            return;
        }

        this.updateCamera();
        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
        this.checkEndbossContact();
        this.removeDeadEnemies();

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);

        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof ChickenSmall && enemy.isKnockedOut) {
                this.drawKnockoutStars(enemy);
            }
        });

        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.thrown || bottle.currentImage < 6,
        );
        this.addObjectsToMap(this.throwableObjects);

        this.drawCharacterShadow();
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws character shadow.
     */
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

    // #region Controls Dialog
    /**
     * Handles clicks on the canvas to close the controls dialog
     * when the close icon or the area outside the box is clicked.
     * @param {MouseEvent} e - The click event.
     */
    handleCanvasClick(e) {
        if (!this.controlsDialogVisible) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const px = (e.clientX - rect.left) * scaleX;
        const py = (e.clientY - rect.top) * scaleY;
        if (
            this.controlsDialog.isCloseHit(px, py) ||
            this.controlsDialog.isOutsideBox(px, py)
        ) {
            this.controlsDialogVisible = false;
            const startScreenElement = document.getElementById("start-screen");
            if (startScreenElement)
                startScreenElement.style.visibility = "visible";
        }
    }
    // #endregion

    // #region Camera & Logic
    /** Updates camera position. */
    updateCamera() {
        this.camera_x = -this.character.x + 100;
    }

    /** Checks endboss contact. */
    checkEndbossContact() {
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && this.character.x > 1800 && !endboss.hadFirstContact) {
            endboss.hadFirstContact = true;
            this.audioManager.play("endbossApproach");
        }
    }

    /** Removes dead enemies. */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            (enemy) => !enemy.markedForDeletion,
        );
    }
    // #endregion

    // #region Collision Detection
    /** Checks collisions with enemies. */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (
                    enemy instanceof ChickenSmall &&
                    this.character.isAboveGround() &&
                    this.character.speedY < 0 &&
                    !enemy.isKnockedOut
                ) {
                    enemy.isKnockedOut = true;
                    enemy.knockedOutTime = new Date().getTime();
                    this.audioManager.play("chickenKnockout");
                } else if (
                    !(enemy instanceof Endboss) &&
                    !(enemy instanceof ChickenSmall) &&
                    this.character.isAboveGround() &&
                    this.character.speedY < 0
                ) {
                    enemy.hit();
                } else if (
                    !this.character.isHurt() &&
                    !this.character.isAboveGround() &&
                    !(enemy instanceof ChickenSmall && enemy.isKnockedOut) &&
                    !enemy.isDying
                ) {
                    this.character.hit();
                    this.healthBar.setPercentage(this.character.energy);
                    this.audioManager.play("damage");
                }
            }
        });
        if (this.character.isDead() && !this.gameOver) {
            this.gameOver = true;
            this.audioManager.play("characterDead");
        }
    }

    /** Checks coin collisions. */
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

    /** Checks bottle collisions. */
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
     * Calculates the status bar percentage so that even the first
     * collected item visibly moves the bar, regardless of the total count.
     * @param {number} collected - Number of items collected so far.
     * @param {number} total - Total number of items available in the level.
     * @returns {number} Percentage rounded up to the next 20%-step.
     */
    calculateBarPercentage(collected, total) {
        if (total <= 0) return 0;
        const step = Math.ceil((collected / total) * 5);
        return Math.min(100, step * 20);
    }

    /** Checks throwable collisions. */
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.thrown) {
                    bottle.thrown = true;
                    enemy.hit();
                    this.audioManager.play("bottleBreak");
                }
            });
        });
    }
    // #endregion

    // #region Drawing Helpers
    /** Draws objects. */
    addObjectsToMap(objects) {
        objects.forEach((obj) => this.addToMap(obj));
    }

    /** Draws single object. */
    addToMap(mo) {
        if (mo.otherDirection) {
            mo.drawFlipped(this.ctx);
        } else {
            mo.draw(this.ctx);
        }
    }

    /** Draws knockout stars. */
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
    /** Spawns bottles via IntervalHub. */
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
