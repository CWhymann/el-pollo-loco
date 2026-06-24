import { MovableObject } from "./movable-object.class.js";

const IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
];

const IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
];

const IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
];

const IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
];

const IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
];

export class Character extends MovableObject {
    x = 0;
    y = 200;
    width = 120;
    height = 280;
    speed = 5;

    constructor() {
        super();
        this.loadImage(IMAGES_IDLE[0]);
        this.loadImages(IMAGES_IDLE);
        this.loadImages(IMAGES_WALKING);
        this.loadImages(IMAGES_JUMPING);
        this.loadImages(IMAGES_HURT);
        this.loadImages(IMAGES_DEAD);
    }
}
//Was passiert hier?

//extends MovableObject -> Character erbt alles von der Basisklasse
//super() -> ruft den Konstruktor der Elternklasse auf – das ist in JavaScript Pflicht bei Vererbung
//x, y -> Startposition von Pepe auf dem Canvas
//speed -> wie schnell sich Pepe bewegt
//loadImage() -> kommt aus MovableObject – ich nutze sie direkt, ohne sie neu zu schreiben! -> setzt das erste Idle-Bild als Startbild -> → lädt alle Animations-Bilder in den Cache vor – so gibt es später keine Verzögerung beim Abspielen
//PS.:Die Bild-Arrays stehen als Konstanten außerhalb der Klasse – sauber und übersichtlich, die Klasse selbst bleibt schlank
//Die Klasse ist vorbereitet für alle Zustände: idle, walking, jumping, hurt, dead