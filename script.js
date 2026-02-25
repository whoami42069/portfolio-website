/* ═══════════════════════════════════════════
   SCRIPT.JS — Agentic Humanoid Portfolio
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralMesh();
    initBootSequence();
    initScrollReveal();
    initNavbar();
    initGlitchHover();
    initRadarChart();
    initContactForm();
});

/* ─── Neural Mesh Canvas ─── */
function initNeuralMesh() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, nodes, mouse;

    const NODE_COUNT = 50;
    const MAX_DIST = 180;

    mouse = { x: null, y: null, radius: 180 };

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 2 + 1.5,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.01 + Math.random() * 0.02,
            });
        }
    }

    // Signal pulses traveling along edges
    const signals = [];
    function spawnSignal() {
        if (signals.length > 8) return;
        const a = Math.floor(Math.random() * nodes.length);
        let b = a;
        let minDist = Infinity;
        // find nearest neighbor
        for (let i = 0; i < nodes.length; i++) {
            if (i === a) continue;
            const dx = nodes[i].x - nodes[a].x;
            const dy = nodes[i].y - nodes[a].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < MAX_DIST && d < minDist) { minDist = d; b = i; }
        }
        if (b !== a) {
            signals.push({ from: a, to: b, t: 0, speed: 0.015 + Math.random() * 0.02 });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Spawn occasional signal
        if (Math.random() < 0.02) spawnSignal();

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];

            n.x += n.vx;
            n.y += n.vy;
            n.pulse += n.pulseSpeed;

            if (n.x < 0) n.x = width;
            if (n.x > width) n.x = 0;
            if (n.y < 0) n.y = height;
            if (n.y > height) n.y = 0;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    n.x += (dx / dist) * force * 1.5;
                    n.y += (dy / dist) * force * 1.5;
                }
            }

            // Draw node (pulsing glow)
            const glow = 0.3 + 0.3 * Math.sin(n.pulse);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${glow})`;
            ctx.fill();

            // Outer glow
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${glow * 0.1})`;
            ctx.fill();

            // Connect edges
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.08;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw signal pulses
        for (let s = signals.length - 1; s >= 0; s--) {
            const sig = signals[s];
            sig.t += sig.speed;
            if (sig.t >= 1) { signals.splice(s, 1); continue; }

            const nA = nodes[sig.from];
            const nB = nodes[sig.to];
            const sx = nA.x + (nB.x - nA.x) * sig.t;
            const sy = nA.y + (nB.y - nA.y) * sig.t;
            const alpha = Math.sin(sig.t * Math.PI);

            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.9})`;
            ctx.fill();

            // Signal glow
            ctx.beginPath();
            ctx.arc(sx, sy, 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.15})`;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createNodes(); });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resize();
    createNodes();
    draw();
}

/* ─── Boot Sequence ─── */
function initBootSequence() {
    const bootLines = document.querySelectorAll('.boot-line');
    const heroMain = document.getElementById('hero-main');

    bootLines.forEach((line, i) => {
        const delay = parseInt(line.dataset.delay) || i * 600;
        setTimeout(() => line.classList.add('visible'), delay + 300);
    });

    // After boot, reveal main hero
    const totalBootTime = 1800 + 600;
    setTimeout(() => {
        heroMain.classList.add('visible');
        initTypedText();
    }, totalBootTime);
}

/* ─── Typed Text Effect ─── */
function initTypedText() {
    const el = document.getElementById('typed-tagline');
    if (!el) return;

    const phrases = [
        'Where curiosity meets behavioral insight.',
        'Research · Strategy · Applied AI.',
        'Connecting dots between data and meaning.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTime = 0;

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    function tick() {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            el.textContent = current.substring(0, charIndex + 1);
            el.appendChild(cursor);
            charIndex++;

            if (charIndex === current.length) {
                pauseTime = 2500;
                isDeleting = true;
            } else {
                pauseTime = 45 + Math.random() * 30;
            }
        } else {
            el.textContent = current.substring(0, charIndex - 1);
            el.appendChild(cursor);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                pauseTime = 400;
            } else {
                pauseTime = 25;
            }
        }

        setTimeout(tick, pauseTime);
    }

    setTimeout(tick, 300);
}

/* ─── Scroll Reveal ─── */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-section');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
}

/* ─── Navbar ─── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navAnchors = links.querySelectorAll('a');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        highlightActive();
    });

    function highlightActive() {
        let current = '';
        sections.forEach((sec) => {
            const top = sec.offsetTop - 200;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    navAnchors.forEach((a) => {
        a.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });
}

/* ─── Glitch Hover on Cards ─── */
function initGlitchHover() {
    const cards = document.querySelectorAll('.glitch-hover');
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('glitching');
            setTimeout(() => card.classList.remove('glitching'), 150);
        });
    });
}

/* ─── Radar Chart (SVG) ─── */
function initRadarChart() {
    const svg = document.getElementById('radar-chart');
    if (!svg) return;

    const categories = [
        { label: 'Applied AI', value: 0.85 },
        { label: 'Automation', value: 0.7 },
        { label: 'Analytics', value: 0.75 },
        { label: 'Tech Literacy', value: 0.3 },
        { label: 'Languages', value: 0.8 },
    ];

    const cx = 200, cy = 200, maxR = 140;
    const n = categories.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    // Draw guide rings
    [0.25, 0.5, 0.75, 1].forEach((frac) => {
        const r = maxR * frac;
        const points = [];
        for (let i = 0; i < n; i++) {
            const angle = startAngle + i * angleStep;
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        ring.setAttribute('points', points.join(' '));
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', 'rgba(0, 240, 255, 0.08)');
        ring.setAttribute('stroke-width', '1');
        svg.appendChild(ring);
    });

    // Draw axes + labels
    for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const ex = cx + maxR * Math.cos(angle);
        const ey = cy + maxR * Math.sin(angle);

        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.setAttribute('x1', cx);
        axis.setAttribute('y1', cy);
        axis.setAttribute('x2', ex);
        axis.setAttribute('y2', ey);
        axis.setAttribute('stroke', 'rgba(0, 240, 255, 0.06)');
        axis.setAttribute('stroke-width', '1');
        svg.appendChild(axis);

        const lx = cx + (maxR + 22) * Math.cos(angle);
        const ly = cy + (maxR + 22) * Math.sin(angle);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', lx);
        label.setAttribute('y', ly);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('fill', 'rgba(106, 115, 148, 0.8)');
        label.setAttribute('font-family', 'JetBrains Mono, monospace');
        label.setAttribute('font-size', '10');
        label.setAttribute('letter-spacing', '1');
        label.textContent = categories[i].label.toUpperCase();
        svg.appendChild(label);
    }

    // Data polygon
    const dataPoints = [];
    for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const r = maxR * categories[i].value;
        dataPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }

    const dataPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    dataPoly.setAttribute('points', dataPoints.join(' '));
    dataPoly.setAttribute('fill', 'rgba(0, 240, 255, 0.08)');
    dataPoly.setAttribute('stroke', 'rgba(0, 240, 255, 0.6)');
    dataPoly.setAttribute('stroke-width', '1.5');
    dataPoly.style.filter = 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.3))';

    // Animate: start from 0 and grow
    dataPoly.style.transformOrigin = `${cx}px ${cy}px`;
    dataPoly.style.transform = 'scale(0)';
    dataPoly.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    svg.appendChild(dataPoly);

    // Data dots
    const dots = [];
    for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const r = maxR * categories[i].value;
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', cx + r * Math.cos(angle));
        dot.setAttribute('cy', cy + r * Math.sin(angle));
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#00f0ff');
        dot.style.filter = 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.8))';
        dot.style.opacity = '0';
        dot.style.transition = 'opacity 0.5s 1s';
        svg.appendChild(dot);
        dots.push(dot);
    }

    // Observe and animate in
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    dataPoly.style.transform = 'scale(1)';
                    dots.forEach((d) => (d.style.opacity = '1'));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(svg);
}

/* ─── Contact Form Handler ─── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            feedback.textContent = '> ERROR: All fields required';
            feedback.className = 'form-feedback visible error';
            setTimeout(() => feedback.className = 'form-feedback', 3000);
            return;
        }

        // Show success feedback
        feedback.textContent = '> TRANSMISSION RECEIVED — Thank you, ' + name;
        feedback.className = 'form-feedback visible success';
        form.reset();

        setTimeout(() => feedback.className = 'form-feedback', 4000);
    });
}
