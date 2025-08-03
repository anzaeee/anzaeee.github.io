<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	// Game variables
	let gameStarted = false;
	let gameOver = false;
	let score = 0;
	let highScore = 0;

	// Player variables
	let playerY = 0;
	let playerVelocity = 0;
	const playerWidth = 50;
	const playerHeight = 60;
	const gravity = 0.8;
	const jumpForce = -15;
	let isJumping = false;

	// Book variables
	type Book = {
		x: number;
		y: number;
		width: number;
		height: number;
		speed: number;
	};

	let books: Book[] = [];
	const bookSpawnInterval = 1500; // milliseconds
	let lastBookSpawn = 0;

	function initializeGame() {
		score = 0;
		gameOver = false;
		playerY = canvas.height - playerHeight - 20;
		playerVelocity = 0;
		books = [];
		gameStarted = true;
		lastBookSpawn = Date.now();
		animationFrameId = requestAnimationFrame(gameLoop);
	}

	function spawnBook() {
		const now = Date.now();
		if (now - lastBookSpawn >= bookSpawnInterval) {
			books.push({
				x: canvas.width,
				y: Math.random() * (canvas.height - 100),
				width: 40,
				height: 30,
				speed: 5 + Math.random() * 3
			});
			lastBookSpawn = now;
		}
	}

	function updateBooks() {
		books = books.filter(book => {
			book.x -= book.speed;
			return book.x + book.width > 0;
		});
	}

	function checkCollision(book: Book) {
		return (
			50 < book.x + book.width &&
			50 + playerWidth > book.x &&
			playerY < book.y + book.height &&
			playerY + playerHeight > book.y
		);
	}

	function drawPlayer() {
		ctx.fillStyle = 'var(--accent-purple)';
		// Draw wizard hat
		ctx.beginPath();
		ctx.moveTo(50, playerY);
		ctx.lineTo(50 + playerWidth/2, playerY - 20);
		ctx.lineTo(50 + playerWidth, playerY);
		ctx.fill();
		// Draw body
		ctx.fillRect(50, playerY, playerWidth, playerHeight);
		// Draw wand
		ctx.beginPath();
		ctx.moveTo(50 + playerWidth, playerY + playerHeight/2);
		ctx.lineTo(50 + playerWidth + 20, playerY + playerHeight/2);
		ctx.strokeStyle = 'var(--accent-cyan)';
		ctx.lineWidth = 3;
		ctx.stroke();
	}

	function drawBook(book: Book) {
		ctx.fillStyle = 'var(--accent-cyan)';
		ctx.fillRect(book.x, book.y, book.width, book.height);
		// Add book details
		ctx.strokeStyle = 'var(--primary-bg)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(book.x + 5, book.y + 5);
		ctx.lineTo(book.x + book.width - 5, book.y + 5);
		ctx.stroke();
	}

	function updateGame() {
		if (gameOver || !gameStarted) return;

		// Update player position
		playerVelocity += gravity;
		playerY += playerVelocity;

		// Ground collision
		if (playerY > canvas.height - playerHeight - 20) {
			playerY = canvas.height - playerHeight - 20;
			playerVelocity = 0;
			isJumping = false;
		}

		// Ceiling collision
		if (playerY < 0) {
			playerY = 0;
			playerVelocity = 0;
		}

		// Spawn and update books
		spawnBook();
		updateBooks();

		// Check collisions
		for (const book of books) {
			if (checkCollision(book)) {
				gameOver = true;
				gameStarted = false;
				if (score > highScore) {
					highScore = score;
				}
				cancelAnimationFrame(animationFrameId);
				return;
			}
		}

		score++;
	}

	function gameLoop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		updateGame();
		drawPlayer();
		books.forEach(drawBook);

		// Draw score
		ctx.fillStyle = 'var(--text-primary)';
		ctx.font = '20px Arial';
		ctx.fillText(`Score: ${score}`, 10, 30);

		if (!gameOver) {
			animationFrameId = requestAnimationFrame(gameLoop);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'Space' && !isJumping) {
			playerVelocity = jumpForce;
			isJumping = true;
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = Math.min(parent.clientHeight, 500);
		}

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);
		playerY = canvas.height - playerHeight - 20;
	});

	onDestroy(() => {
		cancelAnimationFrame(animationFrameId);
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('resize', handleResize);
	});

	function handleResize() {
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = Math.min(parent.clientHeight, 500);
		}
		if (!gameStarted) {
			playerY = canvas.height - playerHeight - 20;
		}
	}
</script>

<div class="hogwarts-runner">
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
			<h3>Hogwarts Runner</h3>
			<p>Press SPACE to jump and avoid the flying books!</p>
			<button class="btn" on:click={initializeGame}>Start Game</button>
		</div>
	{/if}
</div>

<style>
	.hogwarts-runner {
		position: relative;
		width: 100%;
		height: 500px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--primary-bg);
		border-radius: 1rem;
		overflow: hidden;
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

	.btn {
		background-color: var(--accent-purple);
		color: white;
		padding: 0.8rem 2rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.btn:hover {
		background-color: var(--accent-cyan);
	}
</style>