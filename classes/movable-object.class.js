import { IntervalHub } from "./interval-hub.class.js";

/**
 * Base class for all movable objects in the game.
 * Handles physics, drawing, collision detection and image loading.
 */
// #region class MovableObject
export class MovableObject {
    // #region Properties
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    /** @type {number|null} Speichert die ID des Gravitations-Intervalls */
    gravityIntervalId = null;
    // #endregion

    // #region Image Loading
    /**
     * Loads a single image and assigns it to this.img.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads an array of images into the image cache.
     * @param {string[]} paths - Array of image paths to preload.
     */
    loadImages(paths) {
        paths.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
    // #endregion

    // #region Animation
    /**
     * Plays the next frame of an animation.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }
    // #endregion

    // #region Drawing
    /**
     * Draws the object onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the object flipped horizontally onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFlipped(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }
    // #endregion

    // #region Collision & Health
    /**
     * Checks if this object is colliding with another object.
     * @param {MovableObject} mo - The object to check collision with.
     * @returns {boolean} True if the objects are colliding.
     */
    isColliding(mo) {
        return (
            this.x + this.width - 10 > mo.x &&
            this.y + this.height - 10 > mo.y &&
            this.x + 10 < mo.x + mo.width &&
            this.y + 10 < mo.y + mo.height
        );
    }

    /**
     * Reduces energy when the object is hit.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object was recently hit.
     * @returns {boolean} True if the object was hit in the last second.
     */
    isHurt() {
        const timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1000;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if energy is 0.
     */
    isDead() {
        return this.energy === 0;
    }
    // #endregion

    // #region Physics
    /**
     * Applies gravity to the object on every frame using IntervalHub.
     * Stores the interval ID for later cleanup.
     */
    applyGravity() {
        // ID speichern, um das Intervall später einzeln stoppen zu können
        this.gravityIntervalId = IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Stops the gravity interval for this specific object.
     * Should be called when the object is removed or the game resets.
     */
    stopGravity() {
        if (this.gravityIntervalId) {
            IntervalHub.stopInterval(this.gravityIntervalId);
            this.gravityIntervalId = null;
        }
    }

    /**
     * Checks if the object is above the ground level.
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        return this.y < 155;
    }
    // #endregion
}
// #endregion class MovableObject
