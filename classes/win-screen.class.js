import { MovableObject } from "./movable-object.class.js";

export class WinScreen extends MovableObject {
    width = 720;
    height = 480;
    x = 0;
    y = 0;

    /**
     * Creates the win screen.
     */
    constructor() {
        super();
        this.loadImage("assets/img/You won, you lost/You won A.png");
    }
}
