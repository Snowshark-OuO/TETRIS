// Tetris 遊戲基本邏輯
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;

const colors = [
    'cyan',  // I
    'blue',  // J
    'orange',  // L
    'yellow',  // O
    'green',  // S
    'purple',  // T
    'red',  // Z
];

// 填充格子的顏色
const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));

const tetrominoes = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },
    { shape: [[1, 1, 1], [1]], color: 'blue' },
    { shape: [[1, 1], [1, 1]], color: 'yellow' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'green' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' },
];

let currentTetromino = null;
let currentPos = { x: 0, y: 0 };
let score = 0;

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLUMNS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
}

function createTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    currentTetromino = tetrominoes[randomIndex];
    currentPos = { x: Math.floor(COLUMNS / 2) - Math.floor(currentTetromino.shape[0].length / 2), y: 0 };
}

function isValidMove(tetromino, pos) {
    for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
            if (tetromino.shape[y][x]) {
                const newX = pos.x + x;
                const newY = pos.y + y;
                if (newX < 0 || newX >= COLUMNS || newY >= ROWS || board[newY] && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function rotateTetromino(tetromino) {
    const rotated = tetromino.shape[0].map((_, index) => tetromino.shape.map(row => row[index])).reverse();
    return { shape: rotated, color: tetromino.color };
}

function dropTetromino() {
    if (isValidMove(currentTetromino, { x: currentPos.x, y: currentPos.y + 1 })) {
        currentPos.y++;
    } else {
        for (let y = 0; y < currentTetromino.shape.length; y++) {
            for (let x = 0; x < currentTetromino.shape[y].length; x++) {
                if (currentTetromino.shape[y][x]) {
                    board[currentPos.y + y][currentPos.x + x] = currentTetromino.color;
                }
            }
        }
        clearLines();
        createTetromino();
    }
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== null)) {
            board.splice(y, 1);
            board.unshift(Array(COLUMNS).fill(null));
            score += 100;
            document.getElementById('score').textContent = score;
        }
    }
}

function drawTetromino() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x]) {
                drawBlock(currentPos.x + x, currentPos.y + y, currentTetromino.color);
            }
        }
    }
}

function moveTetromino(direction) {
    const newPos = { x: currentPos.x + direction.x, y: currentPos.y + direction.y };
    if (isValidMove(currentTetromino, newPos)) {
        currentPos = newPos;
    }
}

function gameLoop() {
    dropTetromino();
    drawBoard();
    drawTetromino();
}

function startGame() {
    createTetromino();
    setInterval(gameLoop, 500);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveTetromino({ x: -1, y: 0 });
    } else if (e.key === 'ArrowRight') {
        moveTetromino({ x: 1, y: 0 });
    } else if (e.key === 'ArrowDown') {
        moveTetromino({ x: 0, y: 1 });
    } else if (e.key === 'ArrowUp') {
        const rotated = rotateTetromino(currentTetromino);
        if (isValidMove(rotated, currentPos)) {
            currentTetromino = rotated;
        }
    }
});

startGame();