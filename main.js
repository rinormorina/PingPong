const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//user paddle

const user = {
    x : 0,
    y : (canvas.height - 100)/2,    
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

// computer paddle

const computer = {
    x : canvas.width - 10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

// Ball

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "aqua"
}

// middle of pitch

const middle = {
    x : (canvas.width - 2)/2,
    y : 0,
    color : "white",
    width : 2,
    height : 10 
}

const hit = new Audio();
hit.src = 'sounds/hit.mp3';

const point = new Audio();
point.src = 'sounds/comScore.mp3';

const wall = new Audio();
wall.src = 'sounds/wall.mp3';



function drawCanvas(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}


function drawBall(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,true);
    context.closePath();
    context.fill();
}



function drawText(text,x,y,color){
    context.fillStyle = color;
    context.font = "50px Arial";
    context.fillText(text,x,y);
}


function drawMiddle(){
    for(let i =0;  i <= canvas.height; i+= 15){
        drawCanvas(middle.x, middle.y + i, middle.width, middle.height, middle.color);
    }
}

function collisionCheck(b, p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetGame(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 7;
    ball.velocityX = - ball.velocityX;

}

canvas.addEventListener("mousemove", contolPaddle);

function contolPaddle(evt){

    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/3;

}

function play(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY

    //make the computer move AI
    let difficultLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.height/2)) * difficultLevel;

    if(ball.y + ball.radius > canvas.height || ball.y + ball.radius < 0){
        ball.velocityY = - ball.velocityY;
        wall.play();
    }

    let player = (ball.x < canvas.width/2) ? user : computer;

    if(collisionCheck(ball, player)){

        hit.play();

         let collidePoint = (ball.y - (player.y + player.height/2));
         collidePoint = collidePoint / (player.height/2);

         let angleRad = (Math.PI/4) * collidePoint;

         let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        
         ball.velocityX = direction * ball.speed * Math.cos(angleRad);
         ball.velocityY = ball.speed * Math.sin(angleRad);
        
         ball.speed += 0.1

       
    }

    if(ball.x -ball.radius< 0 ){
        point.play();
        computer.score++;
        resetGame();
    }else if (ball.x +ball.radius >canvas.width)
    {
        point.play();
        user.score++;
        resetGame();
    }
}

function render(){
    //clear the canvas

    drawCanvas(0, 0, canvas.width, canvas.height, "#000");

    
    // get the score 
    drawText(user.score, canvas.width/4, canvas.height/5 , "white");
    drawText(computer.score, canvas.width/4*3, canvas.height/5, "white");
    
    drawMiddle();
    
    //draw user and computer paddles
    drawCanvas(user.x, user.y, user.width, user.height, user.color);
    drawCanvas(computer.x, computer.y, computer.width, computer.height, computer.color);

    // draw the ball
    drawBall(ball.x, ball.y, ball.radius, ball.color);

}
 

function game(){
play();
render();
}

const framePerSecond = 50;
setInterval(game,1000/framePerSecond);