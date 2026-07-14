import { createLevel1 } from "../levels/level1.js";
import { IntervalHub } from "./interval-hub.class.js";

/**
 * Handles all game state transitions for the game world.
 */
// #region class WorldGameControl
export class WorldGameControl {
    // #region Constructor
    /**
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
    }
    // #endregion

    // #region Game Control
    /** Starts the game: resets state, loads level and shows game UI. */
    startGame() {
        this.resetCharacterState();
        this.resetStatusBars();
        this.loadLevel();
        this.world.gameStarted = true;
        this.world.audioManager.play("gameStart");
        if (this.world.audioManager.sounds.background.paused)
            this.world.audioManager.play("background");
        this.updateStartScreenVisibility(false);
    }

    /** Resets the character's position, energy and inventory to defaults. */
    resetCharacterState() {
        const c = this.world.character;
        c.x = 0;
        c.y = 155;
        c.energy = 100;
        c.bottles = 0;
        c.coins = 0;
        c.speedY = 0;
        c.otherDirection = false;
    }

    /** Resets all three status bars to their initial percentages. */
    resetStatusBars() {
        this.world.healthBar.setPercentage(100);
        this.world.bottleBar.setPercentage(0);
        this.world.coinBar.setPercentage(0);
    }

    /** Creates a fresh level instance and assigns world reference to enemies. */
    loadLevel() {
        this.world.level = createLevel1();
        this.world.totalCoins = this.world.level.coins.length;
        this.world.totalBottles = this.world.level.bottles.length;
        this.world.level.enemies.forEach((enemy) => {
            enemy.world = this.world;
        });
    }

    /**
     * Shows or hides the start screen and game UI.
     * @param {boolean} show - True to show start screen, false to show game UI.
     */
    updateStartScreenVisibility(show) {
        const startScreen = document.getElementById("start-screen");
        const gameUi = document.getElementById("game-ui");
        if (startScreen) startScreen.style.display = show ? "block" : "none";
        if (gameUi) gameUi.style.display = show ? "none" : "flex";
    }

    /** Resets the full game state and restarts immediately without reloading. */
    resetGame() {
        IntervalHub.stopAllIntervals();
        this.world.audioManager.stopAll(["background"]);
        this.world.gameOver = false;
        this.world.gameWon = false;
        this.world.gameStarted = true;
        this.world.throwableObjects = [];
        this.resetCharacterState();
        this.resetStatusBars();
        this.loadLevel();
        this.world.spawnBottle();
        this.world.audioManager.play("gameStart");
        this.hideEndScreens();
    }

    /** Hides the Game-Over and Win overlay screens. */
    hideEndScreens() {
        const gameOverScreen = document.getElementById("game-over-screen");
        const winScreen = document.getElementById("win-screen");
        if (gameOverScreen) gameOverScreen.style.display = "none";
        if (winScreen) winScreen.style.display = "none";
    }

    /** Stops all level intervals, clears audio and returns to the start screen. */
    returnToStart() {
        IntervalHub.stopAllIntervals();
        this.world.audioManager.stopAll(["background"]);
        this.world.gameStarted = false;
        this.world.gameOver = false;
        this.world.gameWon = false;
        this.updateStartScreenVisibility(true);
    }
    // #endregion
}
// #endregion class WorldGameControl
