import { level1 } from "../levels/level1.js";
import { StatusBar } from "../classes/status-bar.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { StartScreen } from "../classes/start-screen.class.js";
import { GameOverScreen } from "../classes/game-over-screen.class.js";
import { WinScreen } from "../classes/win-screen.class.js";
import { AudioManager } from "../classes/audio-manager.class.js";

export class World {
    character;
    level = level1;
    canvas;
    ctx;
    camera_x = 0;
    throwableObjects = [];
    healthBar = new StatusBar(10, 10, "health");
    bottleBar = new StatusBar(10, 60, "bottle");
    coinBar = new StatusBar(10, 110, "coin");
    gameStarted = false;
    startScreen = new StartScreen();
    gameOver = false;
    gameOverScreen = new GameOverScreen();
    gameWon = false;
    winScreen = new WinScreen();
    audioManager = new AudioManager();

    /**
     * Creates the game world.
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
        const startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () => {
            this.gameStarted = true;
            document.getElementById("start-screen").remove();
        });
        this.draw();
    }

    /**
     * Main draw loop - redraws the entire world every frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.gameStarted) {
            this.addToMap(this.startScreen);
            requestAnimationFrame(() => this.draw());
            return;
        }
        if (this.gameOver) {
            this.addToMap(this.gameOverScreen);
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
        this.checkWinCondition();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.throwableObjects = this.throwableObjects.filter(
            (bottle) => !bottle.thrown || bottle.currentImage < 6,
        );
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        requestAnimationFrame(() => this.draw());
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
    }

    /**
     * Updates the camera position to follow the character.
     */
    updateCamera() {
        this.camera_x = -this.character.x + 100;
    }

    /**
     * Checks for collisions between character and enemies.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (
                    !(enemy instanceof Endboss) &&
                    this.character.isAboveGround() &&
                    this.character.speedY < 0
                ) {
                    enemy.hit();
                } else if (!this.character.isHurt()) {
                    this.character.hit();
                    this.healthBar.setPercentage(this.character.energy);
                }
            }
        });
        if (this.character.isDead()) {
            this.gameOver = true;
        }
    }

    /**
     * Removes dead enemies from the level.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            (enemy) => !enemy.isDead(),
        );
    }

    /**
     * Checks for collisions between character and coins.
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.character.coins++;
                this.coinBar.setPercentage(this.character.coins * 10);
            }
        });
    }
    /**
     * Checks for collisions between character and bottles.
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.character.bottles++;
                this.bottleBar.setPercentage(this.character.bottles * 20);
            }
        });
    }

    /**
     * Checks for collisions between thrown bottles and enemies.
     */
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.thrown) {
                    bottle.thrown = true;
                    enemy.hit();
                }
            });
        });
    }

    /**
     * Checks if the character is close to the endboss.
     */
    checkEndbossContact() {
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && this.character.x > 1800) {
            endboss.hadFirstContact = true;
        }
    }

    /**
     * Checks if the endboss is dead and sets gameWon to true.
     */
    checkWinCondition() {
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.gameWon = true;
        }
    }

    /**
     * Draws a list of objects onto the canvas.
     * @param {MovableObject[]} objects - Array of objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((obj) => this.addToMap(obj));
    }

    /**
     * Draws a single object, flipped if necessary.
     * @param {MovableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            mo.drawFlipped(this.ctx);
        } else {
            mo.draw(this.ctx);
        }
    }
}
