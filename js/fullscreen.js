/**
 * Toggles fullscreen mode for the game container.
 */
export function initFullscreen() {
    const fullscreenButton = document.getElementById("fullscreen-button");
    const gameContainer = document.getElementById("game-container");

    fullscreenButton.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen();
            fullscreenButton.textContent = "✕";
        } else {
            document.exitFullscreen();
            fullscreenButton.textContent = "⛶";
        }
    });

    document.addEventListener("fullscreenchange", () => {
        fullscreenButton.textContent = document.fullscreenElement ? "✕" : "⛶";
    });
}
