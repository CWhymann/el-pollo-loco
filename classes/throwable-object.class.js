import { MovableObject } from "./movable-object.class.js";

const IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
];

const IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
];

export class ThrowableObject extends MovableObject {
    x;
    y;
    width = 60;
    height = 80;

    /**
     * Creates a throwable bottle at the given position.
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(IMAGES_ROTATION[0]);
        this.loadImages(IMAGES_ROTATION);
        this.loadImages(IMAGES_SPLASH);
    }
}

//Was passiert hier?

//constructor(x, y) -> die Flasche bekommt ihre Startposition beim Erstellen – nämlich Pepes aktuelle Position wenn er wirft
//IMAGES_ROTATION -> die Flasche dreht sich beim Fliegen
//IMAGES_SPLASH -> wenn die Flasche trifft, spritzt sie auf
//x und y haben keinen Standardwert – sie werden immer beim new ThrowableObject(x, y) übergeben
