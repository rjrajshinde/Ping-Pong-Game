var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 4;
var paddle1Y = 250; //left paddle
const PADDLE_HEIGHT = 100; //height of the paddel
const PADDLE_THICKNESS = 10; //height of the paddel
var paddle2Y = 250; //right paddle

var player1Score = 0; //variable for storing the scores of the player1
var player2Score = 0; //variable for storing the scores of the player2
const WINNING_SCORE = 10; //winning score one of the player got this score then game over

var showingWinScreen = false;

//function for handling mouse click after one player wins
function handleMouseClick() {
  if (showingWinScreen) {
    player2Score = 0;
    player1Score = 0;
    showingWinScreen = false;
  }
}

//it the main fucntion that load after window loading
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  // this eventlistener for when one player wins games stop
  canvas.addEventListener("mousedown", handleMouseClick);

  //here we add the eventlistener that runs when mouse moves
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

//fucntion to calculate the mouse position according to the x and y axis that's how we calculate
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

//function to reset the ball
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    // when one player wins it becomes true
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 6;
  }
}

function moveEverything() {
  //if the one player wins then the game stops
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  //bouncing the ball from right side
  if (ballX < 0) {
    //check where the ball is touching to the left paddle and if touches
    //then reflet it
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      //here we are actually calculating the where the ball get in contact with paddle
      //means in which part like in middle of paddle or on top edge of paddle or bottom edge of paddle
      //and then we will set the speed and direction of ball when it is reflected by paddle
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  //bouncing the ball from left side
  if (ballX > canvas.width) {
    //check where the ball is touching to the right paddle and if touches
    //then reflet it
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }

  ballY += ballSpeedY;
  //bouncing the ball from top
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  //bouncing the ball from bottom
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

//fucntion to draw the net in the middle (dotted line)
function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 3, 20, "white");
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black"); // this line blanks out the screen with black

  //if the one player wins then the game stops
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    //if player 1 wins show message else player 2 wins show message
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText(`Player 1 WINS`, 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText(`Player 2 WINS`, 350, 200);
    }
    canvasContext.fillText(`Click to Continue`, 350, 500);
    return;
  }

  drawNet();

  // this is left player paddel
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  // this is right computer paddel
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );
  // this is for the rounded red ball
  colorCircle(ballX, ballY, 10, "white");
  // this is for displaying the player 1 scores
  canvasContext.fillText(`Player 1: ${player1Score}`, 50, 30);
  // this is for displaying the player 2 scores
  canvasContext.fillText(`Player 2: ${player2Score}`, canvas.width - 100, 30);
}

//fucntion to draw the cirlce
function colorCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

//function to create rectangles on canvas
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
