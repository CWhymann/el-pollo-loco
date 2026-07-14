import { ChickenSmall } from "./chicken-small.class.js";

/**
 * Handles all rendering and the main draw loop for the game world.
 */
// #region class WorldRendering
export class WorldRendering {
    // #region Constructor
    /**
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
    }
    // #endregion

    // #region Game Loop
    /** Main draw loop — clears canvas and delegates to the correct screen. */
    draw() {
        const { ctx, canvas, gameStarted, gameOver, gameWon } = this.world;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            this.drawStartScreen();
            return;
        }
        if (gameOver) {
            this.drawGameOverScreen();
            return;
        }
        if (gameWon) {
            this.drawWinScreen();
            return;
        }

        this.world.updateCamera();
        this.runCollisionChecks();
        this.drawGameWorld();
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the start screen, animated chicken and any open dialogs. */
    drawStartScreen() {
        this.addToMap(this.world.startScreen);
        this.addToMap(this.world.startScreenChicken);
        if (this.world.controlsDialogVisible)
            this.addToMap(this.world.controlsDialog);
        if (this.world.settingsDialogVisible)
            this.addToMap(this.world.settingsDialog);
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the game-over screen and stops the bottle spawn interval. */
    drawGameOverScreen() {
        this.addToMap(this.world.gameOverScreen);
        if (this.world.spawnIntervalId)
            IntervalHub.stopInterval(this.world.spawnIntervalId);
        requestAnimationFrame(() => this.draw());
    }

    /** Renders the win screen and any open overlay dialogs. */
    drawWinScreen() {
        this.addToMap(this.world.winScreen);
        if (this.world.settingsDialogVisible)
            this.addToMap(this.world.settingsDialog);
        requestAnimationFrame(() => this.draw());
    }
    // #endregion

    // #region Collision Dispatch
    /** Runs all collision checks for the current frame. */
    runCollisionChecks() {
        this.world.collisions.checkCollisions();
        this.world.collisions.checkCoinCollisions();
        this.world.collisions.checkBottleCollisions();
        this.world.collisions.checkThrowableCollisions();
        this.world.collisions.checkEndbossContact();
        this.world.collisions.removeDeadEnemies();
    }
    // #endregion

    // #region World Drawing
    /** Renders the full game world: background, enemies, items, HUD. */
    drawGameWorld() {
        const { ctx, camera_x, level, throwableObjects, character } =
            this.world;
        ctx.translate(camera_x, 0);
        this.addObjectsToMap(level.backgroundObjects);
        this.addObjectsToMap(level.clouds);
        this.addObjectsToMap(level.enemies);
        this.drawKnockedOutStars();
        this.addObjectsToMap(level.coins);
        this.addObjectsToMap(level.bottles);
        this.filterAndDrawThrowables();
        this.drawCharacterShadow();
        this.addToMap(character);
        ctx.translate(-camera_x, 0);
        this.drawHud();
    }

    /** Draws knockout stars above every currently stunned ChickenSmall. */
    drawKnockedOutStars() {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy instanceof ChickenSmall && enemy.isKnockedOut)
                this.drawKnockoutStars(enemy);
        });
    }

    /** Removes expired throwables, then draws the remaining ones. */
    filterAndDrawThrowables() {
        this.world.throwableObjects = this.world.throwableObjects.filter(
            (bottle) => !bottle.thrown || bottle.currentImage < 6,
        );
        this.addObjectsToMap(this.world.throwableObjects);
    }

    /** Renders the HUD (status bars) and the settings dialog if open. */
    drawHud() {
        this.addToMap(this.world.healthBar);
        this.addToMap(this.world.bottleBar);
        this.addToMap(this.world.coinBar);
        if (this.world.settingsDialogVisible)
            this.addToMap(this.world.settingsDialog);
    }

    /** Draws an elliptical shadow beneath the character, scaled by jump height. */
    drawCharacterShadow() {
        const { ctx, character } = this.world;
        const groundY = 420;
        const heightAboveGround = groundY - (character.y + character.height);
        const scale = Math.max(0.3, 1 - heightAboveGround / 200);
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.ellipse(
            character.x + character.width / 2,
            groundY,
            35 * scale,
            7.5 * scale,
            0,
            0,
            Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
    }
    // #endregion

    // #region Drawing Helpers
    /**
     * Draws every object in the given array onto the canvas.
     * @param {MovableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((obj) => this.addToMap(obj));
    }

    /**
     * Draws a single movable object, flipping it if otherDirection is set.
     * @param {MovableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) mo.drawFlipped(this.world.ctx);
        else mo.draw(this.world.ctx);
    }

    /**
     * Draws three orbiting star emojis above a knocked-out ChickenSmall.
     * @param {ChickenSmall} enemy - The stunned chicken.
     */
    drawKnockoutStars(enemy) {
        const { ctx } = this.world;
        const time = new Date().getTime();
        const timePassed = time - enemy.knockedOutTime;
        if (timePassed > enemy.knockedOutDuration) return;
        ctx.save();
        for (let i = 0; i < 3; i++) {
            const angle = time / 200 + i * 2.09;
            const starX = enemy.x + enemy.width / 2 + Math.cos(angle) * 20;
            const starY = enemy.y - 20 + Math.sin(angle) * 10;
            ctx.font = "16px Arial";
            ctx.fillText("⭐", starX, starY);
        }
        ctx.restore();
    }
    // #endregion
}
// #endregion class WorldRendering
