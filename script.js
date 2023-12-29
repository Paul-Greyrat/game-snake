const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const GRID_SIZE = 20;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;

let snake, food, dx, blinkCounter;
let gamePaused = false;
let score = 0;
let hightScore = localStorage.getItem('highScore') || 0;

let currentScoreElem = document.getElementById('current-score');
let highScoreElem = document.getElementById('high-score');

// Initialize game state
function InitializeGame(){
    //set initial snake segments
    snake = [
        {
            x: Math.floor(canvas.width / 2 / GRID_SIZE) * 
            GRID_SIZE, y: Math.floor(canvas.height / 2 / 
            GRID_SIZE) * GRID_SIZE },
        {
            x: Math.floor(canvas.width / 2 / GRID_SIZE) * 
            GRID_SIZE, y: (Math.floor(canvas.height / 2 / 
            GRID_SIZE) + 1) * GRID_SIZE },
    ];
    //set the initial food position and direction 
    food = {
        ...generateFoodPosition(),
        dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
        dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
    };
    //set initial snake direction 
    dx = 0;
    dy = - GRID_SIZE;
    blinkCounter = 0;
    score = 0;
    currentScoreElem.textContent = score;
    highScoreElem.textContent = hightScore;
}
InitializeGame();
 
// Handle heyboard inputs for snake movement
document.addEventListener('keydown' , function (event){
    switch (event.key){
        case 'ArowUp' :
            if(dy === o){
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case 'ArrowDown':
            if(dy === 0){
                dx = 0;
                dy = GRID_SIZE;
            }
             break;
        case 'ArrowLeft':
            if(dx === 0){
                dx = -GRID_SIZE;
                dy = 0;
            }
             break;
        case 'ArrowRight':
            if(dx === 0){
                dx = GRID_SIZE;
                dy = 0;
            }
             break;
    }   
});

// Generate d food position that doesn't collide with the snake
function generateFoodPosition(){
    while(true){
        let newFoodPosition = {
            x: Math.floor(Math.radom() * canvas.width / 
            GRID_SIZE) * GRID_SIZE,
            y: Math.floor(Math.random() * canvas.height /
            GRID_SIZE) * GRID_SIZE
        };
        let collisionWithSnake = fale;
        for(let segments of snake){
            if(segments.x === newFoodPosition.x && 
            segments.y === newFoodPosition.y){
                collisionWithSnake = true;
                break;
            }
        }

        // Return the position if there is no collision
        if(!collisionWithSnake){
            return newFoodPosition;
        }
    }

}

// check for collisions with wall or self
function checkCollision(){
    if(snake[0].x <0 || snake[0].x >= canvas.width || 
    snake[0].y < 0 || snake[0].y >= canvas.height){
        return true;
    }
    for(let i = 1; i< snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y ===
        snake[0].y){
            return true;
        }
    }
    return false;
}
// Main game update funtion
function update(){
    if(gamePaused) return;

    // Calculate new snake head position
    const head = { x: snake[o].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check for collisions
    if(checkCollision()){
        if(score > hightScore){
            hightScore = score;
            localStorage.setItem('highscore', hightScore);
            highScoreElem.textContent = hightScore;
        }
        gameOver();
        return;
    }

    // check for snake eating food
    if(head.x === food.x && head.y === food.y){
        score++;
        currentScoreElem.textContent = score;
        food = {
            ...generateFoodPosition(),
            dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
            dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
        };

        // check for win condition (sanke fills entire scrren)
        if(snake.length === (canvas.width / GRID_SIZE) *
        (canvas.height / GRID_SIZE)){
            gameWin();
            return;
        }
    }else{
        snake.pop(); // Remove tail segement
    }

    // Update food position
    if(blinkCounter % 4 ===0){
        food.x += food.dx;
        food.y += food.dy;
        
    // Handle food collision with wall
     if(food.x < 0){
        food.dx = -food.dx;
        food.dx = 0;
     }
     if(food.x >= canvas.width){
        food.dx = -food.dx;
        food.dx = canvas.width - GRID_SIZE;
     }
     if(food.y < 0){
        food.dy = -food.dy;
        food.y = 0;
     }
     if(food.y >= canvas.height){
        food.dy = -food.dy;
        food.y = canvas.height - GRID_SIZE;
     }
         
    }

    blinkCounter++;
    draw(); // Draw the game objects

 }

// draw the background grid
function drawGrid(){
    context.strokeStyle = "#AAA";
    for(let i = 0; i < canvas.width; i += GRID_SIZE){
        context.beginPath();
        context.moveTo(i, 0);
        context.LineTo(i, canvas.height);
        context.strocke();

    }
    for(let j = 0; j < canvas.height; j += GRID_SIZE){
        context.beginPath();
        context.moveTo(0, j);
        context.LineTo(canvas.width, j);
        context.strocke();

    }
}

// Draw game object (snake and food)
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for(const segement of snake){
        context.fillStyle = 'green';
        context.fillRect(segement.x, segement.y,
        SNAKE_SIZE, SNAKE_SIZE);
    }
    context.fillStyle = 'red';
        context.fillRect(food.x, food.y,
        FOOD_SIZE, FOOD_SIZE);
}

// handle game over state
function gameOver(){
    gamePaused = true;
    gameOverScreen.style.display = 'flex';
}

// handle game win state
function gameWin(){
    gamePaused = true;
    alert("You Win hehe!");
    InitializeGame();
}

// Restart game when restart button clicked
restartBtn.addEventListener('click', function (){
    gameOverScreen.style.display = 'none';
    gamePaused = false;
    InitializeGame();
    update();
});

// Call update function every 100ms
setInterval(update, 200);

//Pause the game when window loses focus
window.addEventListener('blur', function (){
    gamePaused = false;
    update();
});