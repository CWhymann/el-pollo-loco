import { MovableObject } from "./movable-object.class.js";

const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
];

export class ChickenSmall extends MovableObject {
    x = 700;
    y = 380;
    width = 50;
    height = 60;
    speed = 0.3 + Math.random() * 0.5;
    energy = 50;
    isKnockedOut = false;
    knockedOutTime = 0;
    knockedOutDuration = 2500;

    constructor(x) {
        super();
        this.x = x;
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
        setInterval(() => this.handleAnimation(), 1000 / 10);
    }

    /**
     * Moves the chicken to the left.
     */
    handleMovement() {
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

    /**
     * Handles animation based on current state.
     */
    handleAnimation() {
        if (this.isKnockedOut) {
            this.playAnimation(IMAGES_WALKING);
        } else {
            this.playAnimation(IMAGES_WALKING);
        }
    }
}
