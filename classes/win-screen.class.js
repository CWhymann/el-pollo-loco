import { MovableObject } from "./movable-object.class.js";

/**
 * Represents the win screen overlay image.
 */
// #region class WinScreen
export class WinScreen extends MovableObject {
    // #region Properties
    width = 720;
    height = 480;
    x = 0;
    y = 0;
    // #endregion

    // #region Constructor
    /** Loads the win screen image. */
    constructor() {
        super();
        this.loadImage("assets/img/You won, you lost/You won A.png");
    }
    // #endregion
}
// #endregion class WinScreen
