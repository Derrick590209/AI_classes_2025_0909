const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const startButton = document.getElementById('startButton');

const tileSize = 20;
const boardSize = 20;
const speed = 120;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 10, y: 10 };
let score = 0;
let gameTimer = null;
let isPlaying = false;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    updateScore();
    placeFood();
    draw();
}

function updateScore() {
    scoreEl.textContent = score;
}

function placeFood() {
    do {
        food = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
    } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function drawGrid() {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;

    for (let i = 0; i <= boardSize; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#34d399' : '#10b981';
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameTimer);
    statusEl.textContent = '遊戲結束！再來一次吧。';
    startButton.textContent = '重新開始';
}

function tick() {
    direction = nextDirection;
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    const hitWall = head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
    const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);

    if (hitWall || hitSelf) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

function startGame() {
    resetGame();
    isPlaying = true;
    statusEl.textContent = '遊戲中；小心別撞牆或撞到自己。';
    startButton.textContent = '重新開始';
    clearInterval(gameTimer);
    gameTimer = setInterval(tick, speed);
}

startButton.addEventListener('click', () => {
    startGame();
});

document.addEventListener('keydown', (event) => {
    if (!isPlaying) return;

    const key = event.key.toLowerCase();
    const moveMap = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
    };

    const next = moveMap[key];
    if (!next) return;

    const isOpposite =
        next.x === -direction.x && next.y === -direction.y;

    if (!isOpposite) {
        nextDirection = next;
    }
});

resetGame();
statusEl.textContent = '點擊開始遊戲';
