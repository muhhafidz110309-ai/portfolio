/* ============================================================
   MUHAMMAD HAFIDZ — PORTFOLIO SCRIPTS
   ============================================================ */
(function () {
    'use strict';

    /* ==========================================================
       1. PRELOADER
       ========================================================== */
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initRevealAnimations();
        }, 2200);
    });

    /* ==========================================================
       2. CUSTOM CURSOR
       ========================================================== */
    function initCursor() {
        if (window.innerWidth <= 992) return;

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        if (!cursorDot || !cursorRing) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = document.querySelectorAll(
            'a, button, [data-cursor], .project-card, .service-card-v2'
        );
        hoverTargets.forEach((el) => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }
    initCursor();

    /* ==========================================================
       3. PARTICLE BACKGROUND
       ========================================================== */
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => {
            resizeCanvas();
            buildParticles();
        });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '0, 240, 255' : '255, 0, 229';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        function buildParticles() {
            particles = [];
            const count = Math.min(80, Math.floor(window.innerWidth / 20));
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animate);
        }

        buildParticles();
        animate();
    }
    initParticles();

    /* ==========================================================
       4. NAVBAR
       ========================================================== */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (!navbar || !navToggle || !navMenu) return;

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x-lg');
            } else {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            });
        });

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach((section) => {
                const top = section.offsetTop - 150;
                if (window.scrollY >= top) current = section.getAttribute('id');
            });
            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) link.classList.add('active');
            });
        });
    }
    initNavbar();

    /* ==========================================================
       5. TYPEWRITER EFFECT
       ========================================================== */
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;

        const texts = ['Web Developer', 'UI/UX Designer', 'RPL Student', 'Problem Solver'];
        let twIndex = 0, charIndex = 0, isDeleting = false;

        function loop() {
            const current = texts[twIndex];
            if (isDeleting) {
                el.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === current.length) {
                setTimeout(() => { isDeleting = true; loop(); }, 1800);
                return;
            }
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                twIndex = (twIndex + 1) % texts.length;
                setTimeout(loop, 400);
                return;
            }
            setTimeout(loop, isDeleting ? 50 : 100);
        }
        loop();
    }
    initTypewriter();

    /* ==========================================================
       6. SCROLL REVEAL ANIMATIONS
       ========================================================== */
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
        );
        reveals.forEach((el) => observer.observe(el));
    }
    // Jalankan juga tanpa preloader (fallback)
    if (document.readyState === 'complete') initRevealAnimations();

    /* ==========================================================
       7. COUNTER ANIMATION
       ========================================================== */
    function initCounters() {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = target + '+';
                        }
                    }
                    requestAnimationFrame(update);
                    counterObserver.unobserve(el);
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
    }
    initCounters();

    /* ==========================================================
       8. PROGRESS BAR ANIMATION
       ========================================================== */
    function initProgressBars() {
        const progressObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => { bar.style.width = width + '%'; }, 200);
                    progressObserver.unobserve(bar);
                });
            },
            { threshold: 0.3 }
        );

        document.querySelectorAll('.progress-bar-custom').forEach((bar) =>
            progressObserver.observe(bar)
        );
    }
    initProgressBars();

    /* ==========================================================
       9. PORTFOLIO FILTER
       ========================================================== */
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        if (!filterBtns.length) return;

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');

                projectCards.forEach((card) => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hide');
                        card.style.animation = 'none';
                        void card.offsetHeight; // reflow
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    initPortfolioFilter();

    /* ==========================================================
       10. CONTACT FORM
       ========================================================== */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const alert = document.getElementById('formAlert');
        if (!form || !alert) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            alert.className = 'form-alert success show';
            alert.textContent = `Terima kasih ${name}! Pesan Anda telah terkirim. Saya akan menghubungi Anda di ${email} secepatnya.`;
            form.reset();
            setTimeout(() => alert.classList.remove('show'), 5000);
        });
    }
    initContactForm();

    /* ==========================================================
       11. SCROLL TO TOP
       ========================================================== */
    function initScrollTop() {
        const btn = document.getElementById('scrollTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('show', window.scrollY > 500);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    initScrollTop();

    /* ==========================================================
       12. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }
    initSmoothScroll();

    /* ==========================================================
       13. YEAR AUTO UPDATE
       ========================================================== */
    function initYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
    initYear();

    /* ==========================================================
       14. PARALLAX EFFECT ON HERO
       ========================================================== */
    function initParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual || window.innerWidth <= 992) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroVisual.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    initParallax();

    /* ==========================================================
       15. TILT EFFECT ON CARDS
       ========================================================== */
    function initTilt() {
        if (window.innerWidth <= 992) return;

        document.querySelectorAll('.project-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    initTilt();
})();