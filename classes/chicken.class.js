import { MovableObject } from "./movable-object.class.js";

const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
];

export class Chicken extends MovableObject {
    x = 700 + Math.random() * 500;
    y = 360;
    width = 70;
    height = 80;
    speed = 0.15 + Math.random() * 0.5;

    constructor() {
        super();
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
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
     * Moves the chicken to the left.
     */
    handleMovement() {
        if (!this.isDead()) {
            this.x -= this.speed;
        }
    }

    /**
     * Handles animation based on current state.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.playAnimation(IMAGES_DEAD);
        } else {
            this.playAnimation(IMAGES_WALKING);
        }
    }
}
