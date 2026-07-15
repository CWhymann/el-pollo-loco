import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the in-canvas controls dialog overlay.
 * Explains keyboard and mobile controls, closable via X or outside click.
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
     * Draws the full dialog: overlay, box, text sections and close icon.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.drawOverlay(ctx);
        this.drawBox(ctx);
        this.drawText(ctx);
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

    /** Draws the title, keyboard section and mobile section. */
    drawText(ctx) {
        ctx.save();
        ctx.textAlign = "left";
        this.drawKeyboardSection(ctx);
        this.drawMobileSection(ctx);
        ctx.restore();
    }

    /** Draws the keyboard controls title and key list. */
    drawKeyboardSection(ctx) {
        ctx.font = "28px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Steuerung", this.boxX + 24, this.boxY + 48);
        this.drawKeyboardLines(ctx);
    }

    /**
     * Draws the individual keyboard control lines.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawKeyboardLines(ctx) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        const lines = [
            "← →  Bewegen",
            "Leertaste  Springen",
            "D  Flasche werfen",
        ];
        lines.forEach((line, i) =>
            ctx.fillText(line, this.boxX + 24, this.boxY + 90 + i * 28),
        );
    }

    /** Draws the mobile touch controls title and button list. */
    drawMobileSection(ctx) {
        ctx.font = "20px Boogaloo";
        ctx.fillStyle = "#e80f2c";
        ctx.fillText("Mobil (Touch)", this.boxX + 24, this.boxY + 200);
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff5e0";
        const lines = ["◀ ▶  Bewegen", "▲  Springen", "🍶  Flasche werfen"];
        lines.forEach((line, i) =>
            ctx.fillText(line, this.boxX + 24, this.boxY + 232 + i * 26),
        );
    }

    /** Draws the X close icon in the top-right corner of the box. */
    drawCloseIcon(ctx) {
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        ctx.save();
        ctx.strokeStyle = "#fff5e0";
        ctx.lineWidth = 3;
        this.drawCloseLine(ctx, cx, cy);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws the two crossing lines of the close icon.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cx - Centre x of the icon.
     * @param {number} cy - Centre y of the icon.
     */
    drawCloseLine(ctx, cx, cy) {
        ctx.beginPath();
        ctx.moveTo(cx - this.closeSize, cy - this.closeSize);
        ctx.lineTo(cx + this.closeSize, cy + this.closeSize);
        ctx.moveTo(cx + this.closeSize, cy - this.closeSize);
        ctx.lineTo(cx - this.closeSize, cy + this.closeSize);
    }
    // #endregion

    // #region Hit Testing
    /** @returns {number} The x-centre of the close icon. */
    getCloseX() {
        return this.boxX + this.boxWidth - 24;
    }

    /** @returns {number} The y-centre of the close icon. */
    getCloseY() {
        return this.boxY + 24;
    }

    /**
     * Returns true if the given point is within the close icon's hit area.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
     * @returns {boolean}
     */
    isCloseHit(px, py) {
        const cx = this.getCloseX();
        const cy = this.getCloseY();
        const r = this.closeSize + 10;
        return px > cx - r && px < cx + r && py > cy - r && py < cy + r;
    }

    /**
     * Returns true if the given point is outside the dialog box.
     * @param {number} px - x coordinate in canvas space.
     * @param {number} py - y coordinate in canvas space.
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
    // #endregion
}
// #endregion class ControlsDialog
