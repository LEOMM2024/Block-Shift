const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 60;
const rows = 10;
const cols = 10;

const gridColor = '#ddd';
const playerColor = 'red';
const goalColor = 'cyan';
const obstacleColor = 'black';

let playerPos = { x: 0, y: 0 };
const goalPos = { x: getRandomInt(0, cols - 1), y: getRandomInt(0, rows - 1) };
const obstacles = generateObstacles(15);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateObstacles(count) {
    const obs = [];
    while (obs.length < count) {
        const pos = { x: getRandomInt(0, cols - 1), y: getRandomInt(0, rows - 1) };
        if ((pos.x !== playerPos.x || pos.y !== playerPos.y) &&
            (pos.x !== goalPos.x || pos.y !== goalPos.y) &&
            !obs.some(o => o.x === pos.x && o.y === pos.y)) {
            obs.push(pos);
        }
    }
    return obs;
}

function drawGrid() {
    ctx.strokeStyle = gridColor;
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

function drawPlayer() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerPos.x * cellSize, playerPos.y * cellSize, cellSize, cellSize);
}

function drawGoal() {
    ctx.fillStyle = goalColor;
    ctx.beginPath();
    ctx.arc(goalPos.x * cellSize + cellSize / 2, goalPos.y * cellSize + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles() {
    ctx.fillStyle = obstacleColor;
    obstacles.forEach(ob => {
        ctx.fillRect(ob.x * cellSize, ob.y * cellSize, cellSize, cellSize);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawGoal();
    drawObstacles();
    drawPlayer();
}

function movePlayer(direction) {
    let { x, y } = playerPos;
    if (direction === 'ArrowUp') {
        while (y > 0 && !isObstacle(x, y - 1)) y--;
    } else if (direction === 'ArrowDown') {
        while (y < rows - 1 && !isObstacle(x, y + 1)) y++;
    } else if (direction === 'ArrowLeft') {
        while (x > 0 && !isObstacle(x - 1, y)) x--;
    } else if (direction === 'ArrowRight') {
        while (x < cols - 1 && !isObstacle(x + 1, y)) x++;
    }
    playerPos = { x, y };
    checkWin();
    draw();
}

function isObstacle(x, y) {
    return obstacles.some(ob => ob.x === x && ob.y === y);
}

function checkWin() {
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
        alert('You win!');
        resetGame();
    }
}

function resetGame() {
    playerPos = { x: 0, y: 0 };
    goalPos.x = getRandomInt(0, cols - 1);
    goalPos.y = getRandomInt(0, rows - 1);
    obstacles.length = 0;
    obstacles.push(...generateObstacles(15));
    draw();
}

window.addEventListener('keydown', (e) => {
    movePlayer(e.key);
});

draw();
