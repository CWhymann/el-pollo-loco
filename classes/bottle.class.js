import { MovableObject } from "./movable-object.class.js";

const IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
];

export class Bottle extends MovableObject {
    width = 80;
    height = 80;

    /**
     * Creates a bottle at the given position.
     * @param {number} x - The x position of the bottle.
     * @param {number} y - The y position of the bottle.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(IMAGES_BOTTLE[0]);
        this.loadImages(IMAGES_BOTTLE);
    }
}
