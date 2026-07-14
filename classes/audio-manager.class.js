/**
 * Manages all game audio: loading, playback, mute state and volume channels.
 * Separates sounds into a music channel and an effects channel.
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
     * Creates an Audio element, assigns it to the sounds registry
     * and registers it in the music channel if flagged as music.
     * @param {string} key - Unique identifier for this sound.
     * @param {string} path - File path to the audio asset.
     * @param {boolean} loop - Whether the sound should loop continuously.
     * @param {boolean} isMusic - True to assign this sound to the music channel.
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
     * Plays a sound from the start, unless the game is muted or the key is unknown.
     * @param {string} key - The identifier of the sound to play.
     */
    play(key) {
        if (!this.isMuted && this.sounds[key]) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play().catch(() => {});
        }
    }

    /**
     * Pauses a sound and resets it to the beginning.
     * @param {string} key - The identifier of the sound to stop.
     */
    stop(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }

    /**
     * Stops all registered sounds, optionally keeping some playing.
     * @param {string[]} exclude - Keys of sounds that should keep playing.
     */
    stopAll(exclude = []) {
        Object.keys(this.sounds).forEach((key) => {
            if (!exclude.includes(key)) this.stop(key);
        });
    }
    // #endregion

    // #region Mute
    /** Toggles global mute on/off and persists the state in localStorage. */
    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
        localStorage.setItem("muted", this.isMuted);
    }

    /** Restores the mute state from localStorage and applies it to all sounds. */
    loadMuteState() {
        this.isMuted = localStorage.getItem("muted") === "true";
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }
    // #endregion

    // #region Volume Control
    /**
     * Sets the volume for all music-channel sounds and persists the value.
     * @param {number} value - Volume level between 0 (silent) and 1 (full).
     */
    setMusicVolume(value) {
        this.musicVolume = value;
        this.musicKeys.forEach((key) => {
            this.sounds[key].volume = value;
        });
        localStorage.setItem("musicVolume", value);
    }

    /**
     * Sets the volume for all effects-channel sounds and persists the value.
     * @param {number} value - Volume level between 0 (silent) and 1 (full).
     */
    setEffectsVolume(value) {
        this.effectsVolume = value;
        Object.keys(this.sounds).forEach((key) => {
            if (!this.musicKeys.has(key)) this.sounds[key].volume = value;
        });
        localStorage.setItem("effectsVolume", value);
    }

    /** Restores music and effects volume levels from localStorage if available. */
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
