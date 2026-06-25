import { MovableObject } from "./movable-object.class.js";

export class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a background object at the given position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - The x position of the background object.
     */
    constructor(imagePath, x, otherDirection = false) {
        super();
        this.x = x;
        this.y = 0;
        this.otherDirection = otherDirection;
        this.loadImage(imagePath);
    }
}
