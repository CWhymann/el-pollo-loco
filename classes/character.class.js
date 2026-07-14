import { MovableObject } from "./movable-object.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

// #region Image Constants
const IMAGES_LONG_IDLE = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
];

const IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
];

const IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
];

const IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
];

const IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
];

const IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
];
// #endregion

/**
 * Represents the player character Pepe.
 * Extends MovableObject with keyboard-controlled movement,
 * animations and bottle throwing.
 */
// #region class Character
export class Character extends MovableObject {
    // #region Properties
    x = 0;
    y = 155;
    width = 120;
    height = 280;
    offset = { top: 100, bottom: 15, left: 35, right: 35 };
    speed = 5;
    otherDirection = false;
    keyboard;
    bottles = 0;
    coins = 0;
    lastThrow = 0;
    lastMove = new Date().getTime();
    minX = 0;
    maxX = 2950;
    // #endregion

    // #region Constructor
    /**
     * @param {Keyboard} keyboard - The keyboard state object.
     */
    constructor(keyboard) {
        super();
        this.keyboard = keyboard;
        this.loadImage(IMAGES_IDLE[0]);
        this.loadImages(IMAGES_IDLE);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_JUMPING);
        this.loadImages(IMAGES_HURT);
        this.loadImages(IMAGES_DEAD);
        this.loadImages(IMAGES_LONG_IDLE);
        this.animate();
        this.applyGravity("persistent");
    }
    // #endregion

    // #region Animation & Movement
    /**
     * Starts movement and animation intervals as persistent (survive resets).
     */
    animate() {
        IntervalHub.startInterval(
            () => this.handleMovement(),
            1000 / 60,
            "persistent",
        );
        IntervalHub.startInterval(
            () => this.handleAnimation(),
            1000 / 15,
            "persistent",
        );
    }

    /**
     * Processes keyboard input and clamps position to level boundaries.
     */
    handleMovement() {
        if (this.isDead()) return;
        this.applyHorizontalMovement();
        this.clampPosition();
        this.handleRunSound();
        if (this.keyboard.SPACE && !this.isAboveGround()) this.jump();
        if (this.keyboard.D && this.bottles > 0 && this.canThrow())
            this.throwBottle();
    }

    /** Moves the character left or right and updates facing direction. */
    applyHorizontalMovement() {
        if (this.keyboard.RIGHT) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastMove = new Date().getTime();
        }
        if (this.keyboard.LEFT) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastMove = new Date().getTime();
        }
    }

    /** Prevents the character from leaving the defined level boundaries. */
    clampPosition() {
        if (this.x < this.minX) this.x = this.minX;
        if (this.x > this.maxX) this.x = this.maxX;
    }

    /** Selects and plays the correct animation for the current state. */
    handleAnimation() {
        if (this.isDead()) return this.playAnimation(IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimation(IMAGES_HURT);
        if (this.isAboveGround()) return this.playAnimation(IMAGES_JUMPING);
        if (this.keyboard.RIGHT || this.keyboard.LEFT)
            return this.playAnimation(IMAGES_WALKING);
        if (this.isLongIdle()) {
            this.playAnimation(IMAGES_LONG_IDLE);
            this.handleSnoringSound();
            return;
        }
        this.playAnimation(IMAGES_IDLE);
    }

    /**
     * Returns true if the character has been idle for more than 8 seconds.
     * @returns {boolean}
     */
    isLongIdle() {
        return new Date().getTime() - this.lastMove > 8000;
    }
    // #endregion

    // #region Sound Helpers
    /** Starts or stops the running sound depending on current movement state. */
    handleRunSound() {
        if (!this.world) return;
        const isMoving =
            (this.keyboard.RIGHT || this.keyboard.LEFT) &&
            !this.isAboveGround();
        if (isMoving && !this.world.audioManager.sounds.run.paused) return;
        if (isMoving) this.world.audioManager.play("run");
        else this.world.audioManager.stop("run");
    }

    /** Plays the snoring sound once when the character enters long-idle. */
    handleSnoringSound() {
        if (!this.world || !this.isGameActive()) return;
        if (this.world.audioManager.sounds.snoring.paused) {
            this.world.audioManager.play("snoring");
        }
    }

    /**
     * Returns true only while the game is actively being played.
     * @returns {boolean}
     */
    isGameActive() {
        return (
            this.world.gameStarted &&
            !this.world.gameOver &&
            !this.world.gameWon
        );
    }
    // #endregion

    // #region Actions
    /** Makes the character jump and plays the jump sound. */
    jump() {
        this.speedY = 30;
        if (this.world) this.world.audioManager.play("jump");
    }

    /** Creates and launches a throwable bottle in the current facing direction. */
    throwBottle() {
        this.lastThrow = new Date().getTime();
        this.bottles--;
        this.world.bottleBar.setPercentage(this.bottles * 20);
        const throwX = this.otherDirection ? this.x - 50 : this.x + 100;
        const bottle = new ThrowableObject(
            throwX,
            this.y + 100,
            this.otherDirection,
        );
        bottle.world = this.world;
        this.world.throwableObjects.push(bottle);
        this.world.audioManager.play("bottleShot");
    }

    /**
     * Returns true if enough time has passed since the last throw.
     * @returns {boolean}
     */
    canThrow() {
        return new Date().getTime() - this.lastThrow > 500;
    }
    // #endregion
}
// #endregion class Character
