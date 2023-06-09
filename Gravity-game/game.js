const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "assets/star.png";

let gradient = ctx.createLinearGradient(0, 0, 0, 170);
gradient.addColorStop(0, "lightgrey");
gradient.addColorStop(1, "pink");

const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.querySelector("#score-display");
let score = 0;
let highScore = 0;

let scored = false;

// lets us control the bird with the space key
document.body.onkeydown = function (e) {
	if (e.code == "Space") {
		birdVelocity = FLAP_SPEED;
	}
};

//difficulty buttons
document
	.getElementById("select-difficulty")
	.addEventListener("click", function () {
		selectDifficulty();
	});

document.querySelector("#easy-button").addEventListener("click", function () {
	document.querySelector("#select-difficulty").style.display = "block";
	document.querySelector("#difficulty-buttons").style.display = "none";

	hideEndMenu();
	resetGame();
	loop();
});
document.querySelector("#hard-button").addEventListener("click", function () {
	document.querySelector("#select-difficulty").style.display = "block";
	document.querySelector("#difficulty-buttons").style.display = "none";
	hideEndMenu();
	resetGame();
	loop();
	loop();
});

document
	.querySelector("#impossible-button")
	.addEventListener("click", function () {
		document.querySelector("#select-difficulty").style.display = "block";
		document.querySelector("#difficulty-buttons").style.display = "none";
		hideEndMenu();
		resetGame();
		loop();
		loop();
		loop();
		loop();
	});

document
	.querySelector("#restart-button")
	.addEventListener("click", function () {
		hideEndMenu();
		resetGame();
		loop();
	});

function selectDifficulty() {
	document.querySelector("#difficulty-buttons").style.display = "block";
	document.querySelector("#select-difficulty").style.display = "none";
}

function increaseScore() {
	if (
		birdX > pipeX + PIPE_WIDTH &&
		(birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
		!scored
	) {
		score++;
		scoreDiv.innerHTML = score;
		scored = true;
	}

	if (birdX < pipeX + PIPE_WIDTH) {
		scored = false;
	}
}

function collisionCheck() {
	const birdBox = {
		x: birdX,
		y: birdY,
		width: BIRD_WIDTH,
		height: BIRD_HEIGHT,
	};

	const topPipeBox = {
		x: pipeX,
		y: pipeY - PIPE_GAP + BIRD_HEIGHT,
		width: PIPE_WIDTH,
		height: pipeY,
	};

	const bottomPipeBox = {
		x: pipeX,
		y: pipeY + PIPE_GAP + BIRD_HEIGHT,
		width: PIPE_WIDTH,
		height: canvas.height - pipeY - PIPE_GAP,
	};

	// Check for collision with upper pipe box
	if (
		birdBox.x + birdBox.width > topPipeBox.x &&
		birdBox.x < topPipeBox.x + topPipeBox.width &&
		birdBox.y < topPipeBox.y
	) {
		return true;
	}

	// Check for collision with lower pipe box
	if (
		birdBox.x + birdBox.width > bottomPipeBox.x &&
		birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
		birdBox.y + birdBox.height > bottomPipeBox.y
	) {
		return true;
	}

	// check if bird hits boundaries
	if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
		return true;
	}

	return false;
}

function hideEndMenu() {
	document.querySelector("#end-menu").style.display = "none";
	gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
	document.querySelector("#end-menu").style.display = "block";
	gameContainer.classList.add("backdrop-blur");
	document.querySelector("#end-score").innerHTML = score;

	if (highScore < score) {
		highScore = score;
	}
	document.querySelector("#best-score").innerHTML = highScore;
}

function resetGame() {
	birdX = 50;
	birdY = 50;
	birdVelocity = 0;
	birdAcceleration = 0.1;

	pipeX = 400;
	pipeY = canvas.height - 200;

	score = 0;
	console.log(100);
}

function endGame() {
	showEndMenu();
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(flappyImg, birdX, birdY);

	// Draw Pipes
	ctx.fillStyle = gradient;
	ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
	ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

	if (collisionCheck()) {
		endGame();
		return;
	}

	pipeX -= 1.5;

	if (pipeX < -50) {
		pipeX = 400;
		pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
	}

	birdVelocity += birdAcceleration;
	birdY += birdVelocity;

	increaseScore();
	requestAnimationFrame(loop);
}
