import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

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

/**
 * Represents the final boss (El Pollo Loco).
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

    /**
     * Moves the boss towards the character's current position,
     * following in either direction once first contact happened.
     */
    handleMovement() {
        if (!this.hadFirstContact || this.isDead() || !this.world) return;
        const characterX = this.world.character.x;
        if (characterX < this.x - 5) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else if (characterX > this.x + 5) {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    /** Handles animation and death logic. */
    /** Handles animation and death logic. */
    handleAnimation() {
        if (this.isDying) {
            return;
        } else if (this.isDead() && !this.isDying) {
            this.isDying = true;
            this.startDyingSequence();
        } else if (!this.isDead() && this.isHurt()) {
            this.playAnimation(IMAGES_HURT);
        } else if (this.hadFirstContact) {
            this.playAnimation(IMAGES_ATTACK);
        } else {
            this.playAnimation(IMAGES_ALERT);
        }
    }

    /**
     * Replaces the animation interval with a slower one dedicated
     * to the dying sequence, plays the sound and schedules removal.
     */
    startDyingSequence() {
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        this.animIntervalId = IntervalHub.startInterval(
            () => this.playAnimation(IMAGES_DEAD),
            1000 / 3,
        );
        if (this.world) this.world.audioManager.play("endbossDead");
        this.deleteTimeoutId = IntervalHub.startInterval(() => {
            this.markedForDeletion = true;
            if (this.world) {
                this.world.gameWon = true;
                this.world.audioManager.play("gameWin");
            }
            this.stop();
        }, 3000);
    }

    /** Stops all intervals and timeouts for the boss. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
        if (this.animIntervalId) IntervalHub.stopInterval(this.animIntervalId);
        if (this.deleteTimeoutId)
            IntervalHub.stopInterval(this.deleteTimeoutId);
    }
    // #endregion
}
// #endregion class Endboss
