import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

const IMAGES_CLOUD = [
    "assets/img/5_background/layers/4_clouds/1.png",
    "assets/img/5_background/layers/4_clouds/2.png",
];

/**
 * Represents a moving background cloud.
 */
// #region class Cloud
export class Cloud extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    speed = 0.15;
    moveIntervalId = null;
    // #endregion

    // #region Constructor
    /**
     * @param {number} x - The x position.
     */
    constructor(x) {
        super();
        this.x = x;
        this.y = 0;
        this.loadImage(IMAGES_CLOUD[Math.floor(Math.random() * 2)]);
        this.animate();
    }
    // #endregion

    // #region Logic
    /** Starts cloud movement via IntervalHub. */
    animate() {
        this.moveIntervalId = IntervalHub.startInterval(
            () => this.moveLeft(),
            1000 / 60,
        );
    }

    /** Moves the cloud to the left. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Stops the movement interval. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
    }
    // #endregion
}
// #endregion class Cloud
