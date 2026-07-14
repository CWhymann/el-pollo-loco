import { MovableObject } from "./movable-object.class.js";

// #region Image Constants
const IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
];

const IMAGES_BOTTLE = [
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
];

const IMAGES_COIN = [
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
];
// #endregion

/**
 * Represents a HUD status bar for health, bottles or coins.
 * Displays one of six pre-rendered images based on the current percentage.
 */
// #region class StatusBar
export class StatusBar extends MovableObject {
    // #region Properties
    width = 200;
    height = 50;
    percentage = 100;
    images;
    // #endregion

    // #region Constructor
    /**
     * @param {number} x - The x position on the canvas.
     * @param {number} y - The y position on the canvas.
     * @param {string} type - Bar type: 'health', 'bottle' or 'coin'.
     */
    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.images = this.getImagesByType(type);
        this.loadImages(this.images);
        this.setPercentage(100);
    }
    // #endregion

    // #region Logic
    /**
     * Returns the correct image array for the given bar type.
     * @param {string} type - 'health', 'bottle' or 'coin'.
     * @returns {string[]} Array of image paths for the bar type.
     */
    getImagesByType(type) {
        if (type === "health") return IMAGES_HEALTH;
        if (type === "bottle") return IMAGES_BOTTLE;
        return IMAGES_COIN;
    }

    /**
     * Updates the displayed image to match the given percentage.
     * @param {number} percentage - Value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.images[this.resolveImageIndex()]];
    }

    /**
     * Maps the current percentage to one of six image indices (0–5).
     * @returns {number} Index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
    // #endregion
}
// #endregion class StatusBar
