const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const restartBtn = document.getElementById("restartBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";

let circles = [];
let score = 0;
let time = 60;
let gameInterval;
let timeInterval;
let level = 1;

class Circle {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.speed = speed;
        this.dy = speed;
        this.flashDuration = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.dy;

        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius; 
        }

        this.checkCollisions();
        if (this.flashDuration > 0) {
            this.flashDuration--;
        } else {
            this.color = this.originalColor;
        }

        this.draw();
    }

    checkCollisions() {
        for (let other of circles) {
            if (other !== this) {
                let distX = this.x - other.x;
                let distY = this.y - other.y;
                let distance = Math.sqrt(distX ** 2 + distY ** 2);

                if (distance < this.radius + other.radius) {
                    this.color = "#0000FF";
                    other.color = "#0000FF";
                    this.flashDuration = 10;
                    other.flashDuration = 10;
                }
            }
        }
    }
}

// Generar círculos sin solapamiento
function generateCircles(n) {
    circles = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x, y;
        let attempts = 0;
        do {
            x = Math.random() * (canvas.width - radius * 2) + radius;
            y = Math.random() * -canvas.height; 
            attempts++;
        } while (isOverlapping(x, y, radius) && attempts < 100);

        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * (level + 2) + 1;
        circles.push(new Circle(x, y, radius, color, speed));
    }
}

// Verificar superposición
function isOverlapping(x, y, radius) {
    return circles.some(circle => {
        let distX = x - circle.x;
        let distY = y - circle.y;
        let distance = Math.sqrt(distX ** 2 + distY ** 2);
        return distance < radius + circle.radius;
    });
}

// Detección de clic para eliminar círculos
canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    circles = circles.filter(circle => {
        let distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
        if (distance < circle.radius) {
            score++;
            scoreText.innerText = `Eliminados: ${score}`;
            return false;
        }
        return true;
    });
});

// Animación del juego
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
    gameInterval = requestAnimationFrame(animate);
}

// Iniciar juego con nivel seleccionado
function startGame(selectedLevel) {
    level = selectedLevel;
    score = 0;
    time = 60;

    menu.style.display = "none";
    canvas.style.display = "block";
    hud.style.display = "flex";
    restartBtn.style.display = "none";

    scoreText.innerText = "Eliminados: 0";
    timeText.innerText = `Tiempo: 60s`;

    generateCircles(20 + level * 10);
    animate();
    startTimer();
}

// Iniciar temporizador
function startTimer() {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        time--;
        timeText.innerText = `Tiempo: ${time}s`;

        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

// Terminar juego
function endGame() {
    cancelAnimationFrame(gameInterval);
    clearInterval(timeInterval);
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡Tiempo terminado!", canvas.width / 2, canvas.height / 2);
    restartBtn.style.display = "block";
}

// Volver al menú
function showMenu() {
    cancelAnimationFrame(gameInterval);
    clearInterval(timeInterval);
    menu.style.display = "flex";
    canvas.style.display = "none";
    hud.style.display = "none";
    restartBtn.style.display = "none";
}
