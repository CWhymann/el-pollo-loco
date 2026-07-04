import { MovableObject } from "./movable-object.class.js";
const IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
];
/**
 * Represents a collectible bottle lying on the ground.
 */
// #region class Bottle
export class Bottle extends MovableObject {
    // #region Properties
    width = 80;
    height = 80;
    offset = { top: 15, bottom: 15, left: 25, right: 25 };
    // #endregion
    // #region Constructor
    /**
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(IMAGES_BOTTLE[0]);
        this.loadImages(IMAGES_BOTTLE);
    }
    // #endregion
}
// #endregion class Bottle
