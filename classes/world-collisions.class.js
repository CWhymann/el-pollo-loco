import { Endboss } from "./endboss.class.js";
import { ChickenSmall } from "./chicken-small.class.js";

/**
 * Handles all collision detection and response for the game world.
 */
// #region class WorldCollisions
export class WorldCollisions {
    // #region Constructor
    /**
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
    }
    // #endregion

    // #region Collision Checks
    /** Checks each enemy against the character and dispatches the right response. */
    checkCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy))
                this.handleEnemyCollision(enemy);
        });
        this.checkGameOver();
    }

    /** Triggers game over if the character is dead and not already flagged. */
    checkGameOver() {
        if (this.world.character.isDead() && !this.world.gameOver) {
            this.world.gameOver = true;
            this.world.audioManager.play("gameOver");
        }
    }

    /**
     * Dispatches a collision with an enemy to the correct handler.
     * @param {MovableObject} enemy - The enemy colliding with the character.
     */
    handleEnemyCollision(enemy) {
        if (this.isKnockoutHit(enemy)) this.applyKnockout(enemy);
        else if (this.isJumpKill(enemy)) enemy.hit();
        else if (this.isCharacterHit(enemy)) this.applyCharacterDamage(enemy);
    }

    /**
     * Returns true if the collision qualifies as a ChickenSmall knockout.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isKnockoutHit(enemy) {
        return (
            enemy instanceof ChickenSmall &&
            this.world.character.isAboveGround() &&
            this.world.character.speedY < 0 &&
            !enemy.isKnockedOut
        );
    }

    /**
     * Stuns a ChickenSmall and plays the knockout sound.
     * @param {ChickenSmall} enemy - The chicken to knock out.
     */
    applyKnockout(enemy) {
        enemy.isKnockedOut = true;
        enemy.knockedOutTime = new Date().getTime();
        this.world.audioManager.play("chickenKnockout");
    }

    /**
     * Returns true if the character is jumping on top of a killable enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isJumpKill(enemy) {
        return (
            !(enemy instanceof Endboss) &&
            !(enemy instanceof ChickenSmall) &&
            this.world.character.isAboveGround() &&
            this.world.character.speedY < 0
        );
    }

    /**
     * Returns true if the character should receive damage from this enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isCharacterHit(enemy) {
        return (
            !this.world.character.isHurt() &&
            !this.world.character.isAboveGround() &&
            !(enemy instanceof ChickenSmall && enemy.isKnockedOut) &&
            !enemy.isDying
        );
    }

    /**
     * Applies damage and knockback to the character based on the attacking enemy type.
     * @param {MovableObject} enemy - The enemy causing the damage.
     */
    applyCharacterDamage(enemy) {
        const damage = enemy instanceof Endboss ? 20 : 5;
        this.world.character.energy -= damage;
        if (this.world.character.energy < 0) this.world.character.energy = 0;
        this.world.character.lastHit = new Date().getTime();
        this.world.healthBar.setPercentage(this.world.character.energy);
        this.world.audioManager.play("damage");
        if (enemy instanceof Endboss) this.applyKnockback(enemy);
    }

    /**
     * Pushes the character away from the endboss on contact.
     * @param {Endboss} enemy - The endboss causing the knockback.
     */
    applyKnockback(enemy) {
        const knockbackX = this.world.character.x < enemy.x ? -80 : 80;
        this.world.character.x += knockbackX;
        this.world.character.speedY = 10;
    }

    /** Checks each coin for a collision with the character and collects it. */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) this.collectCoin(index);
        });
    }

    /**
     * Removes a coin, increments the counter and updates the coin bar.
     * @param {number} index - Index of the coin in the level's coin array.
     */
    collectCoin(index) {
        this.world.level.coins.splice(index, 1);
        this.world.character.coins++;
        this.world.coinBar.setPercentage(
            this.calculateBarPercentage(
                this.world.character.coins,
                this.world.totalCoins,
            ),
        );
        this.world.audioManager.play("coin");
    }

    /** Checks each ground bottle for a collision with the character and picks it up. */
    checkBottleCollisions() {
        this.world.level.bottles = this.world.level.bottles.filter(
            (bottle) => !this.collectBottle(bottle),
        );
    }

    /**
     * Picks up a bottle if the character is colliding with it.
     * @param {Bottle} bottle - The bottle to check.
     * @returns {boolean} True if the bottle was collected and should be removed.
     */
    collectBottle(bottle) {
        if (!this.world.character.isColliding(bottle)) return false;
        this.world.character.bottles++;
        this.world.bottleBar.setPercentage(
            this.calculateBarPercentage(
                this.world.character.bottles,
                this.world.totalBottles,
            ),
        );
        this.world.audioManager.play("bottlePickup");
        return true;
    }

    /**
     * Maps a collected-item count to a status bar percentage in 20% steps.
     * @param {number} collected - Number of items collected so far.
     * @param {number} total - Total items available in the level.
     * @returns {number} Percentage value between 0 and 100.
     */
    calculateBarPercentage(collected, total) {
        if (total <= 0) return 0;
        const step = Math.ceil((collected / total) * 5);
        return Math.min(100, step * 20);
    }

    /** Checks each thrown bottle against every enemy and applies hit effects. */
    checkThrowableCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.thrown)
                    this.applyBottleHit(bottle, enemy);
            });
        });
    }

    /**
     * Marks bottle as thrown, damages enemy and plays appropriate sounds.
     * @param {ThrowableObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    applyBottleHit(bottle, enemy) {
        bottle.thrown = true;
        enemy.hit();
        this.world.audioManager.play("bottleBreak");
        if (enemy instanceof Endboss)
            this.world.audioManager.play("endbossHurt");
    }

    /** Triggers the endboss alert the first time the character enters its zone. */
    checkEndbossContact() {
        const endboss = this.world.level.enemies.find(
            (e) => e instanceof Endboss,
        );
        if (
            endboss &&
            this.world.character.x > 1800 &&
            !endboss.hadFirstContact
        )
            this.triggerEndbossAlert(endboss);
    }

    /**
     * Sets first contact flag and plays the endboss approach sound.
     * @param {Endboss} endboss - The endboss instance.
     */
    triggerEndbossAlert(endboss) {
        endboss.hadFirstContact = true;
        this.world.audioManager.play("endbossApproach");
    }

    /** Removes all enemies that have been flagged for deletion. */
    removeDeadEnemies() {
        this.world.level.enemies = this.world.level.enemies.filter(
            (enemy) => !enemy.markedForDeletion,
        );
    }
    // #endregion
}
// #endregion class WorldCollisions
