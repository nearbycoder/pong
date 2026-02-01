const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySubtitle = document.getElementById('overlay-subtitle');
const playerScoreEl = document.getElementById('player-score');
const cpuScoreEl = document.getElementById('cpu-score');

const WINNING_SCORE = 11;
const INITIAL_BALL_SPEED = 8;
const BALL_SPEED_INCREASE = 1.05;
const PADDLE_SPEED = 10;
const CPU_REACTION_SPEED = 0.08;
const CPU_ERROR_MARGIN = 25;

let gameState = 'menu';
let animationId;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'hit':
            oscillator.frequency.value = 440;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'wall':
            oscillator.frequency.value = 220;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'score':
            oscillator.frequency.value = 880;
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}

function resizeCanvas() {
    const maxWidth = 800;
    const maxHeight = 600;
    const ratio = maxWidth / maxHeight;
    
    let width = Math.min(window.innerWidth - 40, maxWidth);
    let height = width / ratio;
    
    if (height > window.innerHeight - 200) {
        height = window.innerHeight - 200;
        width = height * ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    paddleHeight = height * 0.15;
    paddleWidth = width * 0.015;
    ballRadius = Math.max(8, width * 0.01);
    
    player.y = height / 2 - paddleHeight / 2;
    cpu.y = height / 2 - paddleHeight / 2;
}

let paddleHeight, paddleWidth, ballRadius;

const player = {
    x: 10,
    y: 0,
    width: 10,
    height: 80,
    score: 0
};

const cpu = {
    x: 0,
    y: 0,
    width: 10,
    height: 80,
    targetY: 0,
    score: 0
};

const ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: INITIAL_BALL_SPEED
};

const keys = {
    up: false,
    down: false
};

let mouseY = null;
let touchY = null;

function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    ball.vx = direction * ball.speed * Math.cos(angle);
    ball.vy = ball.speed * Math.sin(angle);
}

function updatePlayer() {
    if (mouseY !== null) {
        player.y = mouseY - paddleHeight / 2;
        mouseY = null;
    } else if (touchY !== null) {
        player.y = touchY - paddleHeight / 2;
        touchY = null;
    } else {
        if (keys.up) player.y -= PADDLE_SPEED;
        if (keys.down) player.y += PADDLE_SPEED;
    }
    
    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y));
}

function updateCPU() {
    let targetBallY = ball.y;
    
    if (ball.vx > 0) {
        const timeToReachCPU = (cpu.x - ball.x) / ball.vx;
        targetBallY = ball.y + ball.vy * timeToReachCPU;
        targetBallY += (Math.random() - 0.5) * CPU_ERROR_MARGIN * 2;
    }
    
    cpu.targetY += (targetBallY - cpu.targetY) * CPU_REACTION_SPEED;
    
    const paddleCenter = cpu.y + paddleHeight / 2;
    const diff = cpu.targetY - paddleCenter;
    
    if (Math.abs(diff) > PADDLE_SPEED) {
        cpu.y += Math.sign(diff) * PADDLE_SPEED;
    } else {
        cpu.y += diff;
    }
    
    cpu.y = Math.max(0, Math.min(canvas.height - paddleHeight, cpu.y));
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    if (ball.y - ballRadius <= 0 || ball.y + ballRadius >= canvas.height) {
        ball.vy = -ball.vy;
        ball.y = ball.y - ballRadius <= 0 ? ballRadius : canvas.height - ballRadius;
        playSound('wall');
    }
    
    if (ball.x - ballRadius <= player.x + player.width) {
        if (ball.y >= player.y && ball.y <= player.y + paddleHeight) {
            const hitPos = (ball.y - player.y) / paddleHeight - 0.5;
            const angle = hitPos * Math.PI / 3;
            
            ball.speed *= BALL_SPEED_INCREASE;
            ball.vx = Math.abs(ball.vx);
            ball.vx = ball.speed * Math.cos(angle);
            ball.vy = ball.speed * Math.sin(angle);
            ball.x = player.x + player.width + ballRadius;
            
            playSound('hit');
        }
    }
    
    if (ball.x + ballRadius >= cpu.x) {
        if (ball.y >= cpu.y && ball.y <= cpu.y + paddleHeight) {
            const hitPos = (ball.y - cpu.y) / paddleHeight - 0.5;
            const angle = hitPos * Math.PI / 3;
            
            ball.speed *= BALL_SPEED_INCREASE;
            ball.vx = -Math.abs(ball.vx);
            ball.vx = -ball.speed * Math.cos(angle);
            ball.vy = ball.speed * Math.sin(angle);
            ball.x = cpu.x - ballRadius;
            
            playSound('hit');
        }
    }
    
    if (ball.x < 0) {
        cpu.score++;
        updateScore();
        playSound('score');
        
        if (cpu.score >= WINNING_SCORE) {
            gameState = 'gameover';
            overlayTitle.textContent = 'CPU WINS';
            overlaySubtitle.textContent = 'Click or tap to restart';
            overlay.style.display = 'block';
        } else {
            resetBall(-1);
        }
    }
    
    if (ball.x > canvas.width) {
        player.score++;
        updateScore();
        playSound('score');
        
        if (player.score >= WINNING_SCORE) {
            gameState = 'gameover';
            overlayTitle.textContent = 'YOU WIN!';
            overlaySubtitle.textContent = 'Click or tap to restart';
            overlay.style.display = 'block';
        } else {
            resetBall(1);
        }
    }
}

function updateScore() {
    playerScoreEl.textContent = player.score;
    cpuScoreEl.textContent = cpu.score;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
    ctx.fillRect(cpu.x, cpu.y, paddleWidth, paddleHeight);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    if (gameState === 'playing') {
        updatePlayer();
        updateCPU();
        updateBall();
    }
    
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    player.score = 0;
    cpu.score = 0;
    updateScore();
    
    player.y = canvas.height / 2 - paddleHeight / 2;
    cpu.y = canvas.height / 2 - paddleHeight / 2;
    cpu.targetY = canvas.height / 2;
    
    resetBall(Math.random() > 0.5 ? 1 : -1);
    
    gameState = 'playing';
    overlay.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
    if (gameState === 'menu' || gameState === 'gameover') {
        startGame();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'menu' || gameState === 'gameover') {
        startGame();
    } else {
        const rect = canvas.getBoundingClientRect();
        touchY = e.touches[0].clientY - rect.top;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        touchY = e.touches[0].clientY - rect.top;
    }
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
cpu.x = canvas.width - 10 - paddleWidth;
gameLoop();
