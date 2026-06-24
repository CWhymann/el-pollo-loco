import { canvas, ctx } from "./canvas.js";

ctx.fillStyle = "#a8d8ea";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#333";
ctx.font = "30px Arial";
ctx.fillText("El Pollo Loco – wird gebaut! 🐔", 150, 240);
