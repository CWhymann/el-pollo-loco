import { MovableObject } from "./movable-object.class.js";

const IMAGES_COIN = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
];

export class Coin extends MovableObject {
    width = 80;
    height = 80;

    /**
     * Creates a coin at the given position.
     * @param {number} x - The x position of the coin.
     * @param {number} y - The y position of the coin.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(IMAGES_COIN[0]);
        this.loadImages(IMAGES_COIN);
    }
}
