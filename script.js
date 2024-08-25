const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const welcomeMenu = document.getElementById('welcome-menu');
const gameOverMenu = document.getElementById('game-over-menu');
const startGameButton = document.getElementById('start-game');
const replayGameButton = document.getElementById('replay-game');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
let score = 0;
let lives = 3;
let playerPosition = 130;
let moveInterval;
let fallingItems = [];
let isMovingLeft = false;
let isMovingRight = false;
let isPaused = false;
let tiniAudio = new Audio('tini.mp3'); // تعريف الصوت

function startGame() {
    welcomeMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    tiniAudio.play(); // تشغيل الصوت عند بدء اللعبة
    gameLoop();
}

// تحريك اللاعب بناءً على الأسهم أو الأزرار
function movePlayer() {
    if (isMovingLeft && playerPosition > 0) {
        playerPosition -= 5;
    }
    if (isMovingRight && playerPosition < 250) {
        playerPosition += 5;
    }
    player.style.left = `${playerPosition}px`;
}

// التعامل مع ضغطات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = false;
    } else if (e.key === 'ArrowRight') {
        isMovingRight = false;
    }
});

// التعامل مع أزرار التحكم
leftArrow.addEventListener('mousedown', () => {
    isMovingLeft = true;
});
leftArrow.addEventListener('mouseup', () => {
    isMovingLeft = false;
});
rightArrow.addEventListener('mousedown', () => {
    isMovingRight = true;
});
rightArrow.addEventListener('mouseup', () => {
    isMovingRight = false;
});

// اللعبة الرئيسية
function gameLoop() {
    setInterval(() => {
        if (!isPaused) {
            const items = ['karan', 'garo', 'lw'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            createFallingItem(randomItem, `${randomItem}.png`);
        }
    }, 1000);

    setInterval(movePlayer, 16);  // تحريك اللاعب باستمرار
}

function createFallingItem(id, src) {
    const item = document.createElement('img');
    item.classList.add('item');
    item.src = src;
    item.id = id;
    item.style.left = `${Math.floor(Math.random() * 350)}px`;
    item.style.top = '0px';
    gameContainer.appendChild(item);
    fallingItems.push(item);

    let fallInterval = setInterval(() => {
        if (!isPaused) {
            const itemTop = item.offsetTop + 60;
            item.style.top = `${itemTop}px`;

            if (itemTop >= player.offsetTop - item.clientHeight && itemTop <= player.offsetTop + player.clientHeight) {
                handleCollision(item);
            }

            if (itemTop > gameContainer.clientHeight) {
                clearInterval(fallInterval);
                gameContainer.removeChild(item);
                fallingItems = fallingItems.filter(i => i !== item);
            }
        }
    }, 3);
}

function handleCollision(item) {
    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const isCollision = !(
        playerRect.right < itemRect.left ||
        playerRect.left > itemRect.right ||
        playerRect.bottom < itemRect.top ||
        playerRect.top > itemRect.bottom
    );

    if (isCollision) {
        gameContainer.removeChild(item);
        fallingItems = fallingItems.filter(i => i !== item);

        if (item.id === 'karan' || item.id === 'garo') {
            score++;
            scoreDisplay.textContent = `X${score}`;
            new Audio('haha.mp3').play();
        } else if (item.id === 'lw') {
            lives--;
            new Audio('ohno.mp3').play();
            if (lives === 0) {
                new Audio('wi9.mp3').play();
                endGame();
            }
        }
    }
}

function endGame() {
    gameContainer.style.display = 'none';
    gameOverMenu.style.display = 'block';
    tiniAudio.pause(); // إيقاف الصوت عند نهاية اللعبة
    tiniAudio.currentTime = 0; // إعادة الصوت إلى البداية
}

startGameButton.addEventListener('click', startGame);
replayGameButton.addEventListener('click', () => {
    location.reload();
});
