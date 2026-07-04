import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";
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
/**
 * Represents a throwable bottle (salsa).
 */
// #region class ThrowableObject
export class ThrowableObject extends MovableObject {
    // #region Properties
    width = 60;
    height = 80;
    offset = { top: 15, bottom: 15, left: 25, right: 25 };
    thrown = false;
    acceleration = 1;
    otherDirection = false;
    moveIntervalId = null;
    // #endregion
    // #region Constructor
    /**
     * @param {number} x - Starting x position.
     * @param {number} y - Starting y position.
     * @param {boolean} otherDirection - True if thrown to the left.
     */
    constructor(x, y, otherDirection = false) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.loadImage(IMAGES_ROTATION[0]);
        this.loadImages(IMAGES_ROTATION);
        this.loadImages(IMAGES_SPLASH);
        this.throw();
    }
    // #endregion
    // #region Logic
    /** @returns {boolean} */
    isAboveGround() {
        return this.y < 360;
    }
    /** Starts throwing animation and movement. */
    throw() {
        this.speedY = 15;
        this.applyGravity();
        this.moveIntervalId = IntervalHub.startInterval(() => {
            if (!this.thrown) {
                this.x += this.otherDirection ? -10 : 10;
                this.playAnimation(IMAGES_ROTATION);
            } else {
                this.playAnimation(IMAGES_SPLASH);
            }
            if (this.y >= 360) this.thrown = true;
        }, 1000 / 25);
    }
    /** Stops all intervals for this bottle. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        this.stopGravity();
    }
    // #endregion
}
// #endregion class ThrowableObject
