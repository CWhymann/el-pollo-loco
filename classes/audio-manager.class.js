/**
 * Manages all game audio, including sound effects and mute state.
 */
// #region class AudioManager
export class AudioManager {
    // #region Properties
    sounds = {};
    isMuted = false;
    // #endregion

    // #region Loading
    /**
     * @param {string} key - The identifier for the sound.
     * @param {string} path - The path to the audio file.
     * @param {boolean} loop - Whether the sound should loop.
     */
    loadSound(key, path, loop = false) {
        const audio = new Audio(path);
        audio.loop = loop;
        this.sounds[key] = audio;
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
}
// #endregion class AudioManager
