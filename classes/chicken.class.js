import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
];

/**
 * Represents a normal chicken enemy.
 */
// #region class Chicken
export class Chicken extends MovableObject {
    // #region Properties
    x = 700;
    y = 360;
    width = 70;
    height = 80;
    speed = 0.15 + Math.random() * 0.5;
    energy = 5;
    isDying = false;
    moveIntervalId = null;
    animIntervalId = null;
    deleteTimeoutId = null;
    // #endregion

    // #region Constructor
    /**
     * @param {number} x - The starting x position.
     */
    constructor(x) {
        super();
        this.x = x;
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_DEAD);
        this.animate();
    }
    // #endregion

    // #region Logic
    /** Starts movement and animation via IntervalHub. */
    animate() {
        this.moveIntervalId = IntervalHub.startInterval(
            () => this.handleMovement(),
            1000 / 60,
        );
        this.animIntervalId = IntervalHub.startInterval(
            () => this.handleAnimation(),
            1000 / 8,
        );
    }

    /** Moves the chicken to the left. */
    handleMovement() {
        if (!this.isDead()) this.x -= this.speed;
    }

    /** Handles animation based on state. */
    handleAnimation() {
        if (this.isDying) {
            this.playAnimation(IMAGES_DEAD);
        } else {
            this.playAnimation(IMAGES_WALKING);
        }
    }

    /** Reduces energy and marks the chicken as dying. */
    hit() {
        this.energy = 0;
        this.isDying = true;
        // Timeout über IntervalHub für sauberes Stoppen beim Restart
        this.deleteTimeoutId = IntervalHub.startInterval(() => {
            this.markedForDeletion = true;
            this.stop(); // Sich selbst stoppen
        }, 500);
    }

    /** Stops all intervals and timeouts for this chicken. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        if (this.deleteTimeoutId)
            IntervalHub.stopInterval(this.deleteTimeoutId);
    }
    // #endregion
}
// #endregion class Chicken
