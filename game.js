
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER = '🐙';
const ENEMY = '🦜';
const PROJECTILE = '🎻';

let playerX = canvas.width / 2;
const playerY = canvas.height - 30;
const enemies = [];
const projectiles = [];
let enemySpeed = 0.2;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawEnemies() {
    for (let enemy of enemies) {
        ctx.fillText(ENEMY, enemy.x, enemy.y);
    }
}

function drawPlayer() {
    ctx.fillText(PLAYER, playerX, playerY);
}

function drawProjectiles() {
    for (let projectile of projectiles) {
        ctx.fillText(PROJECTILE, projectile.x, projectile.y);
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updateGame() {
    clearCanvas();

    for (let enemy of enemies) {
        enemy.y += enemySpeed;

        if (enemy.y >= playerY) {
            alert('Game Over');
            location.reload();
            return;
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].y -= 5;

        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision({ x: projectiles[i].x, y: projectiles[i].y, width: 10, height: 10 }, 
                               { x: enemies[j].x, y: enemies[j].y, width: 10, height: 10 })) {
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
                break;
            }
        }
    }

    if (enemies.length === 0) {
        alert('You Win!');
        location.reload();
        return;
    }

    drawEnemies();
    drawPlayer();
    drawProjectiles();

    requestAnimationFrame(updateGame);
}

let moveLeftInterval, moveRightInterval, attackInterval;

function moveLeftAction() {
    if (playerX > 10) {
        playerX -= 10;
    }
}

function moveRightAction() {
    if (playerX < canvas.width - 10) {
        playerX += 10;
    }
}

function attackAction() {
    projectiles.push({ x: playerX, y: playerY });
}

document.getElementById('moveLeft').addEventListener('mousedown', function() {
    moveLeftAction();
    moveLeftInterval = setInterval(moveLeftAction, 100);
});

document.getElementById('moveRight').addEventListener('mousedown', function() {
    moveRightAction();
    moveRightInterval = setInterval(moveRightAction, 100);
});

document.getElementById('attack').addEventListener('mousedown', function() {
    attackAction();
    attackInterval = setInterval(attackAction, 100);
});

document.getElementById('moveLeft').addEventListener('mouseup', function() {
    clearInterval(moveLeftInterval);
});

document.getElementById('moveRight').addEventListener('mouseup', function() {
    clearInterval(moveRightInterval);
});

document.getElementById('attack').addEventListener('mouseup', function() {
    clearInterval(attackInterval);
});

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 10; j++) {
        enemies.push({ x: 10 + j * 30, y: 30 + i * 40 });
    }
}

updateGame();
