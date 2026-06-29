import { MovableObject } from "./movable-object.class.js";

export class StartScreen extends MovableObject {
    width = 720;
    height = 480;
    x = 0;
    y = 0;

    /**
     * Creates the start screen.
     */
    constructor() {
        super();
        this.loadImage(
            "assets/img/9_intro_outro_screens/start/startscreen_1.png",
        );
    }
}
