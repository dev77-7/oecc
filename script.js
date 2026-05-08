const canvas = document.getElementById('reactor-canvas');
const ctx = canvas.getContext('2d');
const body = document.body;
const themeBtn = document.getElementById('theme-toggle');

let width, height;
let particles = [];

// Theme Toggle
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
});

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', init);
init();

class CoolantParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2.5;
        this.speedY = (Math.random() - 0.5) * 2.5;
        this.life = 1.0; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02; // Fast dissipation representing high pressure
    }

    draw() {
        ctx.fillStyle = `rgba(0, 242, 255, ${this.life})`; // Cherenkov Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 6; i++) {
        particles.push(new CoolantParticle(e.clientX, e.clientY));
    }
});

function animate() {
    ctx.fillStyle = body.classList.contains('dark-mode') 
        ? 'rgba(5, 8, 10, 0.15)' 
        : 'rgba(240, 244, 248, 0.15)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

animate();