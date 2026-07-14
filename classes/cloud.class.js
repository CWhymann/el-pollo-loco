import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

// #region Image Constants
const IMAGES_CLOUD = [
    "assets/img/5_background/layers/4_clouds/1.png",
    "assets/img/5_background/layers/4_clouds/2.png",
];
// #endregion

/**
 * Represents a slowly drifting background cloud.
 * Picks one of two cloud images at random on creation.
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
     * @param {number} x - The starting x position of the cloud.
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
    /** Starts the leftward drift loop via IntervalHub. */
    animate() {
        this.moveIntervalId = IntervalHub.startInterval(
            () => this.moveLeft(),
            1000 / 60,
        );
    }

    /** Moves the cloud one step to the left each frame. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Stops the drift interval. */
    stop() {
        if (this.moveIntervalId) IntervalHub.stopInterval(this.moveIntervalId);
    }
    // #endregion
}
// #endregion class Cloud
