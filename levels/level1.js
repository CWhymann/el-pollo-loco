import { BackgroundObject } from "../classes/background-object.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Coin } from "../classes/coin.class.js";
import { Bottle } from "../classes/bottle.class.js";

export const level1 = {
    enemies: [
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        new ChickenSmall(),
        new Endboss(),
    ],

    coins: [
        new Coin(200, 300),
        new Coin(400, 200),
        new Coin(600, 300),
        new Coin(900, 250),
        new Coin(1200, 300),
    ],

    bottles: [
        new Bottle(300, 380),
        new Bottle(500, 380),
        new Bottle(800, 380),
        new Bottle(1100, 380),
        new Bottle(1400, 380),
    ],

    backgroundObjects: [
        new BackgroundObject(
            "assets/img/5_background/layers/air.png",
            -720,
            true,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/3_third_layer/1.png",
            -720,
            true,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/2_second_layer/1.png",
            -720,
            true,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/1_first_layer/1.png",
            -720,
            true,
        ),

        new BackgroundObject("assets/img/5_background/layers/air.png", 0),
        new BackgroundObject(
            "assets/img/5_background/layers/3_third_layer/1.png",
            0,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/2_second_layer/1.png",
            0,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/1_first_layer/1.png",
            0,
        ),

        new BackgroundObject("assets/img/5_background/layers/air.png", 720),
        new BackgroundObject(
            "assets/img/5_background/layers/3_third_layer/2.png",
            720,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/2_second_layer/2.png",
            720,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/1_first_layer/2.png",
            720,
        ),

        new BackgroundObject("assets/img/5_background/layers/air.png", 1440),
        new BackgroundObject(
            "assets/img/5_background/layers/3_third_layer/1.png",
            1440,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/2_second_layer/1.png",
            1440,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/1_first_layer/1.png",
            1440,
        ),

        new BackgroundObject("assets/img/5_background/layers/air.png", 2160),
        new BackgroundObject(
            "assets/img/5_background/layers/3_third_layer/2.png",
            2160,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/2_second_layer/2.png",
            2160,
        ),
        new BackgroundObject(
            "assets/img/5_background/layers/1_first_layer/2.png",
            2160,
        ),
    ],
};
