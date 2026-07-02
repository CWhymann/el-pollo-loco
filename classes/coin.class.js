import { MovableObject } from "./movable-object.class.js";

const IMAGES_COIN = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
];

/**
 * Represents a collectible coin.
 */
// #region class Coin
export class Coin extends MovableObject {
    // #region Properties
    width = 80;
    height = 80;
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
        this.loadImage(IMAGES_COIN[0]);
        this.loadImages(IMAGES_COIN);
    }
    // #endregion
}
// #endregion class Coin
