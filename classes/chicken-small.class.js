import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";
const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
];
const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
];
/**
 * Represents a small chicken enemy that can be knocked out.
 */
// #region class ChickenSmall
export class ChickenSmall extends MovableObject {
    // #region Properties
    x = 700;
    y = 380;
    width = 50;
    height = 60;
    offset = { top: 3, bottom: 2, left: 3, right: 3 };
    speed = 0.3 + Math.random() * 0.5;
    energy = 20;
    isKnockedOut = false;
    isDying = false;
    knockedOutTime = 0;
    knockedOutDuration = 2500;
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
            1000 / 10,
        );
    }
    /** Moves the chicken, handling knock-out physics. */
    handleMovement() {
        if (this.isDying) return;
        if (this.isKnockedOut) {
            const timePassed = new Date().getTime() - this.knockedOutTime;
            if (timePassed > this.knockedOutDuration) {
                this.isKnockedOut = false;
            } else {
                this.x -= this.speed * 0.3;
                this.x += Math.sin(timePassed / 150) * 2;
            }
        } else {
            this.x -= this.speed;
            this.y = 380;
        }
    }
    /** Handles animation based on state. */
    handleAnimation() {
        if (this.isDying) {
            this.playAnimation(IMAGES_DEAD);
        } else {
            this.playAnimation(IMAGES_WALKING);
        }
    }
    /** Reduces energy on hit and triggers death once energy is depleted. */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
        if (this.isDead() && !this.isDying) this.die();
    }
    /** Marks the chicken as dying and schedules its removal. */
    die() {
        this.isDying = true;
        this.deleteTimeoutId = IntervalHub.startInterval(() => {
            this.markedForDeletion = true;
            this.stop();
        }, 500);
    }
    /** Stops all intervals for this chicken. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        if (this.deleteTimeoutId)
            IntervalHub.stopInterval(this.deleteTimeoutId);
    }
    // #endregion
}
// #endregion class ChickenSmall
