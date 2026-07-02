import { MovableObject } from "./movable-object.class.js";

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

/**
 * Represents a status bar (health, bottle or coin).
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
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {string} type - 'health', 'bottle' or 'coin'.
     */
    constructor(x, y, type) {
        super();
        this.images = this.getImagesByType(type);
        this.loadImages(this.images);
        this.setPercentage(100);
        this.x = x;
        this.y = y;
    }
    // #endregion

    // #region Logic
    /**
     * @param {string} type
     * @returns {string[]}
     */
    getImagesByType(type) {
        if (type === "health") return IMAGES_HEALTH;
        if (type === "bottle") return IMAGES_BOTTLE;
        return IMAGES_COIN;
    }

    /**
     * @param {number} percentage
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const index = this.resolveImageIndex();
        this.img = this.imageCache[this.images[index]];
    }

    /** @returns {number} */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
    // #endregion
}
// #endregion class StatusBar
