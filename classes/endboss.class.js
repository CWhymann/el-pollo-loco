import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

// #region Image Constants
const IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
];

const IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
];

const IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
];

const IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
];

const IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
];
// #endregion

/**
 * Represents the final boss (El Pollo Loco).
 * Tracks the player, plays phased animations and triggers the win state on death.
 */
// #region class Endboss
export class Endboss extends MovableObject {
    // #region Properties
    x = 2200;
    y = 50;
    width = 250;
    height = 400;
    offset = { top: 60, bottom: 20, left: 40, right: 40 };
    speed = 0.8;
    energy = 25;
    hadFirstContact = false;
    otherDirection = false;
    isDying = false;
    moveIntervalId = null;
    animIntervalId = null;
    deleteTimeoutId = null;
    // #endregion

    // #region Constructor
    /** Loads all sprite sheets and starts the animation loop. */
    constructor() {
        super();
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_ALERT);
        this.loadImages(IMAGES_ATTACK);
        this.loadImages(IMAGES_HURT);
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

    /** Starts the 8 fps animation frame interval. */
    startAnimInterval() {
        this.animIntervalId = IntervalHub.startInterval(
            () => this.handleAnimation(),
            1000 / 8,
        );
    }

    /**
     * Tracks the character and moves towards them once first contact is made.
     * Flips the sprite to face the character's direction.
     */
    handleMovement() {
        if (!this.hadFirstContact || this.isDead() || !this.world) return;
        this.moveTowardsCharacter(this.world.character.x);
    }

    /**
     * Moves the boss left or right depending on character position.
     * @param {number} characterX - The character's current x position.
     */
    moveTowardsCharacter(characterX) {
        if (characterX < this.x - 5) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else if (characterX > this.x + 5) {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    /**
     * Selects the correct animation phase based on the boss's current state.
     * Triggers the dying sequence exactly once when energy reaches zero.
     */
    handleAnimation() {
        if (this.isDying) return;
        if (this.isDead()) {
            this.isDying = true;
            this.startDyingSequence();
            return;
        }
        this.playPhaseAnimation();
    }

    /** Plays hurt, attack or alert animation based on current state. */
    playPhaseAnimation() {
        if (this.isHurt()) return this.playAnimation(IMAGES_HURT);
        if (this.hadFirstContact) return this.playAnimation(IMAGES_ATTACK);
        this.playAnimation(IMAGES_ALERT);
    }

    /**
     * Switches to a slow death animation, plays the death sound
     * and schedules the win-state trigger after 3 seconds.
     */
    startDyingSequence() {
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        this.animIntervalId = IntervalHub.startInterval(
            () => this.playAnimation(IMAGES_DEAD),
            1000 / 3,
        );
        if (this.world) this.world.audioManager.play("endbossDead");
        this.scheduleRemoval();
    }

    /** Schedules the boss removal and win-state trigger after the death animation. */
    scheduleRemoval() {
        this.deleteTimeoutId = IntervalHub.startInterval(() => {
            this.markedForDeletion = true;
            if (this.world) {
                this.world.gameWon = true;
                this.world.audioManager.play("gameWin");
            }
            this.stop();
        }, 3000);
    }

    /** Stops all active intervals and timeouts for this boss. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        if (this.deleteTimeoutId)
            IntervalHub.stopInterval(this.deleteTimeoutId);
    }
    // #endregion
}
// #endregion class Endboss
