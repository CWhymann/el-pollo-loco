import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the game over screen overlay.
 */
// #region class GameOverScreen
export class GameOverScreen extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    x = 0;
    y = 0;
    // #endregion

    // #region Constructor
    /**
     * Creates the game over screen.
     */
    constructor() {
        super();
        this.loadImage(
            "assets/img/9_intro_outro_screens/game_over/game over.png",
        );
    }
    // #endregion
}
// #endregion class GameOverScreen
