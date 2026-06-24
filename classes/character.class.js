import { MovableObject } from "./movable-object.class.js";

export class Character extends MovableObject {
    x = 0;
    y = 280;
    width = 120;
    height = 250;
    speed = 5;

    constructor() {
        super();
        this.loadImage("img/character/idle/idle-1.png");
    }
}
//Was passiert hier?

//extends MovableObject -> Character erbt alles von der Basisklasse
//super() -> ruft den Konstruktor der Elternklasse auf – das ist in JavaScript Pflicht bei Vererbung
//x, y -> Startposition von Pepe auf dem Canvas
//speed -> wie schnell sich Pepe bewegt
//loadImage() -> kommt aus MovableObject – ich nutze sie direkt, ohne sie neu zu schreiben!