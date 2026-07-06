import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the in-canvas controls dialog overlay.
 * Explains the keyboard controls and can be closed via the X icon
 * or by clicking outside the dialog box.
 */
// #region class ControlsDialog
export class ControlsDialog extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    x = 0;
    y = 0;
    boxX = 160;
    boxY = 90;
    boxWidth = 400;
    boxHeight = 320;
    closeSize = 12;
    // #endregion

    // #region Drawing
    /**
     * Draws the dialog overlay, box, controls list and close icon.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.drawOverlay(ctx);
        this.drawBox(ctx);
        this.drawText(ctx);
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

    /** Draws the title and control key descriptions. */
    drawText(ctx) {
        ctx.save();
        ctx.textAlign = "left";
        ctx.font = "28px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Steuerung", this.boxX + 24, this.boxY + 48);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        const keyboardLines = [
            "← →  Bewegen",
            "Leertaste  Springen",
            "D  Flasche werfen",
        ];
        keyboardLines.forEach((line, i) => {
            ctx.fillText(line, this.boxX + 24, this.boxY + 90 + i * 28);
        });

        ctx.font = "20px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Mobil (Touch)", this.boxX + 24, this.boxY + 200);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        const mobileLines = [
            "◀ ▶  Bewegen",
            "▲  Springen",
            "🍶  Flasche werfen",
        ];
        mobileLines.forEach((line, i) => {
            ctx.fillText(line, this.boxX + 24, this.boxY + 232 + i * 26);
        });
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
    /** @returns {number} The x-center of the close icon. */
    getCloseX() {
        return this.boxX + this.boxWidth - 24;
    }

    /** @returns {number} The y-center of the close icon. */
    getCloseY() {
        return this.boxY + 24;
    }

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
    // #endregion
}
// #endregion class ControlsDialog
