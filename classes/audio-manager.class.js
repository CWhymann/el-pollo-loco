/**
 * Manages all game audio, including sound effects and mute state.
 */
// #region class AudioManager
export class AudioManager {
    // #region Properties
    sounds = {};
    isMuted = false;
    musicKeys = new Set();
    musicVolume = 1;
    effectsVolume = 1;
    // #endregion

    // #region Loading

    /**
     * @param {string} key - The identifier for the sound.
     * @param {string} path - The path to the audio file.
     * @param {boolean} loop - Whether the sound should loop.
     * @param {boolean} isMusic - True if this sound belongs to the music channel.
     */
    loadSound(key, path, loop = false, isMusic = false) {
        const audio = new Audio(path);
        audio.loop = loop;
        audio.volume = isMusic ? this.musicVolume : this.effectsVolume;
        this.sounds[key] = audio;
        if (isMusic) this.musicKeys.add(key);
    }

    // #endregion

    // #region Playback
    /**
     * @param {string} key - The identifier for the sound.
     */
    play(key) {
        if (!this.isMuted && this.sounds[key]) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play().catch(() => {});
        }
    }

    /**
     * @param {string} key - The identifier for the sound.
     */
    stop(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }
    // #endregion

    /**
     * Stops all currently loaded sounds, except any keys listed to exclude.
     * @param {string[]} exclude - Sound keys that should keep playing.
     */
    stopAll(exclude = []) {
        Object.keys(this.sounds).forEach((key) => {
            if (!exclude.includes(key)) this.stop(key);
        });
    }

    // #region Mute Logic
    /** Toggles mute for all sounds. */
    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
        localStorage.setItem("muted", this.isMuted);
    }

    /** Loads the mute state from local storage. */
    loadMuteState() {
        this.isMuted = localStorage.getItem("muted") === "true";
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }
    // #endregion

    // #region Volume Control
    /**
     * Sets the volume for all music-channel sounds and persists it.
     * @param {number} value - Volume between 0 and 1.
     */
    setMusicVolume(value) {
        this.musicVolume = value;
        this.musicKeys.forEach((key) => {
            this.sounds[key].volume = value;
        });
        localStorage.setItem("musicVolume", value);
    }

    /**
     * Sets the volume for all effects-channel sounds and persists it.
     * @param {number} value - Volume between 0 and 1.
     */
    setEffectsVolume(value) {
        this.effectsVolume = value;
        Object.keys(this.sounds).forEach((key) => {
            if (!this.musicKeys.has(key)) this.sounds[key].volume = value;
        });
        localStorage.setItem("effectsVolume", value);
    }

    /** Loads stored volume levels from local storage, if present. */
    loadVolumeState() {
        const storedMusic = localStorage.getItem("musicVolume");
        const storedEffects = localStorage.getItem("effectsVolume");
        if (storedMusic !== null) this.musicVolume = parseFloat(storedMusic);
        if (storedEffects !== null)
            this.effectsVolume = parseFloat(storedEffects);
    }
    // #endregion
}
// #endregion class AudioManager
