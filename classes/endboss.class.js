import { MovableObject } from "./movable-object.class.js";

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

export class Endboss extends MovableObject {
    x = 2200;
    y = 50;
    width = 250;
    height = 400;
    speed = 0.8;
    hadFirstContact = false;

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

    /**
     * Starts the movement and animation intervals.
     */
    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 1000 / 8);
    }

    /**
     * Moves the endboss towards the character after first contact.
     */
    handleMovement() {
        if (this.hadFirstContact && !this.isDead()) {
            this.x -= this.speed;
        }
    }

    /**
     * Handles animation based on current state.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.playAnimation(IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(IMAGES_HURT);
        } else if (this.hadFirstContact) {
            this.playAnimation(IMAGES_ATTACK);
        } else {
            this.playAnimation(IMAGES_ALERT);
        }
    }
}
