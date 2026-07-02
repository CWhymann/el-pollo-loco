import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the game start screen overlay.
 */
// #region class StartScreen
export class StartScreen extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    x = 0;
    y = 0;
    // #endregion

    // #region Constructor
    /**
     * Creates the start screen.
     */
    constructor() {
        super();
        this.loadImage(
            "assets/img/9_intro_outro_screens/start/startscreen_1.png",
        );
    }
    // #endregion
}
// #endregion class StartScreen
