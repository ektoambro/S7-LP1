// slots.js - Machine à sous

const SYMBOLS = ['🍒', '🍋', '🍊', '💎', '7️⃣'];
const MULTIPLIERS = { '🍒': 5, '🍋': 10, '🍊': 15, '💎': 25, '7️⃣': 100 };
const PROBABILITIES = [0.35, 0.30, 0.20, 0.12, 0.03];

let currentBet = 10;
let isSpinning = false;

const spinBtn = document.getElementById('spinButton');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const resultDiv = document.getElementById('result');
const betDisplay = document.getElementById('betDisplay');

// Sélection de la mise
document.querySelectorAll('.bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning) return;
        document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBet = parseInt(btn.dataset.bet);
        betDisplay.textContent = currentBet + '€';
    });
});

// Fonction pour obtenir un symbole aléatoire selon probabilités
function getRandomSymbol() {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < PROBABILITIES.length; i++) {
        sum += PROBABILITIES[i];
        if (rand < sum) return SYMBOLS[i];
    }
    return SYMBOLS[0];
}

// Mise à jour balance (appelée depuis navbar)
function updateBalanceDisplay(newBalance) {
    const el = document.getElementById('navbarBalance');
    if (el) {
        el.classList.add('updating');
        el.textContent = parseFloat(newBalance).toFixed(2) + '€';
        setTimeout(() => el.classList.remove('updating'), 600);
    }
}

async function getCurrentBalance() {
    try {
        const res = await fetch('/api/get_balance');
        const data = await res.json();
        return data.status === 'success' ? data.balance : 0;
    } catch { return 0; }
}

async function updateServerBalance(amount, game, type) {
    try {
        const res = await fetch('/api/update_balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, game, type })
        });
        const data = await res.json();
        if (data.status === 'success') updateBalanceDisplay(data.new_balance);
        return data.new_balance;
    } catch { return null; }
}

// Animation de spin
function spinReels(finalSymbols) {
    return new Promise(resolve => {
        const reels = [reel1, reel2, reel3];
        let spins = 0;
        const maxSpins = 15;
        
        reels.forEach(r => r.classList.add('spinning'));
        
        const interval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                reels[i].textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
            spins++;
            
            if (spins >= maxSpins) {
                clearInterval(interval);
                reels.forEach(r => r.classList.remove('spinning'));
                reel1.textContent = finalSymbols[0];
                reel2.textContent = finalSymbols[1];
                reel3.textContent = finalSymbols[2];
                resolve();
            }
        }, 80);
    });
}

// Vérifier les gains
function calculateWin(s1, s2, s3) {
    if (s1 === s2 && s2 === s3) return currentBet * MULTIPLIERS[s1];
    if (s1 === '7️⃣' && s2 === '7️⃣' || s2 === '7️⃣' && s3 === '7️⃣') return currentBet * 2;
    return 0;
}

// Confetti pour gros gains
function triggerConfetti() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 150);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 300);
}

// Spin principal
async function spin() {
    if (isSpinning) return;
    
    const balance = await getCurrentBalance();
    if (balance < currentBet) {
        alert(`Insufficient balance! You have ${balance.toFixed(2)}€.`);
        return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = '🎲 SPINNING...';
    resultDiv.innerHTML = '';
    resultDiv.className = 'result';
    
    // Déduire mise
    await updateServerBalance(-currentBet, 'slots', 'loss');
    
    // Générer résultat
    const finalSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Animation
    await spinReels(finalSymbols);
    
    // Calculer gains
    const winAmount = calculateWin(finalSymbols[0], finalSymbols[1], finalSymbols[2]);
    
    if (winAmount > 0) {
        await updateServerBalance(winAmount, 'slots', 'win');
        resultDiv.innerHTML = `+${winAmount}€ !`;
        resultDiv.className = 'result win';
        if (winAmount >= currentBet * 25) triggerConfetti();
    } else {
        resultDiv.innerHTML = 'Lost...';
        resultDiv.className = 'result lose';
    }
    
    await getCurrentBalance();
    
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'SPIN';
}

// Init
spinBtn.addEventListener('click', spin);
getCurrentBalance();