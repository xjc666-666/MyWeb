/* ============ Spotlight Effect ============ */
class SpotlightEffect {
    constructor() {
        this.hero = document.getElementById('hero');
        this.spotlight = document.getElementById('spotlight');
        if (!this.hero || !this.spotlight) return;

        this.trail = Array.from({ length: 6 }, () => ({ x: -300, y: -300 }));
        this.target = { x: -300, y: -300 };
        this.active = false;
        this.raf = null;

        this.generateMatrix();
        this.bindEvents();
    }

    generateMatrix() {
        const cols = 14;
        const rows = 8;
        const text = 'XJC666';

        let html = '';
        for (let r = 0; r < rows; r++) {
            html += '<div class="matrix-row">';
            for (let c = 0; c < cols; c++) {
                html += `<span class="matrix-cell">${text}</span>`;
            }
            html += '</div>';
        }

        const base = document.getElementById('hero-matrix-base');
        if (base) base.innerHTML = html;

        const spotMatrix = document.getElementById('spotlight-matrix');
        if (spotMatrix) spotMatrix.innerHTML = html;
    }

    bindEvents() {
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            this.target.x = e.clientX - rect.left;
            this.target.y = e.clientY - rect.top;
            if (!this.active) {
                this.active = true;
                this.loop();
            }
        });

        this.hero.addEventListener('mouseleave', () => {
            this.active = false;
        });

        this.hero.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.hero.getBoundingClientRect();
            this.target.x = e.touches[0].clientX - rect.left;
            this.target.y = e.touches[0].clientY - rect.top;
            if (!this.active) {
                this.active = true;
                this.loop();
            }
        }, { passive: false });

        this.hero.addEventListener('touchend', () => {
            this.active = false;
        });
    }

    loop() {
        if (!this.active) {
            this.spotlight.style.clipPath = 'circle(0px at -300px -300px)';
            this.raf = null;
            return;
        }

        const t = this.trail;

        t[0].x += (this.target.x - t[0].x) * 0.7;
        t[0].y += (this.target.y - t[0].y) * 0.7;

        for (let i = 1; i < t.length; i++) {
            const d = 0.7 - 0.04 * i;
            t[i].x += (t[i - 1].x - t[i].x) * d;
            t[i].y += (t[i - 1].y - t[i].y) * d;
        }

        const spot = t[2];
        const head = t[0];
        const tail = t[5];

        const dx = head.x - tail.x;
        const dy = head.y - tail.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const baseR = 170;

        if (speed > 15) {
            const rx = baseR + speed * 0.6;
            const ry = Math.max(70, baseR - speed * 0.35);
            this.spotlight.style.clipPath = `ellipse(${rx}px ${ry}px at ${spot.x}px ${spot.y}px)`;
        } else {
            this.spotlight.style.clipPath = `circle(${baseR}px at ${spot.x}px ${spot.y}px)`;
        }

        this.raf = requestAnimationFrame(() => this.loop());
    }
}


/* ============ Card Glow Follow ============ */
function initCardGlow() {
    document.querySelectorAll('.card, .insight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });
    });
}


/* ============ DOM Ready ============ */
document.addEventListener('DOMContentLoaded', () => {

    new SpotlightEffect();
    initCardGlow();

    /* ============ Mobile Menu ============ */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('show-menu'));
    }
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
    });

    /* ============ Theme ============ */
    const themeBtn = document.getElementById('theme-btn');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        html.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.classList.replace('fa-sun', 'fa-moon');
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const cur = html.getAttribute('data-theme');
            if (cur === 'dark') {
                html.setAttribute('data-theme', 'light');
                themeBtn.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                themeBtn.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    /* ============ Project Filters ============ */
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.card[data-category]').forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
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
    if (qqBtn) {
        qqBtn.addEventListener('click', () => qqModal.classList.add('active-modal'));
    }
    document.querySelectorAll('.modal__close').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active-modal'));
    });
    window.addEventListener('click', (e) => {
        if (e.target === qqModal) qqModal.classList.remove('active-modal');
    });

    /* ============ Section Reveal ============ */
    const reveal = () => {
        const wh = window.innerHeight;
        document.querySelectorAll('.section').forEach(sec => {
            if (sec.getBoundingClientRect().top < wh - 100) {
                sec.classList.add('revealed');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();
});
