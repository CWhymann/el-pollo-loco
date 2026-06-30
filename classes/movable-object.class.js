export class MovableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;
    speedY = 0;
    acceleration = 2.5;

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

    /**
     * Plays the next frame of an animation.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }

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

    energy = 100;
    lastHit = 0;

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

    /**
     * Applies gravity to the object on every frame.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the object is above the ground level.
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        return this.y < 155;
    }
}
