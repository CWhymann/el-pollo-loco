/**
 * Toggles fullscreen mode for the canvas element.
 */
export function initFullscreen() {
    const fullscreenButton = document.getElementById("fullscreen-button");
    const canvas = document.getElementById("game-container");
    fullscreenButton.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen();
            fullscreenButton.textContent = "✕";
        } else {
            document.exitFullscreen();
            fullscreenButton.textContent = "⛶";
        }
    });
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            fullscreenButton.textContent = "⛶";
        } else {
            fullscreenButton.textContent = "✕";
        }
    });
}
