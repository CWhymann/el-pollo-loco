import { BackgroundObject } from "../classes/background-object.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { ChickenSmall } from "../classes/chicken-small.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Coin } from "../classes/coin.class.js";
import { Bottle } from "../classes/bottle.class.js";
import { Cloud } from "../classes/cloud.class.js";

/**
 * Creates a fresh instance of level 1 with all game objects.
 * @returns {object} Level data containing enemies, coins, bottles, clouds and background.
 */
export function createLevel1() {
    return {
        enemies: createEnemies(),
        coins: createCoins(),
        bottles: createBottles(),
        clouds: createClouds(),
        backgroundObjects: createBackgroundObjects(),
    };
}

/** @returns {MovableObject[]} All enemies for level 1. */
function createEnemies() {
    return [
        new Chicken(700),
        new Chicken(1100),
        new Chicken(1500),
        new ChickenSmall(800),
        new ChickenSmall(1200),
        new ChickenSmall(1600),
        new Endboss(),
    ];
}

/** @returns {Coin[]} All collectible coins for level 1. */
function createCoins() {
    return [
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
    ];
}

/** @returns {Bottle[]} All collectible ground bottles for level 1. */
function createBottles() {
    return [
        new Bottle(300, 380),
        new Bottle(500, 380),
        new Bottle(800, 380),
        new Bottle(1100, 380),
        new Bottle(1400, 380),
    ];
}

/** @returns {Cloud[]} All background clouds for level 1. */
function createClouds() {
    return [new Cloud(0), new Cloud(720), new Cloud(1440), new Cloud(2160)];
}

/** @returns {BackgroundObject[]} All parallax background tiles for level 1. */
function createBackgroundObjects() {
    return [
        ...createBackgroundSection(-720, "1", true),
        ...createBackgroundSection(0, "1"),
        ...createBackgroundSection(720, "2"),
        ...createBackgroundSection(1440, "1"),
        ...createBackgroundSection(2160, "2"),
        ...createBackgroundSection(2880, "1"),
    ];
}

/**
 * Creates one set of four parallax background tiles at the given x position.
 * @param {number} x - The x position of this background section.
 * @param {string} variant - The image variant number ('1' or '2').
 * @param {boolean} flip - Whether to flip the tiles horizontally.
 * @returns {BackgroundObject[]} Four background layer tiles.
 */
function createBackgroundSection(x, variant, flip = false) {
    const base = "assets/img/5_background/layers";
    return [
        new BackgroundObject(`${base}/air.png`, x, flip),
        new BackgroundObject(`${base}/3_third_layer/${variant}.png`, x, flip),
        new BackgroundObject(`${base}/2_second_layer/${variant}.png`, x, flip),
        new BackgroundObject(`${base}/1_first_layer/${variant}.png`, x, flip),
    ];
}
