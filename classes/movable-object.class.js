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
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    img;
    imageCache = {};
    currentImage = 0;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    markedForDeletion = false;
    /** @type {number|null} ID of the active gravity interval. */
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
     * Preloads an array of images into the image cache.
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
     * Advances to the next frame of an animation sequence.
     * @param {string[]} images - Ordered array of image paths for the animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }
    // #endregion

    // #region Drawing
    /**
     * Draws the object at its current position on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the object mirrored horizontally (for left-facing sprites).
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
    /** @returns {number} Visible x position after applying left offset. */
    get rX() {
        return this.x + this.offset.left;
    }

    /** @returns {number} Visible y position after applying top offset. */
    get rY() {
        return this.y + this.offset.top;
    }

    /** @returns {number} Visible width after subtracting left and right offsets. */
    get rW() {
        return this.width - this.offset.left - this.offset.right;
    }

    /** @returns {number} Visible height after subtracting top and bottom offsets. */
    get rH() {
        return this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Returns true if this object's visible hitbox overlaps with another object's.
     * @param {MovableObject} mo - The object to test against.
     * @returns {boolean}
     */
    isColliding(mo) {
        return (
            this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH
        );
    }

    /** Reduces energy by 5 on hit and records the timestamp. */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Returns true if the object was hit within the last second.
     * @returns {boolean}
     */
    isHurt() {
        return new Date().getTime() - this.lastHit < 1000;
    }

    /**
     * Returns true if the object's energy has reached zero.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
    // #endregion

    // #region Physics
    /**
     * Starts a gravity loop via IntervalHub that pulls the object downward each frame.
     * @param {string} category - Interval category: 'level' (default) or 'persistent'.
     */
    applyGravity(category = "level") {
        this.gravityIntervalId = IntervalHub.startInterval(
            () => {
                if (this.isAboveGround() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                }
            },
            1000 / 60,
            category,
        );
    }

    /** Stops the gravity interval and clears its stored ID. */
    stopGravity() {
        if (this.gravityIntervalId) {
            IntervalHub.stopInterval(this.gravityIntervalId);
            this.gravityIntervalId = null;
        }
    }

    /**
     * Returns true if the object is above the default ground level (y < 155).
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < 155;
    }
    // #endregion
}
// #endregion class MovableObject
