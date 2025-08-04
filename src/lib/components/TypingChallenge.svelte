<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let initialText: string[] = ['The quick brown fox jumps over the lazy dog.'];

	let words: string[] = [];
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
	let typingCompleted = false;
	let typingStarted = false;
	let typingTimer: number;

	onMount(() => {
		resetGame();
		if (typingInput) {
			typingInput.focus();
		}
	});

	onDestroy(() => {
		clearInterval(typingTimer);
	});

	function resetGame() {
		words = initialText[0].split(' ');
		currentWordIndex = 0;
		currentCharIndex = 0;
		currentInput = '';
		startTime = 0;
		currentWPM = 0;
		accuracy = 100;
		correctChars = 0;
		incorrectChars = 0;
		totalChars = 0;
		typingCompleted = false;
		typingStarted = false;
		clearInterval(typingTimer);
	}

	function startTimer() {
		if (!typingStarted) {
			typingStarted = true;
			startTime = Date.now();
			typingTimer = setInterval(() => {
				updateWPM();
			}, 1000);
		}
	}

	function handleTypingInput(event: Event) {
		startTimer();

		const inputElement = event.target as HTMLInputElement;
		currentInput = inputElement.value;

		const expectedWord = words[currentWordIndex];
		const typedWord = currentInput;

		// Check for word completion
		if (typedWord.endsWith(' ')) {
			// Process completed word
			const finalTypedWord = typedWord.trim();
			const finalExpectedWord = expectedWord;

			for (let i = 0; i < finalExpectedWord.length; i++) {
				if (i < finalTypedWord.length && finalTypedWord[i] === finalExpectedWord[i]) {
					correctChars++;
				} else {
					incorrectChars++;
				}
				totalChars++;
			}
			// Account for extra characters typed
			if (finalTypedWord.length > finalExpectedWord.length) {
				incorrectChars += (finalTypedWord.length - finalExpectedWord.length);
				totalChars += (finalTypedWord.length - finalExpectedWord.length);
			}

			currentWordIndex++;
			currentCharIndex = 0;
			currentInput = '';

			// Check if game is completed
			if (currentWordIndex >= words.length) {
				typingCompleted = true;
				clearInterval(typingTimer);
				updateWPM();
			}
		}

		updateAccuracy();
	}

	function updateWPM() {
		if (startTime === 0) return;
		const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
		const wordsTyped = correctChars / 5; // A common approximation for WPM
		currentWPM = timeElapsed > 0 ? wordsTyped / timeElapsed : 0;
	}

	function updateAccuracy() {
		if (totalChars === 0) {
			accuracy = 100;
			return;
		}
		accuracy = (correctChars / totalChars) * 100;
	}

	function getCharClass(wordIndex: number, charIndex: number, char: string) {
		const currentWord = words[currentWordIndex];
		if (wordIndex === currentWordIndex) {
			if (charIndex < currentInput.length) {
				return currentInput[charIndex] === char ? 'correct' : 'incorrect';
			}
		} else if (wordIndex < currentWordIndex) {
			return 'correct'; // Already typed words are considered correct for display
		}
		return '';
	}
</script>

<div class="typing-challenge-container">
	{#if !typingStarted && !typingCompleted}
		<div class="start-overlay">
			<h3>Speed Typing Challenge</h3>
			<p>Type the words below as fast and accurately as you can.</p>
			<button class="btn" on:click={startTimer}>Start Typing</button>
		</div>
	{/if}

	<div class="words-display">
		{#each words as word, wordIndex}
			<span class="word" class:current={wordIndex === currentWordIndex}>
				{#each word.split('') as char, charIndex}
					<span class="char {getCharClass(wordIndex, charIndex, char)} {wordIndex < currentWordIndex ? 'typed' : ''} {wordIndex === currentWordIndex && charIndex < currentInput.length ? 'typed' : ''}">
						{char}
					</span>
				{/each}
				{#if wordIndex === currentWordIndex && currentInput.length > word.length}
					{#each currentInput.substring(word.length).split('') as extraChar}
						<span class="char incorrect extra">{extraChar}</span>
					{/each}
				{/if}
			</span>
		{/each}
	</div>

	<input
		bind:this={typingInput}
		bind:value={currentInput}
		on:input={handleTypingInput}
		class="typing-input"
		placeholder="Start typing..."
		disabled={typingCompleted}
	/>

	{#if typingCompleted}
		<div class="results">
			<h3>Results</h3>
			<p>WPM: {Math.round(currentWPM)}</p>
			<p>Accuracy: {accuracy.toFixed(2)}%</p>
			<button class="btn" on:click={resetGame}>Try Again</button>
		</div>
	{/if}
</div>

<style>
	.typing-challenge-container {
		position: relative;
		background-color: var(--secondary-bg);
		border-radius: 1rem;
		padding: 2rem;
		border: 1px solid var(--border-color);
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.words-display {
		font-size: 1.3rem;
		line-height: 2;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		background-color: var(--primary-bg);
		padding: 1rem;
		border-radius: 0.8rem;
		border: 1px solid var(--border-color);
		text-align: left;
		word-break: break-word;
		max-width: 100%;
		overflow-x: auto;
	}

	.word {
		margin-right: 0.5rem;
		position: relative;
	}

	.word.current {
		background-color: rgba(var(--accent-cyan-rgb,0,255,255), 0.2);
		border-radius: 0.3rem;
		padding: 0 0.2rem;
	}

	.word span {
		transition: color 0.1s ease;
	}

	.correct {
		color: var(--accent-green);
	}

	.incorrect {
		color: var(--accent-red);
		text-decoration: underline;
	}

	.extra {
		background-color: var(--accent-red);
		color: white;
		padding: 0 2px;
		border-radius: 3px;
	}

	.typing-input {
		width: calc(100% - 2rem);
		padding: 1rem;
		font-size: 1.2rem;
		border: 2px solid var(--border-color);
		border-radius: 0.5rem;
		background-color: var(--primary-bg);
		color: var(--text-primary);
		outline: none;
		transition: border-color 0.3s ease;
	}

	.typing-input:focus {
		border-color: var(--accent-purple);
	}

	.typing-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.results {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: var(--primary-bg);
		border-radius: 1rem;
		border: 1px solid var(--border-color);
	}

	.results h3 {
		font-size: 2rem;
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.results p {
		font-size: 1.2rem;
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

	.start-overlay {
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

	.start-overlay h3 {
		font-size: 2.5rem;
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.start-overlay p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
	}
	@media (max-width: 600px) {
		.typing-challenge-container {
			padding: 1rem;
		}
		.words-display {
			font-size: 1rem;
			padding: 0.5rem;
		}
		.typing-input {
			font-size: 1rem;
			padding: 0.7rem;
		}
	}
</style>