<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	// Game variables
	let ballX: number;
	let ballY: number;
	let ballRadius = 15;
	let ballDx: number;
	let ballDy: number;
	let paddleX: number;
	let paddleWidth = 100;
	let paddleHeight = 20;
	let gameStarted = false;
	let gameOver = false;
	let score = 0;
	let highScore = 0;

	const gravity = 0.5;
	const bounceFactor = 0.8;
	const initialSpeed = 5;

	function initializeGame() {
		score = 0;
		gameOver = false;
		ballX = canvas.width / 2;
		ballY = ballRadius;
		ballDx = (Math.random() - 0.5) * initialSpeed * 2;
		ballDy = initialSpeed;
		paddleX = (canvas.width - paddleWidth) / 2;
		gameStarted = true;
		animationFrameId = requestAnimationFrame(gameLoop);
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = 'var(--accent-cyan)';
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
		ctx.fillStyle = 'var(--accent-purple)';
		ctx.fill();
		ctx.closePath();
	}

	function updateGame() {
		if (gameOver || !gameStarted) return;

		// Update ball position
		ballDy += gravity;
		ballX += ballDx;
		ballY += ballDy;

		// Wall collision (left/right)
		if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
			ballDx = -ballDx * bounceFactor;
			// Keep ball within bounds
			if (ballX + ballRadius > canvas.width) ballX = canvas.width - ballRadius;
			else if (ballX - ballRadius < 0) ballX = ballRadius;
		}

		// Wall collision (top)
		if (ballY - ballRadius < 0) {
			ballDy = -ballDy * bounceFactor;
			ballY = ballRadius;
		}

		// Paddle collision
		const paddleY = canvas.height - paddleHeight - 10;
		if (
			ballY + ballRadius > paddleY &&
			ballX > paddleX &&
			ballX < paddleX + paddleWidth &&
			ballDy > 0 // Only bounce if ball is moving downwards
		) {
			ballY = paddleY - ballRadius; // Position ball above paddle
			ballDy = -ballDy * bounceFactor;

			// Add some horizontal kick based on where it hit the paddle
			const hitPoint = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
			ballDx += hitPoint * 2; 

			score++;
		}

		// Game over (ball hits bottom)
		if (ballY + ballRadius > canvas.height) {
			gameOver = true;
			gameStarted = false;
			if (score > highScore) {
				highScore = score;
			}
			cancelAnimationFrame(animationFrameId);
		}
	}

	function gameLoop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		drawBall();
		drawPaddle();
		updateGame();

		if (!gameOver) {
			animationFrameId = requestAnimationFrame(gameLoop);
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!gameStarted) return;
		const relativeX = event.clientX - canvas.getBoundingClientRect().left;
		if (relativeX > 0 && relativeX < canvas.width) {
			paddleX = relativeX - paddleWidth / 2;
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		// Set canvas dimensions dynamically based on parent container or viewport
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = Math.min(parent.clientHeight, 500); // Cap height to 500px or parent height
		}

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', handleResize);
		initializeGame(); // Initialize game on mount
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('resize', handleResize);
	});

	function handleResize() {
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = Math.min(parent.clientHeight, 500); // Re-adjust height on resize
		}
		// Re-center paddle on resize if game not started or paused
		if (!gameStarted) {
			paddleX = (canvas.width - paddleWidth) / 2;
		}
	}
</script>

<div class="ball-protector-game">
	<canvas bind:this={canvas}></canvas>

	{#if gameOver}
		<div class="game-overlay">
			<h3>Game Over!</h3>
			<p>Score: {score}</p>
			<p>High Score: {highScore}</p>
			<button class="btn" on:click={initializeGame}>Play Again</button>
		</div>
	{:else if !gameStarted}
		<div class="game-overlay">
			<h3>Ball Protector</h3>
			<p>Use your mouse to move the paddle and prevent the ball from falling!</p>
			<button class="btn" on:click={initializeGame}>Start Game</button>
		</div>
	{/if}

	{#if gameStarted}
		<div class="game-info">
			<p>Score: {score}</p>
			<p>High Score: {highScore}</p>
		</div>
	{/if}
</div>

<style>
	.ball-protector-game {
		position: relative;
		width: 100%;
		height: 500px; /* Max height for the game */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--primary-bg);
		border-radius: 1rem;
		overflow: hidden; /* Ensure content doesn't spill out */
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	canvas {
		display: block;
		background-color: var(--secondary-bg);
		border-radius: 0.8rem;
		border: 1px solid var(--border-color);
	}

	.game-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		text-align: center;
		z-index: 10;
		border-radius: 1rem;
	}

	.game-overlay h3 {
		font-size: 2.5rem;
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.game-overlay p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
	}

	.game-overlay .btn {
		background-color: var(--accent-purple);
		color: white;
		padding: 0.8rem 2rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.game-overlay .btn:hover {
		background-color: var(--accent-cyan);
	}

	.game-info {
		position: absolute;
		top: 1rem;
		left: 1rem;
		color: var(--text-secondary);
		font-size: 1.1rem;
	}

	.game-info p {
		margin-bottom: 0.5rem;
	}
</style>