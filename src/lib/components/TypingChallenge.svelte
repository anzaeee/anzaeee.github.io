<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Typing data with different difficulties
	const typingData = {
		easy: [
			'the quick brown fox jumps over the lazy dog',
			'hello world this is a simple typing test',
			'practice makes perfect when learning to type',
			'coding is fun and rewarding for developers'
		],
		medium: [
			'javascript typescript python java are popular programming languages',
			'function component state props hooks useEffect useState',
			'database query select insert update delete from where',
			'algorithm complexity time space big notation analysis'
		],
		hard: [
			'const handleAsyncOperation = async (data: Promise<Response>) => await data.json()',
			'interface GenericRepository<T> extends BaseRepository { findById(id: string): Promise<T> }',
			'export default function useCustomHook<T>(initialValue: T): [T, (value: T) => void]',
			'try { const result = await fetch("/api/data").then(res => res.json()) } catch (error) { console.error(error) }'
		]
	};

	type Difficulty = 'easy' | 'medium' | 'hard';
	
	let difficulty: Difficulty = 'easy';
	let currentText = '';
	let currentIndex = 0;
	let startTime = 0;
	let gameStarted = false;
	let gameCompleted = false;
	let wpm = 0;
	let accuracy = 100;
	let correctChars = 0;
	let incorrectChars = 0;
	let timer: number;
	let testDuration = 60; // seconds
	let timeLeft = testDuration;

	// Character states: 'untyped' | 'correct' | 'incorrect' | 'current'
	let charStates: string[] = [];

	function initializeGame() {
		const texts = typingData[difficulty];
		currentText = texts[Math.floor(Math.random() * texts.length)];
		currentIndex = 0;
		charStates = new Array(currentText.length).fill('untyped');
		charStates[0] = 'current';
		gameStarted = false;
		gameCompleted = false;
		correctChars = 0;
		incorrectChars = 0;
		wpm = 0;
		accuracy = 100;
		timeLeft = testDuration;
		startTime = 0;
		clearInterval(timer);
	}

	function startGame() {
		if (!gameStarted) {
			gameStarted = true;
			startTime = Date.now();
			timer = setInterval(() => {
				timeLeft--;
				calculateWPM();
				if (timeLeft <= 0) {
					endGame();
				}
			}, 1000);
		}
	}

	function endGame() {
		gameCompleted = true;
		gameStarted = false;
		clearInterval(timer);
		calculateFinalStats();
	}

	function resetGame() {
		clearInterval(timer);
		initializeGame();
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (gameCompleted) return;
		
		// Prevent default for most keys except special ones
		if (event.key.length === 1 || event.key === 'Backspace') {
			event.preventDefault();
		}

		if (!gameStarted) {
			startGame();
		}

		const expectedChar = currentText[currentIndex];

		if (event.key === 'Backspace') {
			if (currentIndex > 0) {
				currentIndex--;
				charStates[currentIndex] = 'current';
				if (currentIndex + 1 < charStates.length) {
					charStates[currentIndex + 1] = 'untyped';
				}
				charStates = [...charStates];
			}
		} else if (event.key.length === 1) {
			if (currentIndex < currentText.length) {
				if (event.key === expectedChar) {
					charStates[currentIndex] = 'correct';
					correctChars++;
				} else {
					charStates[currentIndex] = 'incorrect';
					incorrectChars++;
				}

				currentIndex++;
				
				if (currentIndex < currentText.length) {
					charStates[currentIndex] = 'current';
				} else {
					// Test completed
					endGame();
				}
				
				charStates = [...charStates];
				calculateAccuracy();
			}
		}
	}

	function calculateWPM() {
		if (startTime === 0) return;
		const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
		const wordsTyped = correctChars / 5; // Standard: 5 characters = 1 word
		wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
	}

	function calculateAccuracy() {
		const totalTyped = correctChars + incorrectChars;
		accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
	}

	function calculateFinalStats() {
		calculateWPM();
		calculateAccuracy();
	}

	function changeDifficulty(newDifficulty: Difficulty) {
		difficulty = newDifficulty;
		resetGame();
	}

	onMount(() => {
		initializeGame();
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			clearInterval(timer);
		};
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyPress);
		clearInterval(timer);
	});
</script>

<div class="typing-challenge">
	<div class="challenge-header">
		<h2>Speed Typing Challenge</h2>
		<div class="difficulty-selector">
			<span class="difficulty-label">Difficulty:</span>
			<div class="difficulty-buttons">
				<button 
					class="difficulty-btn" 
					class:active={difficulty === 'easy'}
					onclick={() => changeDifficulty('easy')}
				>
					Easy
				</button>
				<button 
					class="difficulty-btn" 
					class:active={difficulty === 'medium'}
					onclick={() => changeDifficulty('medium')}
				>
					Medium
				</button>
				<button 
					class="difficulty-btn" 
					class:active={difficulty === 'hard'}
					onclick={() => changeDifficulty('hard')}
				>
					Hard
				</button>
			</div>
		</div>
	</div>

	{#if !gameStarted && !gameCompleted}
		<div class="start-screen">
			<p>Click "Start Game" or start typing to begin</p>
			<button class="btn start-btn" onclick={startGame}>Start Game</button>
		</div>
	{/if}

	{#if gameStarted || gameCompleted}
		<div class="stats-bar">
			<div class="stat">
				<span class="stat-label">WPM</span>
				<span class="stat-value">{wpm}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Accuracy</span>
				<span class="stat-value">{accuracy}%</span>
			</div>
			<div class="stat">
				<span class="stat-label">Time</span>
				<span class="stat-value">{timeLeft}s</span>
			</div>
		</div>
	{/if}

	<div class="text-display">
		{#each currentText.split('') as char, index}
			<span 
				class="char {charStates[index]}"
				class:space={char === ' '}
			>
				{char === ' ' ? '·' : char}
			</span>
		{/each}
	</div>

	{#if gameCompleted}
		<div class="results">
			<h3>🎉 Test Complete!</h3>
			<div class="final-stats">
				<div class="stat-card">
					<div class="stat-number">{wpm}</div>
					<div class="stat-label">WPM</div>
				</div>
				<div class="stat-card">
					<div class="stat-number">{accuracy}%</div>
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
			<button class="btn" onclick={resetGame}>Try Again</button>
		</div>
	{/if}

	{#if gameStarted}
		<div class="instructions">
			<p>Type the text above. Use Backspace to correct mistakes.</p>
		</div>
	{/if}
</div>

<style>
	.typing-challenge {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		background: var(--secondary-bg);
		border-radius: 1rem;
		border: 1px solid var(--border-color);
	}

	.challenge-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.challenge-header h2 {
		color: var(--accent-cyan);
		margin: 0;
	}

	.difficulty-selector {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.difficulty-label {
		color: var(--accent-purple);
		font-weight: 600;
	}

	.difficulty-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.difficulty-btn {
		padding: 0.5rem 1rem;
		border: 2px solid var(--border-color);
		background: var(--primary-bg);
		color: var(--text-secondary);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.9rem;
	}

	.difficulty-btn:hover {
		border-color: var(--accent-cyan);
		color: var(--accent-cyan);
	}

	.difficulty-btn.active {
		border-color: var(--accent-purple);
		background: var(--accent-purple);
		color: white;
	}

	.start-screen {
		text-align: center;
		padding: 3rem 0;
		color: var(--text-secondary);
	}

	.start-btn {
		margin-top: 1rem;
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.stats-bar {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin-bottom: 2rem;
		padding: 1rem;
		background: var(--primary-bg);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.stat {
		text-align: center;
	}

	.stat-label {
		display: block;
		font-size: 0.8rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--accent-cyan);
	}

	.text-display {
		font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
		font-size: 1.5rem;
		line-height: 2;
		padding: 2rem;
		background: var(--primary-bg);
		border-radius: 0.5rem;
		border: 2px solid var(--border-color);
		margin-bottom: 2rem;
		word-wrap: break-word;
		overflow-wrap: break-word;
		position: relative;
	}

	.char {
		position: relative;
		transition: all 0.1s ease;
	}

	.char.untyped {
		color: var(--text-muted);
	}

	.char.correct {
		color: var(--text-primary);
		background-color: rgba(0, 255, 255, 0.1);
	}

	.char.incorrect {
		color: var(--accent-red);
		background-color: rgba(239, 68, 68, 0.2);
	}

	.char.current {
		background-color: var(--accent-cyan);
		color: var(--primary-bg);
		animation: cursor-blink 1s infinite;
	}

	.char.space.current {
		background-color: var(--accent-cyan);
		border-radius: 2px;
	}

	@keyframes cursor-blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0.7; }
	}

	.results {
		text-align: center;
		padding: 2rem;
		background: var(--primary-bg);
		border-radius: 1rem;
		border: 2px solid var(--accent-cyan);
		margin-top: 2rem;
	}

	.results h3 {
		color: var(--accent-cyan);
		margin-bottom: 2rem;
		font-size: 2rem;
	}

	.final-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: var(--secondary-bg);
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

	.instructions {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-top: 1rem;
	}

	@media (max-width: 768px) {
		.typing-challenge {
			padding: 1rem;
		}

		.challenge-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.text-display {
			font-size: 1.2rem;
			padding: 1rem;
		}

		.stats-bar {
			gap: 1.5rem;
		}

		.final-stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.text-display {
			font-size: 1rem;
		}

		.final-stats {
			grid-template-columns: 1fr;
		}
	}
</style>