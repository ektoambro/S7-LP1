// wheel.js - Version avec bouton désactivé pendant le spin
const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

const segments = [
    "100€", "200€", "Nothing", "500€", "SPIN AGAIN", "50€", "JACKPOT", "150€"
];

const segmentAmounts = {
    "100€": 100,
    "200€": 200,
    "Nothing": 0,
    "500€": 500,
    "SPIN AGAIN": 0,
    "50€": 50,
    "JACKPOT": 1000,
    "150€": 150
};

const colors = [
    "#B5B5B5", "#D1D1D1", "#B5B5B5", "#D1D1D1",
    "#B5B5B5", "#D1D1D1", "#B5B5B5", "#D1D1D1"
];

let startAngle = 0;
let arc = Math.PI * 2 / segments.length;
let isSpinning = false;
let spinAnimationFrame = null;
const spinCost = 10;

function drawWheel() {
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    
    for (let i = 0; i < segments.length; i++) {
        let angle = startAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.font = "bold 20px Poppins";
        ctx.fillText(segments[i], 230, 10);
        ctx.restore();
    }
}

let spinVelocity = 0;
const deceleration = 0.995;
const minVelocity = 0.002;

// Fonction pour désactiver/activer le bouton
function setSpinButtonState(disabled) {
    if (spinBtn) {
        spinBtn.disabled = disabled;
        if (disabled) {
            spinBtn.style.opacity = '0.6';
            spinBtn.style.cursor = 'not-allowed';
            spinBtn.textContent = '🎡 SPINNING...';
        } else {
            spinBtn.style.opacity = '1';
            spinBtn.style.cursor = 'pointer';
            spinBtn.textContent = 'SPIN (10€)';
        }
    }
}

async function spin() {
    // Vérifications multiples pour éviter les doubles clics
    if (isSpinning) {
        console.log('Spin already in progress, ignoring click');
        return;
    }
    
    // Désactiver immédiatement le bouton
    setSpinButtonState(true);
    isSpinning = true;
    
    try {
        // Vérifier le solde avant de jouer
        const balance = await getCurrentBalance();
        if (balance < spinCost) {
            alert(`Solde insuffisant ! Vous avez ${balance.toFixed(2)}€. Il vous faut 10€ pour jouer.`);
            setSpinButtonState(false);
            isSpinning = false;
            return;
        }
        
        // Déduire le coût du jeu
        await updateServerBalance(-spinCost, 'wheelspin', 'loss');
        
        // Démarrer l'animation
        spinVelocity = Math.random() * 0.2 + 0.25;
        
        // Annuler toute animation précédente
        if (spinAnimationFrame) {
            cancelAnimationFrame(spinAnimationFrame);
        }
        
        rotate();
    } catch (error) {
        console.error('Erreur lors du spin:', error);
        setSpinButtonState(false);
        isSpinning = false;
    }
}

function rotate() {
    startAngle += spinVelocity;
    spinVelocity *= deceleration;
    drawWheel();

    if (spinVelocity > minVelocity) {
        spinAnimationFrame = requestAnimationFrame(rotate);
    } else {
        spinAnimationFrame = null;
        stopSpin();
    }
}

async function stopSpin() {
    const degrees = (startAngle * 180 / Math.PI) % 360;
    const index = Math.floor((360 - degrees) / (360 / segments.length)) % segments.length;
    const result = segments[index];
    const winAmount = segmentAmounts[result];
    
    // Mettre à jour le solde avec les gains
    if (winAmount > 0) {
        await updateServerBalance(winAmount, 'wheelspin', 'win');
    }
    
    // Personnaliser le modal selon le résultat
    const resultEmoji = document.getElementById('resultEmoji');
    const modalTitle = document.getElementById('modalTitle');
    
    if (result === "JACKPOT") {
        resultEmoji.textContent = "🎰💰🎉";
        modalTitle.textContent = "JACKPOT !!!";
        triggerConfetti();
    } else if (winAmount > 0) {
        resultEmoji.textContent = "💸✨";
        modalTitle.textContent = "Vous avez gagné !";
    } else if (result === "SPIN AGAIN") {
        resultEmoji.textContent = "🔄";
        modalTitle.textContent = "Relancez !";
    } else {
        resultEmoji.textContent = "😢";
        modalTitle.textContent = "Pas de chance...";
    }
    
    // Afficher le résultat
    const resultText = winAmount > 0 ? `+${winAmount}€` : result;
    document.getElementById("resultText").innerHTML = resultText;
    
    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();
    
    // Rafraîchir le solde final
    await getCurrentBalance();
    
    // Réactiver le bouton UNIQUEMENT après la fin complète
    isSpinning = false;
    setSpinButtonState(false);
}

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffd700', '#ffd700', '#ffffff', '#ffd700']
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffd700', '#ffd700', '#ffffff']
        });
    }, 250);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffd700', '#ffd700', '#ffffff']
        });
    }, 400);
}

// Initialisation
drawWheel();
spinBtn.addEventListener("click", spin);

// S'assurer que le bouton est activé au chargement
setSpinButtonState(false);

// Récupérer le solde initial
getCurrentBalance();

// Protection supplémentaire : empêcher les clics rapides via debounce
let clickTimeout = null;
spinBtn.addEventListener('click', (e) => {
    if (isSpinning) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // Empêcher les doubles clics trop rapides
    if (clickTimeout) {
        clearTimeout(clickTimeout);
    }
    clickTimeout = setTimeout(() => {
        clickTimeout = null;
    }, 500);
}, true); // Capture phase pour intercepter avant le handler principal

// Admin mode (conservé)
let adminMode = false;
const adminPassword = "gamblingadmin2024";

function showAdminPanel() {
    alert("Admin panel - À implémenter");
}