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

export class StatusBar extends MovableObject {
    width = 200;
    height = 50;
    percentage = 100;
    images;

    /**
     * Creates a status bar at the given position.
     * @param {number} x - The x position of the status bar.
     * @param {number} y - The y position of the status bar.
     * @param {string} type - The type of status bar: 'health', 'bottle' or 'coin'.
     */
    constructor(x, y, type) {
        super();
        this.images = this.getImagesByType(type);
        this.loadImages(this.images);
        this.setPercentage(100);
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the correct image array based on the type.
     * @param {string} type - The type of status bar.
     * @returns {string[]} The image array.
     */
    getImagesByType(type) {
        if (type === "health") return IMAGES_HEALTH;
        if (type === "bottle") return IMAGES_BOTTLE;
        return IMAGES_COIN;
    }

    /**
     * Sets the status bar image based on the given percentage.
     * @param {number} percentage - The current percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const index = this.resolveImageIndex();
        this.img = this.imageCache[this.images[index]];
    }

    /**
     * Returns the image index based on the current percentage.
     * @returns {number} The index of the correct image.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}
