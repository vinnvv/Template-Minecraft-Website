// ====== THEME TOGGLE ======
(function () {
    const html    = document.documentElement;
    const btn     = document.getElementById('themeToggle');
    const label   = document.getElementById('themeLabel');
    const saved   = localStorage.getItem('zeraphine-theme') || 'dark';

    html.setAttribute('data-theme', saved);
    if (label) label.textContent = saved === 'dark' ? 'Light' : 'Dark';

    if (btn) {
        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next    = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('zeraphine-theme', next);
            if (label) label.textContent = next === 'dark' ? 'Light' : 'Dark';

            // Pop animasi
            btn.style.transform = 'scale(0.85) rotate(-15deg)';
            setTimeout(() => {
                btn.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        });
    }
})();

// ====== PARTICLE CANVAS (FULL PAGE) ======
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        return {
            x:      randomBetween(0, W),
            y:      randomBetween(0, H),
            r:      randomBetween(0.8, 2.5),
            dx:     randomBetween(-0.4, 0.4),
            dy:     randomBetween(-0.4, 0.4),
            alpha:  randomBetween(0.3, 0.8),
            dAlpha: randomBetween(0.002, 0.004),
            fading: false,
        };
    }

    function initParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            const p = createParticle();
            p.y = randomBetween(0, H);
            particles.push(p);
        }
    }

    function getParticleColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? 'rgba(168,85,247,' : 'rgba(168,85,247,';
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            // Move
            p.x += p.dx;
            p.y += p.dy;

            // Fade in / out
            if (!p.fading) {
                p.alpha += p.dAlpha;
                if (p.alpha >= 0.8) p.fading = true;
            } else {
                p.alpha -= p.dAlpha;
            }

            // Reset when out of bounds or fully faded
            if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.alpha <= 0) {
                particles[i] = createParticle();
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor() + p.alpha.toFixed(2) + ')';
            ctx.fill();
        });

        animId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        const count = Math.min(Math.floor((W * H) / 8000), 200);
        initParticles(count);
        cancelAnimationFrame(animId);
        draw();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        start();
    }, { passive: true });

    start();
})();

// ====== CLOSE MOBILE MENU ON OUTSIDE CLICK ======
document.addEventListener('click', function (e) {
    const nav      = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && nav && !nav.contains(e.target)) {
        navLinks.classList.remove('open');
    }
}, { passive: true });

// ====== CARD ENTRANCE ANIMATION (Intersection Observer) ======
(function () {
    const cards = document.querySelectorAll(
        '.stat-card, .f-card, .rank-card, .staff-card, .contact-form'
    );

    if (!cards.length || !window.IntersectionObserver) return;

    // Set initial state
    cards.forEach(card => {
        card.style.opacity  = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.2,0.64,1)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Stagger based on index among siblings
                const siblings = [...el.parentElement.children];
                const idx = siblings.indexOf(el);
                setTimeout(() => {
                    el.style.opacity   = '1';
                    el.style.transform = 'translateY(0)';
                }, idx * 80);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => observer.observe(card));
})();