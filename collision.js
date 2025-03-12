const canvas = document.getElementById("canvas");
const restartBtn = document.getElementById("restartBtn");
let ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "black"; // Fondo negro

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = -this.speed;
        this.flashDuration = 0;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);
        this.posX += this.dx;
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        this.posY += this.dy;
        if (this.posY - this.radius < 0 || this.posY + this.radius > window_height) {
            this.dy = -this.dy;
        }

        this.checkCollisions(circles);

        if (this.flashDuration > 0) {
            this.flashDuration--;
        } else {
            this.color = this.originalColor;
        }
    }

    checkCollisions(circles) {
        for (let i = 0; i < circles.length; i++) {
            let other = circles[i];
            if (other !== this) {
                let distX = this.posX - other.posX;
                let distY = this.posY - other.posY;
                let distance = Math.sqrt(distX * distX + distY * distY);

                if (distance < this.radius + other.radius) {
                    this.color = "#0000FF";
                    other.color = "#0000FF";
                    this.flashDuration = 10;
                    other.flashDuration = 10;

                    let tempDx = this.dx;
                    let tempDy = this.dy;
                    this.dx = other.dx;
                    this.dy = other.dy;
                    other.dx = tempDx;
                    other.dy = tempDy;
                }
            }
        }
    }
}

// Arreglo para almacenar los círculos
let circles = [];

// Función para generar círculos
function generateCircles(n) {
    circles = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = window_height - radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para mostrar contador y mensaje de victoria
function drawCounter() {
    ctx.fillStyle = "white"; // Texto en blanco
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Restantes: ${circles.length}`, window_width / 2, 50);

    if (circles.length === 0) {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("¡Ganaste!", window_width / 2, window_height / 2);
        restartBtn.style.display = "block"; // Mostrar botón de reinicio
    }
}

// Animación del juego
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    drawCounter();
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

// Detectar clics para eliminar círculos
canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    circles = circles.filter(circle => {
        return Math.sqrt((mouseX - circle.posX) ** 2 + (mouseY - circle.posY) ** 2) > circle.radius;
    });
});

// Función para reiniciar el juego
function restartGame() {
    generateCircles(25);
    restartBtn.style.display = "none"; // Ocultar botón al reiniciar
}

// Iniciar juego
generateCircles(25);
animate();
