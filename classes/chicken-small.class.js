import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

// #region Image Constants
const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
];
// #endregion

/**
 * Represents a small chicken enemy.
 * Can be stunned by jumping on it or killed by a bottle throw.
 * Silently dissolves when it walks off the left edge.
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
    /** Registers movement and animation intervals via IntervalHub. */
    animate() {
        this.startMoveInterval();
        this.startAnimInterval();
    }

    /** Starts the 60 fps movement update interval. */
    startMoveInterval() {
        this.moveIntervalId = IntervalHub.startInterval(
            () => this.handleMovement(),
            1000 / 60,
        );
    }

    /** Starts the 10 fps animation frame interval. */
    startAnimInterval() {
        this.animIntervalId = IntervalHub.startInterval(
            () => this.handleAnimation(),
            1000 / 10,
        );
    }

    /**
     * Moves the chicken left, applying wobble physics during knockout.
     * Removes it silently once it leaves the left edge of the level.
     */
    handleMovement() {
        if (this.isDying) return;
        if (this.isKnockedOut) this.applyKnockoutMovement();
        else {
            this.x -= this.speed;
            this.y = 380;
        }
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
            this.stop();
        }
    }

    /** Applies wobble movement during the knockout stun duration. */
    applyKnockoutMovement() {
        const timePassed = new Date().getTime() - this.knockedOutTime;
        if (timePassed > this.knockedOutDuration) {
            this.isKnockedOut = false;
        } else {
            this.x -= this.speed * 0.3;
            this.x += Math.sin(timePassed / 150) * 2;
        }
    }

    /** Plays the dead or walking animation depending on current state. */
    handleAnimation() {
        if (this.isDying) this.playAnimation(IMAGES_DEAD);
        else this.playAnimation(IMAGES_WALKING);
    }

    /** Reduces energy by 20 on a bottle hit and triggers death if energy reaches zero. */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
        if (this.isDead() && !this.isDying) this.die();
    }

    /**
     * Marks the chicken as dying, plays the death sound
     * and schedules its removal after the death animation.
     */
    die() {
        this.isDying = true;
        if (this.world) this.world.audioManager.play("chickenDead2");
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
// #endregion class ChickenSmall
