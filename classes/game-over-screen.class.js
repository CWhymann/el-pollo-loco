import { MovableObject } from "./movable-object.class.js";

export class GameOverScreen extends MovableObject {
    width = 720;
    height = 480;
    x = 0;
    y = 0;

    /**
     * Creates the game over screen.
     */
    constructor() {
        super();
        this.loadImage(
            "assets/img/9_intro_outro_screens/game_over/game over.png",
        );
    }
}
