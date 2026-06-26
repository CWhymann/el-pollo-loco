import { MovableObject } from "./movable-object.class.js";

const IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
];

export class StatusBar extends MovableObject {
    width = 200;
    height = 50;
    percentage = 100;

    /**
     * Creates a status bar at the given position.
     * @param {number} x - The x position of the status bar.
     * @param {number} y - The y position of the status bar.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImages(IMAGES_HEALTH);
        this.setPercentage(100);
    }

    /**
     * Sets the status bar image based on the given percentage.
     * @param {number} percentage - The current health percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const index = this.resolveImageIndex();
        this.img = this.imageCache[IMAGES_HEALTH[index]];
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
