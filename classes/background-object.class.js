import { MovableObject } from "./movable-object.class.js";

/**
 * Represents a static background object.
 */
// #region class BackgroundObject
export class BackgroundObject extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    // #endregion

    // #region Constructor
    /**
     * @param {string} imagePath - Path to the image.
     * @param {number} x - The x position.
     * @param {boolean} otherDirection - Flip image horizontally.
     */
    constructor(imagePath, x, otherDirection = false) {
        super();
        this.x = x;
        this.y = 0;
        this.otherDirection = otherDirection;
        this.loadImage(imagePath);
    }
    // #endregion
}
// #endregion class BackgroundObject
