// ===== QSTAR AI - Interactive JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCursorGlow();
    initParticles();
    initNavigation();
    initQTunnel();
    initRevealAnimations();
    initStats();
    initWaveCanvas();
    initGridAnimation();
    initOrbitalAnimation();
    initInstagramPreviews();
});

// ===== CURSOR GLOW =====
function initCursorGlow() {
    const cursor = document.querySelector('.cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ===== PARTICLES SYSTEM =====
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 80;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                'rgba(0, 245, 255,',
                'rgba(139, 92, 246,',
                'rgba(244, 114, 182,',
                'rgba(59, 130, 246,'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== NAVIGATION =====
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Q LETTER EFFECT =====
function initQTunnel() {
    const qLetter = document.getElementById('q-letter');
    const tunnelContainer = document.querySelector('.q-tunnel-container');
    const hero = document.querySelector('.hero');
    const about = document.querySelector('.about');
    
    if (!qLetter || !tunnelContainer || !hero) return;
    
    let totalHeight = hero.offsetHeight + (about ? about.offsetHeight * 0.3 : 0);
    
    window.addEventListener('resize', function() {
        totalHeight = hero.offsetHeight + (about ? about.offsetHeight * 0.3 : 0);
    });
    
    function updateQ(scrollY) {
        let progress = scrollY / totalHeight;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        const ease = 1 - Math.pow(1 - progress, 2);
        
        const scale = 1 + ease * 15;
        const opacity = Math.max(0, 0.25 - ease * 0.3);
        const blur = ease * 5;
        
        qLetter.style.transform = 'scale(' + scale + ')';
        qLetter.style.opacity = opacity;
        qLetter.style.filter = blur > 0.1 ? 'blur(' + blur + 'px)' : 'none';
        
        tunnelContainer.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
    }
    
    updateQ(0);
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateQ(window.scrollY || window.pageYOffset || 0);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    window.addEventListener('pageshow', function() {
        updateQ(window.scrollY || window.pageYOffset || 0);
    });
}

// ===== REVEAL ANIMATIONS =====
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-card, .reveal-slide, .reveal-stat');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

// ===== STATS COUNTER =====
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.dataset.target);
                animateCounter(target, targetValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-expo)
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        
        current = Math.floor(target * easeProgress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(update);
}

// ===== WAVE CANVAS (removed) =====
function initWaveCanvas() {
    // Removed - using CSS animation instead
}

// ===== GRID ANIMATION =====
function initGridAnimation() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    
    const cells = grid.querySelectorAll('.grid-cell');
    let currentActive = 4; // Center cell
    
    function animateGrid() {
        cells.forEach(cell => cell.classList.remove('active'));
        
        // Random cell activation
        currentActive = Math.floor(Math.random() * cells.length);
        cells[currentActive].classList.add('active');
    }
    
    // Start animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setInterval(animateGrid, 800);
                observer.unobserve(grid);
            }
        });
    });
    
    observer.observe(grid);
}

// ===== ORBITAL ANIMATION =====
function initOrbitalAnimation() {
    const nodes = document.querySelectorAll('.service-node');
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const ring = document.querySelector('.orbital-ring');
            ring.style.animationPlayState = 'paused';
            
            nodes.forEach(n => {
                n.style.animationPlayState = 'paused';
            });
        });
        
        node.addEventListener('mouseleave', () => {
            const ring = document.querySelector('.orbital-ring');
            ring.style.animationPlayState = 'running';
            
            nodes.forEach(n => {
                n.style.animationPlayState = 'running';
            });
        });
    });
}

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== PARALLAX EFFECT =====
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    document.querySelectorAll('.cta-shape').forEach((shape, index) => {
        const factor = (index + 1) * 0.5;
        shape.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });
});

// ===== TEXT SCRAMBLE EFFECT =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ===== TYPING EFFECT FOR HERO BADGE =====
function initTypingEffect() {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;
    
    const text = badge.textContent;
    badge.innerHTML = '<span class="pulse"></span><span class="typing-text"></span>';
    
    const typingEl = badge.querySelector('.typing-text');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingEl.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    
    setTimeout(type, 1000);
}

// ===== SMOOTH SCROLL PROGRESS =====
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progress);
    
    const progressBar = progress.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add scroll progress styles dynamically
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(139, 92, 246, 0.1);
        z-index: 10000;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00f5ff, #8b5cf6, #f472b6);
        width: 0;
        transition: width 0.1s ease;
    }
    
    .scramble {
        color: var(--cyan);
    }
`;
document.head.appendChild(style);

// Initialize scroll progress
initScrollProgress();

// ===== PRELOADER =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Press 'T' for top
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.closest('input, textarea')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ===== EASTER EGG - Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const colors = ['#00f5ff', '#8b5cf6', '#f472b6', '#3b82f6'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                animation: fall ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
    
    const fallAnimation = document.createElement('style');
    fallAnimation.textContent = `
        @keyframes fall {
            to {
                transform: translateY(110vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(fallAnimation);
}

// ===== INSTAGRAM PREVIEWS =====
function initInstagramPreviews() {
    // Instagram embeds are loaded via iframe in HTML
    // No additional JavaScript setup needed
    // The iframes will automatically load Instagram content
}
