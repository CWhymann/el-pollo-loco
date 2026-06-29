export class AudioManager {
    sounds = {};
    isMuted = false;

    /**
     * Loads a sound file and stores it under the given key.
     * @param {string} key - The identifier for the sound.
     * @param {string} path - The path to the audio file.
     * @param {boolean} loop - Whether the sound should loop.
     */
    loadSound(key, path, loop = false) {
        const audio = new Audio(path);
        audio.loop = loop;
        this.sounds[key] = audio;
    }

    /**
     * Plays a sound by key.
     * @param {string} key - The identifier for the sound.
     */
    play(key) {
        if (!this.isMuted && this.sounds[key]) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play();
        }
    }

    /**
     * Stops a sound by key.
     * @param {string} key - The identifier for the sound.
     */
    stop(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }

    /**
     * Toggles mute for all sounds.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
        localStorage.setItem("muted", this.isMuted);
    }

    /**
     * Loads the mute state from local storage.
     */
    loadMuteState() {
        this.isMuted = localStorage.getItem("muted") === "true";
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }
}
