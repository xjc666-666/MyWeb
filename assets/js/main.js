/* ============ Particle Network System ============ */
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 90;
        this.mouse = { x: -500, y: -500 };
        this.mouseRadius = 180;
        this.connectDistance = 130;

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2.2 + 0.8,
                baseRadius: Math.random() * 2.2 + 0.8,
                hue: Math.random() > 0.5 ? 195 : 270
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = -500;
            this.mouse.y = -500;
        });

        // Touch support
        document.addEventListener('touchmove', (e) => {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', () => {
            this.mouse.x = -500;
            this.mouse.y = -500;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Mouse interaction — particles are attracted then repelled for a dynamic feel
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.mouseRadius && dist > 0) {
                const force = (this.mouseRadius - dist) / this.mouseRadius;
                const angle = Math.atan2(dy, dx);

                // Push away when very close, pull when farther
                if (dist < 60) {
                    p.vx += Math.cos(angle) * force * 0.35;
                    p.vy += Math.sin(angle) * force * 0.35;
                } else {
                    p.vx -= Math.cos(angle) * force * 0.08;
                    p.vy -= Math.sin(angle) * force * 0.08;
                }

                // Glow near mouse
                p.radius = p.baseRadius + force * 2.5;
            } else {
                p.radius += (p.baseRadius - p.radius) * 0.1;
            }

            // Damping
            p.vx *= 0.995;
            p.vy *= 0.995;

            // Add tiny random drift
            p.vx += (Math.random() - 0.5) * 0.02;
            p.vy += (Math.random() - 0.5) * 0.02;

            // Clamp velocity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 2) {
                p.vx = (p.vx / speed) * 2;
                p.vy = (p.vy / speed) * 2;
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            const margin = 20;
            if (p.x < -margin) p.x = this.canvas.width + margin;
            if (p.x > this.canvas.width + margin) p.x = -margin;
            if (p.y < -margin) p.y = this.canvas.height + margin;
            if (p.y > this.canvas.height + margin) p.y = -margin;

            // Draw particle with glow
            const alpha = 0.7 + Math.sin(Date.now() * 0.002 + i) * 0.2;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.hue === 195) {
                this.ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
                // Glow halo
                this.ctx.shadowColor = 'rgba(0, 212, 255, 0.6)';
            } else {
                this.ctx.fillStyle = `rgba(140, 60, 255, ${alpha})`;
                this.ctx.shadowColor = 'rgba(140, 60, 255, 0.6)';
            }
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < this.connectDistance) {
                    const lineAlpha = 0.18 * (1 - dist2 / this.connectDistance);
                    const avgHue = p.hue === p2.hue ? p.hue : 230;

                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);

                    if (avgHue === 195) {
                        this.ctx.strokeStyle = `rgba(0, 212, 255, ${lineAlpha})`;
                    } else if (avgHue === 270) {
                        this.ctx.strokeStyle = `rgba(140, 60, 255, ${lineAlpha})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(70, 140, 255, ${lineAlpha})`;
                    }
                    this.ctx.lineWidth = 0.6;
                    this.ctx.stroke();
                }
            }

            // Draw connections to mouse
            if (dist < this.mouseRadius) {
                const mouseAlpha = 0.3 * (1 - dist / this.mouseRadius);
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(0, 212, 255, ${mouseAlpha})`;
                this.ctx.lineWidth = 0.8;
                this.ctx.stroke();
            }
        }

        // Mouse glow aura
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouseRadius
            );
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.04)');
            gradient.addColorStop(0.5, 'rgba(123, 47, 255, 0.02)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                this.mouse.x - this.mouseRadius,
                this.mouse.y - this.mouseRadius,
                this.mouseRadius * 2,
                this.mouseRadius * 2
            );
        }

        requestAnimationFrame(() => this.animate());
    }
}


/* ============ DOM Ready ============ */
document.addEventListener('DOMContentLoaded', () => {

    // Start particle network
    new ParticleNetwork();

    /* ============ Mobile menu toggle ============ */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    }));

    /* ============ Theme switcher ============ */
    const themeButton = document.getElementById('theme-button');
    const htmlElement = document.documentElement;

    // Default to dark theme
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        if (themeButton) themeButton.classList.replace('fa-sun', 'fa-moon');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeButton) {
            themeButton.classList.remove('fa-moon');
            themeButton.classList.add('fa-sun');
        }
    }

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                themeButton.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('selected-theme', 'light');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                themeButton.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('selected-theme', 'dark');
            }
        });
    }

    /* ============ Project filtering ============ */
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ============ QQ Modal ============ */
    const qqBtn = document.getElementById('qq-btn');
    const qqModal = document.getElementById('qq-modal');
    const closeBtns = document.querySelectorAll('.modal__close');

    if (qqBtn) {
        qqBtn.addEventListener('click', () => {
            qqModal.classList.add('active-modal');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active-modal');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === qqModal) {
            qqModal.classList.remove('active-modal');
        }
    });

    /* ============ Section scroll reveal ============ */
    const revealSections = () => {
        const sections = document.querySelectorAll('.section');
        const windowHeight = window.innerHeight;
        const revealPoint = 120;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealSections);
    revealSections(); // Initial check
});
