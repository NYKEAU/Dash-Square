export class Projectile {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 10;
        this.size = 5;
    }

    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
    }

    draw(context, offsetX, offsetY) {
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
        context.fill();
    }
}