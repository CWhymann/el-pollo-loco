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
    width = 60;
    height = 80;
    thrown = false;
    acceleration = 1;

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
        this.throw();
    }

    /**
     * Checks if the bottle is above the ground level.
     * @returns {boolean} True if the bottle is above ground.
     */
    isAboveGround() {
        return this.y < 360;
    }

    /**
     * Starts the throwing animation and movement.
     */
    throw() {
        this.speedY = 15;
        this.applyGravity();
        setInterval(() => {
            if (!this.thrown) {
                this.x += 10;
                this.playAnimation(IMAGES_ROTATION);
            } else {
                this.playAnimation(IMAGES_SPLASH);
            }
            if (this.y > 360) {
                this.thrown = true;
            }
        }, 1000 / 25);
    }
}
