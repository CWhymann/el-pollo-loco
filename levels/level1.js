import { BackgroundObject } from "../classes/background-object.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Coin } from "../classes/coin.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { Cloud } from "../classes/cloud.class.js";

/**
 * Creates a fresh instance of level 1 with all game objects.
 * @returns {object} The level1 object containing enemies, coins, bottles, clouds and background.
 */
export function createLevel1() {
    return {
        enemies: [
            new Chicken(700),
            new Chicken(1100),
            new Chicken(1500),
            new ChickenSmall(800),
            new ChickenSmall(1200),
            new ChickenSmall(1600),
            new Endboss(),
        ],
        coins: [
            new Coin(200, 300),
            new Coin(250, 250),
            new Coin(400, 200),
            new Coin(450, 280),
            new Coin(600, 300),
            new Coin(650, 200),
            new Coin(900, 250),
            new Coin(950, 320),
            new Coin(1200, 300),
            new Coin(1250, 200),
            new Coin(1500, 250),
            new Coin(1550, 300),
            new Coin(1800, 280),
            new Coin(1850, 200),
        ],

        bottles: [
            new Bottle(300, 380),
            new Bottle(500, 380),
            new Bottle(800, 380),
            new Bottle(1100, 380),
            new Bottle(1400, 380),
        ],

        clouds: [
            new Cloud(0),
            new Cloud(720),
            new Cloud(1440),
            new Cloud(2160),
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

            new BackgroundObject(
                "assets/img/5_background/layers/air.png",
                1440,
            ),
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

            new BackgroundObject(
                "assets/img/5_background/layers/air.png",
                2160,
            ),
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

            new BackgroundObject(
                "assets/img/5_background/layers/air.png",
                2880,
            ),
            new BackgroundObject(
                "assets/img/5_background/layers/3_third_layer/1.png",
                2880,
            ),
            new BackgroundObject(
                "assets/img/5_background/layers/2_second_layer/1.png",
                2880,
            ),
            new BackgroundObject(
                "assets/img/5_background/layers/1_first_layer/1.png",
                2880,
            ),
        ],
    };
}
