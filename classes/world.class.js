import { level1 } from "../levels/level1.js";
import { StatusBar } from "../classes/status-bar.class.js";
import { Endboss } from "../classes/endboss.class.js";

export class World {
    character;
    level = level1;
    canvas;
    ctx;
    camera_x = 0;
    throwableObjects = [];
    healthBar = new StatusBar(10, 10);

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
        this.draw();
    }

    /**
     * Main draw loop - redraws the entire world every frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
        this.checkEndbossContact();
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
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks for collisions between character and coins.
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
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
