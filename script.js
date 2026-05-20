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
let lastScrollY = window.scrollY;

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {

    const scrollingDown = window.scrollY > lastScrollY;

    entries.forEach(entry => {

        const el = entry.target;

        if (entry.isIntersecting) {

            el.classList.add('is-visible');

            // reset exit classes
            el.classList.remove('exit-left');
            el.classList.remove('exit-right');

        } else {

            el.classList.remove('is-visible');

            // =========================
            // SCROLLING DOWN
            // =========================

            if (scrollingDown) {

                if (el.classList.contains('slide-in-left')) {
                    el.classList.remove('exit-right');
                    el.classList.add('exit-left');
                }

                if (el.classList.contains('slide-in-right')) {
                    el.classList.remove('exit-left');
                    el.classList.add('exit-right');
                }

            }

            // =========================
            // SCROLLING UP
            // Reverse exit direction
            // =========================

            else {

                if (el.classList.contains('slide-in-left')) {
                    el.classList.remove('exit-left');
                    el.classList.add('exit-right');
                }

                if (el.classList.contains('slide-in-right')) {
                    el.classList.remove('exit-right');
                    el.classList.add('exit-left');
                }

            }
        }
    });

    lastScrollY = window.scrollY;

}, observerOptions);

document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
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