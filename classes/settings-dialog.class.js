import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the in-canvas settings dialog overlay.
 * Lets the player adjust music and effects volume independently.
 * Closable via the X icon or by clicking outside the box.
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
     * Draws the full dialog: overlay, box, title, sliders and close icon.
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

    /** Draws a semi-transparent dark overlay over the whole canvas. */
    drawOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /** Draws the dialog box with dark fill and red border. */
    drawBox(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
        ctx.strokeStyle = "#f30f31";
        ctx.lineWidth = 3;
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        ctx.strokeRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        ctx.restore();
    }

    /** Draws the dialog title "Lautstärke". */
    drawTitle(ctx) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.font = "28px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Lautstärke", this.boxX + 24, this.boxY + 48);
        ctx.restore();
    }

    /**
     * Draws a labeled slider: track, filled portion and knob.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} sliderY - Vertical position of the slider track.
     * @param {number} value - Current volume value between 0 and 1.
     * @param {string} label - Label shown above the slider.
     */
    drawSlider(ctx, sliderY, value, label) {
        const sliderX = this.getSliderX();
        ctx.save();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        ctx.fillText(label, sliderX, sliderY - 14);
        this.drawSliderTrack(ctx, sliderX, sliderY, value);
        this.drawSliderKnob(ctx, sliderX, sliderY, value);
        ctx.restore();
    }

    /** Draws the grey background track and red filled portion of a slider. */
    drawSliderTrack(ctx, sliderX, sliderY, value) {
        ctx.fillStyle = "#555";
        ctx.fillRect(sliderX, sliderY, this.sliderWidth, this.sliderHeight);
        ctx.fillStyle = "#f30f31";
        ctx.fillRect(
            sliderX,
            sliderY,
            this.sliderWidth * value,
            this.sliderHeight,
        );
    }

    /** Draws the round knob at the current value position of a slider. */
    drawSliderKnob(ctx, sliderX, sliderY, value) {
        const knobX = sliderX + this.sliderWidth * value;
        const knobY = sliderY + this.sliderHeight / 2;
        ctx.beginPath();
        ctx.arc(knobX, knobY, this.knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#fff5e0";
        ctx.fill();
    }

    /** Draws the X close icon in the top-right corner of the box. */
    drawCloseIcon(ctx) {
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        ctx.save();
        ctx.strokeStyle = "#fff5e0";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - this.closeSize, cy - this.closeSize);
        ctx.lineTo(cx + this.closeSize, cy + this.closeSize);
        ctx.moveTo(cx + this.closeSize, cy - this.closeSize);
        ctx.lineTo(cx - this.closeSize, cy + this.closeSize);
        ctx.stroke();
        ctx.restore();
    }
    // #endregion

    // #region Hit Testing
    /**
     * Returns true if the point is within the close icon's hit area.
     * @param {number} px - x in canvas space.
     * @param {number} py - y in canvas space.
     * @returns {boolean}
     */
    isCloseHit(px, py) {
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        const r = this.closeSize + 10;
        return px > cx - r && px < cx + r && py > cy - r && py < cy + r;
    }

    /**
     * Returns true if the point lies outside the dialog box.
     * @param {number} px - x in canvas space.
     * @param {number} py - y in canvas space.
     * @returns {boolean}
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
     * Returns true if the point is within the music slider's grab area.
     * @param {number} px - x in canvas space.
     * @param {number} py - y in canvas space.
     * @returns {boolean}
     */
    isMusicSliderHit(px, py) {
        return this.isSliderHit(px, py, this.getMusicSliderY());
    }

    /**
     * Returns true if the point is within the effects slider's grab area.
     * @param {number} px - x in canvas space.
     * @param {number} py - y in canvas space.
     * @returns {boolean}
     */
    isEffectsSliderHit(px, py) {
        return this.isSliderHit(px, py, this.getEffectsSliderY());
    }

    /**
     * Returns true if the point is close enough to the given slider track to grab it.
     * @param {number} px - x in canvas space.
     * @param {number} py - y in canvas space.
     * @param {number} sliderY - y position of the slider track.
     * @returns {boolean}
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
     * Converts a canvas x position into a clamped volume value between 0 and 1.
     * @param {number} px - x in canvas space.
     * @returns {number}
     */
    getValueFromX(px) {
        const raw = (px - this.getSliderX()) / this.sliderWidth;
        return Math.min(1, Math.max(0, raw));
    }
    // #endregion

    // #region Layout Helpers
    /** @returns {number} x position where slider tracks begin. */
    getSliderX() {
        return this.boxX + 24;
    }

    /** @returns {number} y position of the music slider track. */
    getMusicSliderY() {
        return this.boxY + 90;
    }

    /** @returns {number} y position of the effects slider track. */
    getEffectsSliderY() {
        return this.boxY + 150;
    }

    /** @returns {number} x centre of the close icon. */
    getCloseX() {
        return this.boxX + this.boxWidth - 24;
    }

    /** @returns {number} y centre of the close icon. */
    getCloseY() {
        return this.boxY + 24;
    }
    // #endregion
}
// #endregion class SettingsDialog
