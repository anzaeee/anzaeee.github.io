<script lang="ts">
	import { onMount } from 'svelte';
	import tictactoeData from '$lib/tictactoe-data.json';
	import typingData from '$lib/typing-data.json';

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

	// Animation states
	let boardVisible = false;
	let celebrating = false;

	// Typing Game Variables
	let typingStarted = false;
	let typingCompleted = false;
	let selectedWordSet: 'common' | 'programming' | 'quotes' = 'common';
	let displayWords: string[] = [];
	let currentWordIndex = 0;
	let currentCharIndex = 0;
	let currentInput = '';
	let typingInput: HTMLInputElement;
	let startTime = 0;
	let currentWPM = 0;
	let accuracy = 100;
	let correctChars = 0;
	let incorrectChars = 0;
	let totalChars = 0;
	let timeLeft = 60;
	let typingTimer: number;
	let wpmTimer: number;
	let hasCurrentWordError = false;

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
			
			// AI turn
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

	// Typing Game Functions
	function generateWords() {
		const wordSet = typingData.wordSets[selectedWordSet];
		const words: string[] = [];
		
		if (selectedWordSet === 'quotes') {
			// For quotes, pick one random quote and split into words
			const randomQuote = wordSet[Math.floor(Math.random() * wordSet.length)];
			return randomQuote.split(' ');
		} else {
			// For other sets, pick random words
			for (let i = 0; i < 50; i++) {
				words.push(wordSet[Math.floor(Math.random() * wordSet.length)]);
			}
		}
		
		return words;
	}

	function startTyping() {
		displayWords = generateWords();
		typingStarted = true;
		typingCompleted = false;
		currentWordIndex = 0;
		currentCharIndex = 0;
		currentInput = '';
		correctChars = 0;
		incorrectChars = 0;
		totalChars = 0;
		timeLeft = 60;
		currentWPM = 0;
		accuracy = 100;
		hasCurrentWordError = false;
		startTime = Date.now();

		// Start timers
		typingTimer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				endTypingTest();
			}
		}, 1000);

		wpmTimer = setInterval(calculateWPM, 100);

		// Focus input after a short delay
		setTimeout(() => {
			if (typingInput) {
				typingInput.focus();
			}
		}, 100);
	}

	function handleTypingInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		
		// Handle space - move to next word
		if (value.endsWith(' ')) {
			if (currentInput.trim() === displayWords[currentWordIndex]) {
				// Correct word
				correctChars += displayWords[currentWordIndex].length + 1; // +1 for space
				currentWordIndex++;
				currentCharIndex = 0;
				currentInput = '';
				hasCurrentWordError = false;
				target.value = '';
				
				// Check if test is complete
				if (currentWordIndex >= displayWords.length) {
					endTypingTest();
					return;
				}
			} else {
				// Incorrect word - don't advance
				target.value = value.slice(0, -1); // Remove the space
			}
		} else {
			currentInput = value;
			currentCharIndex = value.length;
			
			// Check if current word has errors
			const currentWord = displayWords[currentWordIndex];
			hasCurrentWordError = !currentWord.startsWith(value);
		}
		
		totalChars++;
		calculateAccuracy();
	}

	function handleKeyDown(event: KeyboardEvent) {
		// Handle backspace
		if (event.key === 'Backspace' && currentInput.length > 0) {
			currentCharIndex = Math.max(0, currentCharIndex - 1);
		}
	}

	function getCharStatus(wordIndex: number, charIndex: number): 'correct' | 'incorrect' | 'untyped' {
		if (wordIndex < currentWordIndex) {
			return 'correct'; // Previous words are all correct
		}
		
		if (wordIndex > currentWordIndex) {
			return 'untyped'; // Future words
		}
		
		// Current word
		if (charIndex < currentInput.length) {
			const expectedChar = displayWords[wordIndex][charIndex];
			const typedChar = currentInput[charIndex];
			return expectedChar === typedChar ? 'correct' : 'incorrect';
		}
		
		return 'untyped';
	}

	function calculateWPM() {
		const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
		const wordsTyped = currentWordIndex + (currentCharIndex / 5); // 5 chars = 1 word
		currentWPM = timeElapsed > 0 ? wordsTyped / timeElapsed : 0;
	}

	function calculateAccuracy() {
		if (totalChars === 0) {
			accuracy = 100;
			return;
		}
		
		let correctCount = correctChars;
		let incorrectCount = 0;
		
		// Count errors in current word
		for (let i = 0; i < currentInput.length; i++) {
			if (i < displayWords[currentWordIndex].length) {
				if (currentInput[i] === displayWords[currentWordIndex][i]) {
					correctCount++;
				} else {
					incorrectCount++;
				}
			} else {
				incorrectCount++; // Extra characters
			}
		}
		
		accuracy = ((correctCount) / (correctCount + incorrectCount)) * 100;
		incorrectChars = incorrectCount;
	}

	function endTypingTest() {
		typingCompleted = true;
		clearInterval(typingTimer);
		clearInterval(wpmTimer);
		calculateFinalStats();
	}

	function calculateFinalStats() {
		calculateWPM();
		calculateAccuracy();
	}

	function resetTypingGame() {
		typingStarted = false;
		typingCompleted = false;
		clearInterval(typingTimer);
		clearInterval(wpmTimer);
	}

	onMount(() => {
		setTimeout(() => {
			boardVisible = true;
		}, 300);

		// Cleanup timers on unmount
		return () => {
			clearInterval(typingTimer);
			clearInterval(wpmTimer);
		};
	});
</script>

<div class="projects-page">
	<div class="container">
		<div class="page-header fade-in-up">
			<h1>Projects & Games</h1>
			<p>Interactive experiences and coding challenges</p>
		</div>

		<div class="project-section">
			<div class="game-container" class:visible={boardVisible}>
				<div class="game-header">
					<h2>Cosmic Tic-Tac-Toe</h2>
					<p>Challenge the AI in this classic game with a stellar twist</p>
				</div>

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

			<div class="typing-game-section">
				<div class="game-container" class:visible={boardVisible}>
					<div class="game-header">
						<h2>Speed Typing Challenge</h2>
						<p>Test your typing speed with real-time feedback</p>
					</div>

					<div class="typing-interface">
						{#if !typingStarted}
							<div class="typing-setup">
								<div class="word-set-selector">
									<label for="word-set">Word Set:</label>
									<select id="word-set" bind:value={selectedWordSet}>
										<option value="common">Common Words</option>
										<option value="programming">Programming Terms</option>
										<option value="quotes">Inspirational Quotes</option>
									</select>
								</div>
								<button class="btn start-typing-btn" on:click={startTyping}>
									⚡ Start Typing Test
								</button>
							</div>
						{:else}
							<div class="typing-stats">
								<div class="stat">
									<div class="stat-value">{Math.round(currentWPM)}</div>
									<div class="stat-label">WPM</div>
								</div>
								<div class="stat">
									<div class="stat-value">{Math.round(accuracy)}%</div>
									<div class="stat-label">Accuracy</div>
								</div>
								<div class="stat">
									<div class="stat-value">{timeLeft}</div>
									<div class="stat-label">Time</div>
								</div>
							</div>

							<div class="typing-text">
								{#each displayWords as word, wordIndex}
									<span 
										class="word"
										class:current={wordIndex === currentWordIndex}
										class:completed={wordIndex < currentWordIndex}
										class:error={wordIndex === currentWordIndex && hasCurrentWordError}
									>
										{#each word.split('') as char, charIndex}
											<span 
												class="char"
												class:correct={getCharStatus(wordIndex, charIndex) === 'correct'}
												class:incorrect={getCharStatus(wordIndex, charIndex) === 'incorrect'}
												class:current={wordIndex === currentWordIndex && charIndex === currentCharIndex}
											>
												{char}
											</span>
										{/each}
									</span>
								{/each}
							</div>

							<div class="typing-input-area">
								<input 
									bind:this={typingInput}
									bind:value={currentInput}
									on:input={handleTypingInput}
									on:keydown={handleKeyDown}
									class="typing-input"
									placeholder="Start typing..."
									disabled={typingCompleted}
								/>
							</div>

							{#if typingCompleted}
								<div class="typing-results">
									<h3>🎉 Test Complete!</h3>
									<div class="final-stats">
										<div class="stat-card">
											<div class="stat-number">{Math.round(currentWPM)}</div>
											<div class="stat-label">WPM</div>
										</div>
										<div class="stat-card">
											<div class="stat-number">{Math.round(accuracy)}%</div>
											<div class="stat-label">Accuracy</div>
										</div>
										<div class="stat-card">
											<div class="stat-number">{correctChars}</div>
											<div class="stat-label">Correct</div>
										</div>
										<div class="stat-card">
											<div class="stat-number">{incorrectChars}</div>
											<div class="stat-label">Errors</div>
										</div>
									</div>
									<button class="btn" on:click={resetTypingGame}>
										🔄 Try Again
									</button>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			</div>

			<div class="coming-soon">
				<div class="card">
					<h3>More Projects Coming Soon</h3>
					<p>Stay tuned for more interactive experiences, coding challenges, and creative projects!</p>
					<div class="project-ideas">
						<div class="idea-item">🎮 Retro Snake Game</div>
						<div class="idea-item">🧩 Algorithm Visualizer</div>
						<div class="idea-item">🎨 Generative Art Gallery</div>
						<div class="idea-item">📊 Data Visualization Playground</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Background animation -->
	<div class="floating-shapes">
		{#each Array(6) as _, i}
			<div class="shape shape-{i + 1}"></div>
		{/each}
	</div>
</div>

<style>
	.projects-page {
		position: relative;
		min-height: 100vh;
		padding: 2rem 0;
	}

	.page-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.page-header h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.page-header p {
		font-size: 1.2rem;
		color: var(--text-secondary);
	}

	.project-section {
		display: grid;
		gap: 4rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.game-container {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 3rem;
		border: 1px solid var(--border-color);
		transform: translateY(50px);
		opacity: 0;
		transition: all 0.8s ease;
	}

	.game-container.visible {
		transform: translateY(0);
		opacity: 1;
	}

	.game-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.game-header h2 {
		color: var(--accent-cyan);
		margin-bottom: 0.5rem;
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
		max-width: 300px;
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

	.coming-soon {
		opacity: 0;
		animation: fadeInUp 0.6s ease-out 0.5s forwards;
	}

	.project-ideas {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.idea-item {
		background: var(--primary-bg);
		padding: 1rem;
		border-radius: 0.5rem;
		text-align: center;
		color: var(--accent-cyan);
		font-weight: 500;
		border: 1px solid var(--border-color);
		transition: all 0.3s ease;
	}

	.idea-item:hover {
		border-color: var(--accent-cyan);
		transform: translateY(-2px);
	}

	/* Typing Game Styles */
	.typing-game-section {
		margin-top: 4rem;
	}

	.typing-interface {
		background: var(--primary-bg);
		border-radius: 1rem;
		padding: 2rem;
		border: 1px solid var(--border-color);
	}

	.typing-setup {
		text-align: center;
	}

	.word-set-selector {
		margin-bottom: 2rem;
	}

	.word-set-selector label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--accent-purple);
		font-weight: 600;
	}

	.word-set-selector select {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		min-width: 200px;
	}

	.start-typing-btn {
		font-size: 1.2rem;
		padding: 1rem 2rem;
	}

	.typing-stats {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.typing-text {
		background: var(--secondary-bg);
		border-radius: 0.5rem;
		padding: 2rem;
		font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
		font-size: 1.3rem;
		line-height: 2;
		margin-bottom: 2rem;
		min-height: 120px;
		border: 2px solid var(--border-color);
		overflow-wrap: break-word;
	}

	.word {
		margin-right: 0.5rem;
		position: relative;
	}

	.word.current {
		background: rgba(0, 255, 255, 0.1);
		border-radius: 0.25rem;
		padding: 0.1rem 0.2rem;
	}

	.word.completed .char {
		color: var(--accent-cyan);
		text-decoration: line-through;
		text-decoration-color: var(--accent-cyan);
	}

	.word.error {
		background: rgba(239, 68, 68, 0.2);
		border-radius: 0.25rem;
		padding: 0.1rem 0.2rem;
	}

	.char {
		position: relative;
	}

	.char.correct {
		color: var(--accent-cyan);
		text-decoration: line-through;
		text-decoration-color: var(--accent-cyan);
		background: rgba(0, 255, 255, 0.1);
	}

	.char.incorrect {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.2);
		text-decoration: line-through;
		text-decoration-color: #ef4444;
	}

	.char.current {
		background: var(--accent-purple);
		color: var(--primary-bg);
		animation: cursor-blink 1s infinite;
	}

	@keyframes cursor-blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0.3; }
	}

	.typing-input-area {
		margin-bottom: 2rem;
	}

	.typing-input {
		width: 100%;
		padding: 1rem;
		font-size: 1.2rem;
		font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
		text-align: center;
		border: 2px solid var(--accent-cyan);
		background: var(--secondary-bg);
		color: var(--text-primary);
		border-radius: 0.5rem;
	}

	.typing-input:focus {
		outline: none;
		border-color: var(--accent-purple);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
	}

	.typing-results {
		text-align: center;
		background: var(--secondary-bg);
		border-radius: 1rem;
		padding: 2rem;
		border: 2px solid var(--accent-cyan);
	}

	.typing-results h3 {
		color: var(--accent-cyan);
		margin-bottom: 2rem;
	}

	.final-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: var(--primary-bg);
		border-radius: 0.5rem;
		padding: 1.5rem;
		border: 1px solid var(--border-color);
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.5rem;
	}

	/* Floating background shapes */
	.floating-shapes {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.shape {
		position: absolute;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		opacity: 0.1;
		animation: float 6s ease-in-out infinite;
	}

	.shape-1 { width: 80px; height: 80px; top: 20%; left: 10%; animation-delay: 0s; }
	.shape-2 { width: 120px; height: 120px; top: 60%; right: 15%; animation-delay: 1s; }
	.shape-3 { width: 60px; height: 60px; top: 80%; left: 20%; animation-delay: 2s; }
	.shape-4 { width: 100px; height: 100px; top: 30%; right: 30%; animation-delay: 3s; }
	.shape-5 { width: 70px; height: 70px; top: 10%; right: 10%; animation-delay: 4s; }
	.shape-6 { width: 90px; height: 90px; bottom: 20%; left: 50%; animation-delay: 5s; }

	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(180deg); }
	}

	@media (max-width: 768px) {
		.game-container {
			padding: 2rem 1rem;
		}
		
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
		
		.project-ideas {
			grid-template-columns: 1fr;
		}
	}
</style>