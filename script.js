// Background Sakura Petal System
var bgCanvas = document.getElementById('bg-canvas');
var bgCtx = bgCanvas.getContext('2d');
var petals = [];
var mouse = { x: 0, y: 0, active: false };

function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    
    clearTimeout(mouse.timer);
    mouse.timer = setTimeout(function() {
        mouse.active = false;
    }, 100);
});

function SakuraPetal() {
    this.reset();
}

SakuraPetal.prototype.reset = function() {
    this.x = Math.random() * bgCanvas.width;
    this.y = -50;
    this.size = Math.random() * 15 + 10;
    this.speedY = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.sway = Math.random() * 2;
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = Math.random() > 0.5 ? '#f8bbd0' : '#f48fb1';
};

SakuraPetal.prototype.update = function() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.swayOffset) * this.sway * 0.3;
    this.swayOffset += this.swaySpeed;
    this.rotation += this.rotationSpeed;
    
    // Mouse interaction - gentle repulsion
    if(mouse.active) {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        
        if(dist < 150) {
            var force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 3;
            this.y += (dy / dist) * force * 3;
            this.rotation += force * 0.1;
        }
    }
    
    // Reset if out of bounds
    if(this.y > bgCanvas.height + 50 || this.x < -50 || this.x > bgCanvas.width + 50) {
        this.reset();
    }
};

SakuraPetal.prototype.draw = function() {
    bgCtx.save();
    bgCtx.translate(this.x, this.y);
    bgCtx.rotate(this.rotation);
    bgCtx.globalAlpha = this.opacity;
    
    // Draw petal shape
    bgCtx.fillStyle = this.color;
    bgCtx.beginPath();
    bgCtx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    bgCtx.fill();
    
    // Petal vein
    bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    bgCtx.lineWidth = 1;
    bgCtx.beginPath();
    bgCtx.moveTo(-this.size * 0.5, 0);
    bgCtx.lineTo(this.size * 0.5, 0);
    bgCtx.stroke();
    
    bgCtx.restore();
};

function initPetals() {
    petals = [];
    for(var i = 0; i < 60; i++) {
        var p = new SakuraPetal();
        p.y = Math.random() * bgCanvas.height;
        petals.push(p);
    }
}

function animatePetals() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Dark gradient background
    var gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
    gradient.addColorStop(0, '#0d0d0d');
    gradient.addColorStop(1, '#1a0a10');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    for(var i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
    }
    
    requestAnimationFrame(animatePetals);
}

// Title Glitch Animation
function initTitleGlitch() {
    var title = document.querySelector('.main-title');
    
    // Start with hard glitch
    title.classList.add('glitch-intro');
    
    setTimeout(function() {
        title.classList.remove('glitch-intro');
        title.classList.add('flicker-loop');
    }, 800);
}

// Steam Effect with Physics
var statusTile = document.getElementById('status-tile');
var steamParticles = [];
var isHovering = false;

function createSteamParticle() {
    var rect = statusTile.getBoundingClientRect();
    var side = Math.floor(Math.random() * 4);
    var x, y, vx, vy;
    
    switch(side) {
        case 0: // top
            x = rect.left + Math.random() * rect.width;
            y = rect.top - 20;
            vx = (Math.random() - 0.5) * 1;
            vy = -Math.random() * 2 - 1;
            break;
        case 1: // right
            x = rect.right + 20;
            y = rect.top + Math.random() * rect.height;
            vx = Math.random() * 2 + 1;
            vy = (Math.random() - 0.5) * 1 - 1;
            break;
        case 2: // bottom
            x = rect.left + Math.random() * rect.width;
            y = rect.bottom + 20;
            vx = (Math.random() - 0.5) * 1;
            vy = Math.random() * 2 + 1;
            break;
        case 3: // left
            x = rect.left - 20;
            y = rect.top + Math.random() * rect.height;
            vx = -Math.random() * 2 - 1;
            vy = (Math.random() - 0.5) * 1 - 1;
            break;
    }

    var particle = document.createElement('div');
    particle.className = 'steam-particle';
    
    var size = Math.random() * 40 + 30;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.opacity = '0';
    
    document.body.appendChild(particle);

    return {
        element: particle,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        life: 1,
        decay: Math.random() * 0.01 + 0.005,
        size: size
    };
}

function updateSteam() {
    if(!isHovering && steamParticles.length === 0) {
        requestAnimationFrame(updateSteam);
        return;
    }

    for(var i = steamParticles.length - 1; i >= 0; i--) {
        var p = steamParticles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.vy -= 0.02;
        p.life -= p.decay;
        p.size += 0.3;

        var opacity = p.life * 0.4;
        if(p.life > 0.8) opacity = (1 - p.life) * 2;

        p.element.style.left = p.x + 'px';
        p.element.style.top = p.y + 'px';
        p.element.style.width = p.size + 'px';
        p.element.style.height = p.size + 'px';
        p.element.style.opacity = opacity;

        if(p.life <= 0) {
            p.element.remove();
            steamParticles.splice(i, 1);
        }
    }

    if(isHovering && steamParticles.length < 30) {
        steamParticles.push(createSteamParticle());
    }

    requestAnimationFrame(updateSteam);
}

statusTile.addEventListener('mouseenter', function() {
    isHovering = true;
});

statusTile.addEventListener('mouseleave', function() {
    isHovering = false;
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initPetals();
    animatePetals();
    initTitleGlitch();
    updateSteam();
});
