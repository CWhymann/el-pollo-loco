import { MovableObject } from "./movable-object.class.js";

/**
 * Represents a static background layer tile.
 * Can be flipped horizontally to reuse the same image for mirrored sections.
 */
// #region class BackgroundObject
export class BackgroundObject extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    // #endregion

    // #region Constructor
    /**
     * @param {string} imagePath - Path to the background layer image.
     * @param {number} x - The x position of this tile in the level.
     * @param {boolean} otherDirection - True to flip the image horizontally.
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
