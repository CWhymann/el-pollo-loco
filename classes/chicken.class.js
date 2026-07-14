import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

// #region Image Constants
const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
];
// #endregion

/**
 * Represents a normal chicken enemy.
 * Walks left and dies on any hit. Silently dissolves off the left edge.
 */
// #region class Chicken
export class Chicken extends MovableObject {
    // #region Properties
    x = 700;
    y = 360;
    width = 70;
    height = 80;
    offset = { top: 5, bottom: 3, left: 5, right: 5 };
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
    /** Registers movement and animation intervals via IntervalHub. */
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

    /**
     * Moves the chicken left and removes it silently when it leaves the level.
     */
    handleMovement() {
        if (this.isDying) return;
        if (!this.isDead()) this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
            this.stop();
        }
    }

    /** Plays the dead or walking animation depending on current state. */
    handleAnimation() {
        if (this.isDying) this.playAnimation(IMAGES_DEAD);
        else this.playAnimation(IMAGES_WALKING);
    }

    /**
     * Instantly kills the chicken, plays the death sound
     * and schedules its removal after the death animation.
     */
    hit() {
        this.energy = 0;
        this.isDying = true;
        if (this.world) this.world.audioManager.play("chickenDead");
        this.deleteTimeoutId = IntervalHub.startInterval(() => {
            this.markedForDeletion = true;
            this.stop();
        }, 500);
    }

    /** Stops all active intervals and timeouts for this chicken. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        if (this.deleteTimeoutId)
            IntervalHub.stopInterval(this.deleteTimeoutId);
    }
    // #endregion
}
// #endregion class Chicken
