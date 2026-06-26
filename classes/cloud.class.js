import { MovableObject } from "./movable-object.class.js";

const IMAGES_CLOUD = [
    "assets/img/5_background/layers/4_clouds/1.png",
    "assets/img/5_background/layers/4_clouds/2.png",
];

export class Cloud extends MovableObject {
    width = 720;
    height = 480;
    speed = 0.15;

    /**
     * Creates a cloud at the given position.
     * @param {number} x - The x position of the cloud.
     */
    constructor(x) {
        super();
        this.x = x;
        this.y = 0;
        this.loadImage(IMAGES_CLOUD[Math.floor(Math.random() * 2)]);
        this.animate();
    }

    /**
     * Starts the cloud movement interval.
     */
    animate() {
        setInterval(() => this.moveLeft(), 1000 / 60);
    }

    /**
     * Moves the cloud to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }
}
