const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const segments = [
    "100€", "200€", "Nothing", "500€", "SPIN AGAIN", "50€", "JACKPOT", "150€"
];

const colors = [
    "#B5B5B5", "#D1D1D1", "#B5B5B5", "#D1D1D1",
    "#B5B5B5", "#D1D1D1", "#B5B5B5", "#D1D1D1"
];

let startAngle = 0;
let arc = Math.PI * 2 / segments.length;
let spinTimeout = null;
let isSpinning = false;

function drawWheel() {
    // Clear the canvas
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    
    for (let i = 0; i < segments.length; i++) {
        let angle = startAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.lineTo(250, 250);
        ctx.fill();

        // Text
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.font = "20px Poppins";
        ctx.fillText(segments[i], 230, 10);
        ctx.restore();
    }
}

let spinVelocity = 0;
let deceleration = 0.995;

function spin() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinVelocity = Math.random() * 0.2 + 0.25; // strong spin
    rotate();
}

function rotate() {
    startAngle += spinVelocity;
    spinVelocity *= deceleration;

    drawWheel();

    if (spinVelocity > 0.002) {
        requestAnimationFrame(rotate);
    } else {
        stopSpin();
    }
}

function stopSpin() {
    const degrees = (startAngle * 180 / Math.PI) % 360;
    const index = Math.floor((360 - degrees) / (360 / segments.length)) % segments.length;
    const result = segments[index];
    
    // Show result in modal
    document.getElementById("resultText").innerHTML = result;
    var modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();
    
    // Trigger confetti if JACKPOT
    if (result === "JACKPOT") {
        triggerConfetti();
    }
    
    isSpinning = false;
}

function triggerConfetti() {
    // Multiple confetti bursts for celebration
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
    });
    
    // Second burst after delay
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
        });
    }, 250);
    
    // Third burst after delay
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
        });
    }, 400);
    
    // Continue some random confetti for longer celebration
    const duration = 3000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: Math.random() },
            colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Initialize the wheel
drawWheel();

document.getElementById("spinBtn").addEventListener("click", spin);

