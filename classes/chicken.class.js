import { MovableObject } from "./movable-object.class.js";

const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
];

export class Chicken extends MovableObject {
    x = 700;
    y = 360;
    width = 70;
    height = 80;
    speed = 0.5;

    constructor() {
        super();
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_DEAD);
    }
}

//Was pasiert hier?

//extends MovableObject -> Chicken erbt alles von der Basisklasse – genau wie Character
//x = 700 -> Chicken startet rechts außerhalb des sichtbaren Bereichs
//speed = 0.5 -> Chicken läuft langsamer als Pepe
//Die Dead-Animation hat nur ein Bild - das reicht für den Todesmoment