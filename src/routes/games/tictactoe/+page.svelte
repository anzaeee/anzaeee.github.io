<script lang="ts">
	import { onMount } from 'svelte';
	import tictactoeData from '$lib/tictactoe-data.json';

	type Player = 'X' | 'O' | null;
	type Difficulty = 'easy' | 'medium' | 'hard';

	let board: Player[] = Array(9).fill(null);
	let currentPlayer: Player = 'X';
	let gameStatus: 'playing' | 'won' | 'draw' = 'playing';
	let winner: Player = null;
	let difficulty: Difficulty = 'medium';
	let playerScore = 0;
	let aiScore = 0;
	let draws = 0;
	let gameCount = 0;
	let celebrating = false;

	const winningCombinations = tictactoeData.winningCombinations;

	function checkWinner(board: Player[]): Player {
		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a];
			}
		}
		return null;
	}

	function isBoardFull(board: Player[]): boolean {
		return board.every(cell => cell !== null);
	}

	function makeMove(index: number) {
		if (board[index] || gameStatus !== 'playing') return;

		board[index] = currentPlayer;
		board = [...board];

		const winnerResult = checkWinner(board);
		if (winnerResult) {
			gameStatus = 'won';
			winner = winnerResult;
			celebrating = true;
			setTimeout(() => celebrating = false, 2000);
			
			if (winnerResult === 'X') {
				playerScore++;
			} else {
				aiScore++;
			}
			gameCount++;
		} else if (isBoardFull(board)) {
			gameStatus = 'draw';
			draws++;
			gameCount++;
		} else {
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			
			if (currentPlayer === 'O') {
				setTimeout(() => {
					makeAIMove();
				}, 500);
			}
		}
	}

	function makeAIMove() {
		if (gameStatus !== 'playing') return;

		const move = getBestMove(board, difficulty);
		if (move !== -1) {
			makeMove(move);
		}
	}

	function getBestMove(board: Player[], difficulty: Difficulty): number {
		const smartMovePercent = tictactoeData.difficulty[difficulty].smartMovePercent;
		const useSmartMove = Math.random() * 100 < smartMovePercent;

		if (useSmartMove) {
			return getSmartMove(board);
		} else {
			return getRandomMove(board);
		}
	}

	function getSmartMove(board: Player[]): number {
		// Check if AI can win
		for (let i = 0; i < 9; i++) {
			if (!board[i]) {
				board[i] = 'O';
				if (checkWinner(board) === 'O') {
					board[i] = null;
					return i;
				}
				board[i] = null;
			}
		}

		// Check if AI needs to block player
		for (let i = 0; i < 9; i++) {
			if (!board[i]) {
				board[i] = 'X';
				if (checkWinner(board) === 'X') {
					board[i] = null;
					return i;
				}
				board[i] = null;
			}
		}

		// Prefer center
		if (!board[4]) return 4;

		// Prefer corners
		const corners = [0, 2, 6, 8];
		const availableCorners = corners.filter(i => !board[i]);
		if (availableCorners.length > 0) {
			return availableCorners[Math.floor(Math.random() * availableCorners.length)];
		}

		// Take any edge
		return getRandomMove(board);
	}

	function getRandomMove(board: Player[]): number {
		const availableMoves = board
			.map((cell, index) => cell === null ? index : null)
			.filter(val => val !== null) as number[];
		
		return availableMoves.length > 0 
			? availableMoves[Math.floor(Math.random() * availableMoves.length)]
			: -1;
	}

	function resetGame() {
		board = Array(9).fill(null);
		currentPlayer = 'X';
		gameStatus = 'playing';
		winner = null;
		celebrating = false;
	}

	function resetStats() {
		playerScore = 0;
		aiScore = 0;
		draws = 0;
		gameCount = 0;
	}
</script>

<div class="game-content">
	<div class="game-controls">
		<div class="difficulty-selector">
			<label for="difficulty-select">AI Difficulty:</label>
			<select id="difficulty-select" bind:value={difficulty} on:change={resetGame}>
				{#each Object.entries(tictactoeData.difficulty) as [key, diff]}
					<option value={key}>{diff.name}</option>
				{/each}
			</select>
		</div>

		<div class="game-actions">
			<button class="btn btn-outline" on:click={resetGame}>New Game</button>
			<button class="btn btn-outline" on:click={resetStats}>Reset Stats</button>
		</div>
	</div>

	<div class="game-board" class:celebrating>
		{#each board as cell, index}
			<button 
				class="board-cell" 
				class:x={cell === 'X'}
				class:o={cell === 'O'}
				class:winner={winner && winningCombinations.some(combo => 
					combo.includes(index) && 
					combo.every(pos => board[pos] === winner)
				)}
				on:click={() => makeMove(index)}
				disabled={cell !== null || gameStatus !== 'playing' || currentPlayer === 'O'}
			>
				{cell || ''}
			</button>
		{/each}
	</div>

	<div class="game-status">
		{#if gameStatus === 'won'}
			<div class="status-message win">
				{winner === 'X' ? '🎉 You Won!' : '🤖 AI Wins!'}
			</div>
		{:else if gameStatus === 'draw'}
			<div class="status-message draw">
				🤝 It's a Draw!
			</div>
		{:else}
			<div class="status-message playing">
				{currentPlayer === 'X' ? "Your turn" : "AI thinking..."}
			</div>
		{/if}
	</div>

	<div class="scoreboard">
		<div class="score-item">
			<div class="score-value">{playerScore}</div>
			<div class="score-label">You</div>
		</div>
		<div class="score-item">
			<div class="score-value">{draws}</div>
			<div class="score-label">Draws</div>
		</div>
		<div class="score-item">
			<div class="score-value">{aiScore}</div>
			<div class="score-label">AI</div>
		</div>
	</div>

	{#if gameCount > 0}
		<div class="stats">
			<p>Games Played: {gameCount}</p>
			<p>Win Rate: {Math.round((playerScore / gameCount) * 100)}%</p>
		</div>
	{/if}
</div>

<style>
	.game-content {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.game-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.difficulty-selector {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.difficulty-selector label {
		color: var(--accent-purple);
		font-weight: 600;
	}

	.game-actions {
		display: flex;
		gap: 1rem;
	}

	.game-board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		max-width: 100%;
		width: clamp(250px, 90vw, 300px);
		margin: 2rem auto;
		transition: transform 0.3s ease;
	}

	.game-board.celebrating {
		transform: scale(1.05);
	}

	.board-cell {
		aspect-ratio: 1;
		background: var(--primary-bg);
		border: 2px solid var(--border-color);
		border-radius: 0.5rem;
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.board-cell:not(:disabled):hover {
		border-color: var(--accent-cyan);
		background: var(--hover-bg);
		transform: scale(1.05);
	}

	.board-cell.x {
		color: var(--accent-cyan);
		text-shadow: 0 0 10px var(--accent-cyan);
	}

	.board-cell.o {
		color: var(--accent-purple);
		text-shadow: 0 0 10px var(--accent-purple);
	}

	.board-cell.winner {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		animation: pulse 1s infinite;
	}

	.board-cell:disabled {
		cursor: not-allowed;
	}

	.game-status {
		text-align: center;
		margin: 2rem 0;
	}

	.status-message {
		font-size: 1.5rem;
		font-weight: 600;
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.status-message.win {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		color: var(--primary-bg);
	}

	.status-message.draw {
		background: var(--secondary-bg);
		color: var(--accent-purple);
		border: 2px solid var(--accent-purple);
	}

	.status-message.playing {
		color: var(--text-secondary);
	}

	.scoreboard {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 2rem 0;
	}

	.score-item {
		text-align: center;
	}

	.score-value {
		font-size: 2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.score-label {
		color: var(--text-muted);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.stats {
		text-align: center;
		margin-top: 1rem;
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.game-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.game-actions {
			justify-content: center;
		}

		.scoreboard {
			gap: 2rem;
		}
	}
</style>