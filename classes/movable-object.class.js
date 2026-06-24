export class MovableObject {
    x;
    y;
    width;
    height;
    img;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
//x, y -> Position auf dem Canvas
//width, height -> Größe des Objekts
//loadImage() -> lädt ein Bild
//draw() -> zeichnet das Objekt auf den Canvas
