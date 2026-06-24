import { MovableObject } from "./movable-object.class.js";

const IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
];

const IMAGES_DEAD = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
];

export class ChickenSmall extends MovableObject {
    x = 700;
    y = 380;
    width = 50;
    height = 60;
    speed = 0.8;

    constructor() {
        super();
        this.loadImage(IMAGES_WALKING[0]);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_DEAD);
    }
}

//Was passiert hier?

//ChickenSmall ist kleiner und schneller als die normale Chicken – speed = 0.8
//Beide Chicken Klassen folgen exakt dem gleichen Muster wie Character
