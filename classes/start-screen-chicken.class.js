import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";
const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
];
/**
 * Represents the animated chicken on the start screen.
 */
// #region class StartScreenChicken
export class StartScreenChicken extends MovableObject {
    // #region Properties
    x = 280;
    y = 380;
    width = 60;
    height = 70;
    speed = 2;
    jumpHeight = 0;
    otherDirection = true;
    moveIntervalId = null;
    animIntervalId = null;
    // #endregion
    // #region Constructor
    constructor() {
        super();
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
        this.animate();
    }
    // #endregion
    // #region Logic
    /** Starts movement and animation via IntervalHub. */
    animate() {
        this.moveIntervalId = IntervalHub.startInterval(
            () => this.handleMovement(),
            1000 / 60,
            "persistent",
        );
        this.animIntervalId = IntervalHub.startInterval(
            () => this.playAnimation(IMAGES_WALKING),
            1000 / 10,
            "persistent",
        );
    }
    /** Moves the chicken from left to right with a hop effect. */
    handleMovement() {
        this.x += this.speed;
        this.jumpHeight += 0.15;
        this.y = 380 - Math.abs(Math.sin(this.jumpHeight) * 30);
        if (this.x > 620) {
            this.speed = -2;
            this.otherDirection = false;
        }
        if (this.x < 280) {
            this.speed = 2;
            this.otherDirection = true;
        }
    }
    /** Stops all intervals for this chicken. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
    }
    // #endregion
}
// #endregion class StartScreenChicken
