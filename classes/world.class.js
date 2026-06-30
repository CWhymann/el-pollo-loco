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

export class World {
    character;
    level = null;
    canvas;
    ctx;
    camera_x = 0;
    throwableObjects = [];
    healthBar = new StatusBar(10, 10, "health");
    bottleBar = new StatusBar(10, 60, "bottle");
    coinBar = new StatusBar(10, 110, "coin");
    gameStarted = false;
    startScreen = new StartScreen();
    startScreenChicken = new StartScreenChicken();
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
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
        const startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () => {
            this.level = createLevel1();
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss) {
                    enemy.world = this;
                }
            });
            this.gameStarted = true;
            document.getElementById("start-screen").remove();
        });
        this.draw();
        this.spawnBottle();
    }

    /**
     * Main draw loop - redraws the entire world every frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.gameStarted) {
            this.addToMap(this.startScreen);
            this.addToMap(this.startScreenChicken);
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
                    enemy instanceof ChickenSmall &&
                    this.character.isAboveGround() &&
                    this.character.speedY < 0
                ) {
                    enemy.isKnockedOut = true;
                    enemy.knockedOutTime = new Date().getTime();
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
                }
            }
        });
        if (this.character.isDead()) {
            this.gameOver = true;
        }
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
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles++;
                this.bottleBar.setPercentage(this.character.bottles * 20);
                return false;
            }
            return true;
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
     * Removes dead enemies from the level.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            (enemy) => !enemy.markedForDeletion,
        );
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
    /**
     * Draws rotating stars above a knocked out chicken.
     * @param {ChickenSmall} enemy - The knocked out chicken.
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
    /**
     * Spawns a new bottle at a random position every 15 seconds.
     */
    spawnBottle() {
        setInterval(() => {
            if (this.level && this.level.bottles.length < 5) {
                const x = 200 + Math.random() * 1800;
                this.level.bottles.push(new Bottle(x, 380));
            }
        }, 15000);
    }

    /**
     * Draws a shadow beneath the character that shrinks when jumping.
     */
    drawCharacterShadow() {
        const groundY = 420;
        const heightAboveGround =
            groundY - (this.character.y + this.character.height);
        const scale = Math.max(0.3, 1 - heightAboveGround / 200);
        const shadowWidth = 70 * scale;
        const shadowHeight = 15 * scale;

        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.character.x + this.character.width / 2,
            groundY,
            shadowWidth / 2,
            shadowHeight / 2,
            0,
            0,
            Math.PI * 2,
        );
        this.ctx.fill();
        this.ctx.restore();
    }
}
