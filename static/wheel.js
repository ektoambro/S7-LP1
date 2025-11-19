const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const segments = [
    "100$", "200$", "LOSE", "500$", "SPIN AGAIN", "50$", "JACKPOT", "150$"
];

const colors = [
    "#ff4d4d", "#ff944d", "#ffff4d", "#4dff4d",
    "#4dffff", "#4d4dff", "#b84dff", "#ff4d94"
];

let startAngle = 0;
let arc = Math.PI * 2 / segments.length;
let spinTimeout = null;

function drawWheel() {
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
    document.getElementById("67").innerHTML="Result: " + segments[index]
    var modal = new bootstrap.Modal(document.getElementById('271'));
    modal.show();
}

drawWheel();

document.getElementById("spinBtn").addEventListener("click", spin);
