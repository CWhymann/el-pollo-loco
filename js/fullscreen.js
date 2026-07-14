// #region Fullscreen
/**
 * Registers click and fullscreenchange listeners on the fullscreen button.
 * Toggles fullscreen mode for the game container and updates the button icon.
 */
export function initFullscreen() {
    const fullscreenButton = document.getElementById("fullscreen-button");
    const gameContainer = document.getElementById("game-container");
    fullscreenButton.addEventListener("click", () =>
        toggleFullscreen(fullscreenButton, gameContainer),
    );
    document.addEventListener("fullscreenchange", () => {
        fullscreenButton.textContent = document.fullscreenElement ? "✕" : "⛶";
    });
}

/**
 * Enters or exits fullscreen mode and updates the button icon accordingly.
 * @param {HTMLButtonElement} button - The fullscreen toggle button.
 * @param {HTMLElement} container - The element to display in fullscreen.
 */
function toggleFullscreen(button, container) {
    if (!document.fullscreenElement) {
        container.requestFullscreen();
        button.textContent = "✕";
    } else {
        document.exitFullscreen();
        button.textContent = "⛶";
    }
}
// #endregion
