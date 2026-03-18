const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let hyperFactor = 0; 
let scrollDirection = 1; // 1 pour descendre, -1 pour remonter

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 250; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.2,
            speed: Math.random() * 0.4 + 0.1,
            opacity: Math.random()
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        
        let stretch = hyperFactor * 55 * scrollDirection; 
        let speedBoost = hyperFactor * 30 * scrollDirection;

        ctx.beginPath();
        if (Math.abs(hyperFactor) > 0.05) {
            ctx.lineWidth = star.size;
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x, star.y + stretch);
            ctx.stroke();
        } else {
            ctx.fillStyle = "white";
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }

        star.y -= (star.speed + speedBoost);

        if (star.y < -60) star.y = canvas.height + 60;
        if (star.y > canvas.height + 60) star.y = -60;
    });
    requestAnimationFrame(drawStars);
}

initCanvas();
drawStars();
window.addEventListener('resize', initCanvas);

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            const startPosition = window.pageYOffset;
            
            if (Math.abs(targetPosition - startPosition) < 10) return;

            scrollDirection = targetPosition > startPosition ? 1 : -1;

            const distance = targetPosition - startPosition;
            const duration = 1500; 
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = timeElapsed / duration;

                hyperFactor = Math.sin(progress * Math.PI); 

                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    hyperFactor = 0;
                    scrollDirection = 1;
                }
            }

            function easeInOutCubic(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }

            requestAnimationFrame(animation);
        }
    });
});