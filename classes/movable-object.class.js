export class MovableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image and assigns it to this.img.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads an array of images into the image cache.
     * @param {string[]} paths - Array of image paths to preload.
     */
    loadImages(paths) {
        paths.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Plays the next frame of an animation.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }

    /**
     * Draws the object onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
//Was passiert hier?

//imageCache -> ein Objekt das alle Bilder speichert, damit sie nicht jedes Frame neu geladen werden
//currentImage -> Zeiger auf das aktuelle Bild in der Animation
//loadImages() -> lädt ein ganzes Array von Bildpfaden auf einmal in den Cache
//playAnimation() -> wechselt zum nächsten Bild – der % Operator sorgt dafür dass es nach dem letzten Bild wieder von vorne beginnt