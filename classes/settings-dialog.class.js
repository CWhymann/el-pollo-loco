import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the in-canvas settings dialog overlay.
 * Lets the player adjust music and effects volume independently,
 * and can be closed via the X icon or by clicking outside the box.
 */
// #region class SettingsDialog
export class SettingsDialog extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    x = 0;
    y = 0;
    boxX = 160;
    boxY = 90;
    boxWidth = 400;
    boxHeight = 220;
    closeSize = 12;
    sliderWidth = 300;
    sliderHeight = 6;
    knobRadius = 9;
    musicVolume = 1;
    effectsVolume = 1;
    // #endregion

    // #region Drawing
    /**
     * Draws the dialog overlay, box, sliders and close icon.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.drawOverlay(ctx);
        this.drawBox(ctx);
        this.drawTitle(ctx);
        this.drawSlider(ctx, this.getMusicSliderY(), this.musicVolume, "Musik");
        this.drawSlider(
            ctx,
            this.getEffectsSliderY(),
            this.effectsVolume,
            "Effekte",
        );
        this.drawCloseIcon(ctx);
    }

    /** Draws the darkened background covering the whole canvas. */
    drawOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /** Draws the dialog box background and border. */
    drawBox(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
        ctx.strokeStyle = "#f30f31";
        ctx.lineWidth = 3;
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        ctx.strokeRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        ctx.restore();
    }

    /** Draws the dialog title. */
    drawTitle(ctx) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.font = "28px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Lautstärke", this.boxX + 24, this.boxY + 48);
        ctx.restore();
    }

    /**
     * Draws a single labeled slider track and its knob.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} sliderY - The y-position of this slider's track.
     * @param {number} value - Current volume value (0 to 1).
     * @param {string} label - Label text shown above the slider.
     */
    drawSlider(ctx, sliderY, value, label) {
        const sliderX = this.getSliderX();
        ctx.save();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        ctx.fillText(label, sliderX, sliderY - 14);

        ctx.fillStyle = "#555";
        ctx.fillRect(sliderX, sliderY, this.sliderWidth, this.sliderHeight);

        ctx.fillStyle = "#f30f31";
        ctx.fillRect(
            sliderX,
            sliderY,
            this.sliderWidth * value,
            this.sliderHeight,
        );

        const knobX = sliderX + this.sliderWidth * value;
        const knobY = sliderY + this.sliderHeight / 2;
        ctx.beginPath();
        ctx.arc(knobX, knobY, this.knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#fff5e0";
        ctx.fill();
        ctx.restore();
    }

    /** Draws the close (X) icon in the top-right corner of the box. */
    drawCloseIcon(ctx) {
        ctx.save();
        ctx.strokeStyle = "#fff5e0";
        ctx.lineWidth = 3;
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        const half = this.closeSize;
        ctx.beginPath();
        ctx.moveTo(cx - half, cy - half);
        ctx.lineTo(cx + half, cy + half);
        ctx.moveTo(cx + half, cy - half);
        ctx.lineTo(cx - half, cy + half);
        ctx.stroke();
        ctx.restore();
    }
    // #endregion

    // #region Hit Testing
    /**
     * Checks if a canvas-space point hits the close icon.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @returns {boolean} True if the point is within the close icon area.
     */
    isCloseHit(px, py) {
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        const r = this.closeSize + 10;
        return px > cx - r && px < cx + r && py > cy - r && py < cy + r;
    }

    /**
     * Checks if a canvas-space point is outside the dialog box.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @returns {boolean} True if the point is outside the box.
     */
    isOutsideBox(px, py) {
        return (
            px < this.boxX ||
            px > this.boxX + this.boxWidth ||
            py < this.boxY ||
            py > this.boxY + this.boxHeight
        );
    }

    /**
     * Checks if a canvas-space point is near the music slider's knob area.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @returns {boolean} True if the point hits the music slider.
     */
    isMusicSliderHit(px, py) {
        return this.isSliderHit(px, py, this.getMusicSliderY());
    }

    /**
     * Checks if a canvas-space point is near the effects slider's knob area.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @returns {boolean} True if the point hits the effects slider.
     */
    isEffectsSliderHit(px, py) {
        return this.isSliderHit(px, py, this.getEffectsSliderY());
    }

    /**
     * Generic check whether a point is close enough to a slider track
     * (vertically) to count as grabbing its knob, regardless of x-position
     * along the track.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @param {number} sliderY - The y-position of the slider track.
     * @returns {boolean} True if the point is within the slider's grab area.
     */
    isSliderHit(px, py, sliderY) {
        const sliderX = this.getSliderX();
        const margin = this.knobRadius + 4;
        return (
            px > sliderX - margin &&
            px < sliderX + this.sliderWidth + margin &&
            py > sliderY - margin &&
            py < sliderY + margin
        );
    }

    /**
     * Converts a canvas-space x position into a slider value between 0 and 1.
     * @param {number} px - x coordinate in canvas space.
     * @returns {number} The resulting value, clamped between 0 and 1.
     */
    getValueFromX(px) {
        const sliderX = this.getSliderX();
        const raw = (px - sliderX) / this.sliderWidth;
        return Math.min(1, Math.max(0, raw));
    }
    // #endregion
    // #endregion

    // #region Layout Helpers
    /** @returns {number} The shared x-position where sliders start. */
    getSliderX() {
        return this.boxX + 24;
    }

    /** @returns {number} The y-position of the music slider track. */
    getMusicSliderY() {
        return this.boxY + 90;
    }

    /** @returns {number} The y-position of the effects slider track. */
    getEffectsSliderY() {
        return this.boxY + 150;
    }

    /** @returns {number} The x-center of the close icon. */
    getCloseX() {
        return this.boxX + this.boxWidth - 24;
    }

    /** @returns {number} The y-center of the close icon. */
    getCloseY() {
        return this.boxY + 24;
    }
    // #endregion
}
// #endregion class SettingsDialog
