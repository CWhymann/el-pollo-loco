import { AudioManager } from "./audio-manager.class.js";

/**
 * Handles all audio loading and sound management for the game world.
 */
// #region class WorldAudio
export class WorldAudio {
    // #region Properties
    audioManager = new AudioManager();
    // #endregion

    // #region Constructor
    /** Initialises AudioManager: loads volume/mute state and all sounds. */
    constructor() {
        this.audioManager.loadVolumeState();
        this.audioManager.loadMuteState();
        this.loadSounds();
    }
    // #endregion

    // #region Sound Setup
    /** Loads all game sounds by category into the AudioManager. */
    loadSounds() {
        this.loadCharacterSounds();
        this.loadEnemySounds();
        this.loadCollectibleSounds();
        this.loadThrowableSounds();
        this.loadGameSounds();
    }

    /** Loads all character-related sounds. */
    loadCharacterSounds() {
        this.audioManager.loadSound(
            "jump",
            "assets/audio/EPL_sounds/sounds/character/characterJump.wav",
        );
        this.audioManager.loadSound(
            "run",
            "assets/audio/EPL_sounds/sounds/character/characterRun.mp3",
            true,
        );
        this.audioManager.loadSound(
            "damage",
            "assets/audio/EPL_sounds/sounds/character/characterDamage.mp3",
        );
        this.audioManager.loadSound(
            "gameOver",
            "assets/audio/EPL_sounds/sounds/game/gameOver.wav",
        );
        this.audioManager.loadSound(
            "snoring",
            "assets/audio/EPL_sounds/sounds/character/characterSnoring.mp3",
        );
    }

    /** Loads all enemy-related sounds. */
    loadEnemySounds() {
        this.audioManager.loadSound(
            "chickenDead",
            "assets/audio/EPL_sounds/sounds/chicken/chickenDead.mp3",
        );
        this.audioManager.loadSound(
            "chickenDead2",
            "assets/audio/EPL_sounds/sounds/chicken/chickenDead2.mp3",
        );
        this.audioManager.loadSound(
            "chickenKnockout",
            "assets/audio/EPL_sounds/sounds/chicken/chickenKnockout.wav",
        );
        this.audioManager.loadSound(
            "endbossApproach",
            "assets/audio/EPL_sounds/sounds/endboss/endbossApproach.wav",
        );
        this.audioManager.loadSound(
            "endbossHurt",
            "assets/audio/EPL_sounds/sounds/endboss/endbossHurt.mp3",
        );
        this.audioManager.loadSound(
            "endbossDead",
            "assets/audio/EPL_sounds/sounds/endboss/grillen.mp3",
        );
    }

    /** Loads all collectible-related sounds. */
    loadCollectibleSounds() {
        this.audioManager.loadSound(
            "coin",
            "assets/audio/EPL_sounds/sounds/collectibles/collectSound.wav",
        );
        this.audioManager.loadSound(
            "bottlePickup",
            "assets/audio/EPL_sounds/sounds/collectibles/bottleCollectSound.wav",
        );
    }

    /** Loads all throwable-related sounds. */
    loadThrowableSounds() {
        this.audioManager.loadSound(
            "bottleBreak",
            "assets/audio/EPL_sounds/sounds/throwable/bottleBreak.mp3",
        );
        this.audioManager.loadSound(
            "bottleShot",
            "assets/audio/EPL_sounds/sounds/throwable/bottleShot.wav",
        );
    }

    /** Loads all game-state sounds (music, win, start). */
    loadGameSounds() {
        this.audioManager.loadSound(
            "gameWin",
            "assets/audio/EPL_sounds/sounds/game/gameWin.wav",
        );
        this.audioManager.loadSound(
            "gameStart",
            "assets/audio/EPL_sounds/sounds/game/gameStart.mp3",
        );
        this.audioManager.loadSound(
            "background",
            "assets/audio/EPL_sounds/sounds/game/backgroundMusic.mp3",
            true,
            true,
        );
    }
    // #endregion
}
// #endregion class WorldAudio
