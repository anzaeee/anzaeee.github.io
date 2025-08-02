<script lang="ts">
	import { onMount } from 'svelte';
	import contactData from '$lib/contact-data.json';

	type GameType = 'riddles' | 'wordScramble' | 'codeBreaker';
	type GameState = 'menu' | 'playing' | 'completed';

	let gameState: GameState = 'menu';
	let currentGame: GameType = 'riddles';
	let currentQuestionIndex = 0;
	let userAnswer = '';
	let showHint = false;
	let gameScore = 0;
	let totalQuestions = 0;
	let discoveredInfo: Record<string, string> = {};
	let showSuccess = false;
	let attemptsLeft = 3;

	// Animation states
	let questionVisible = false;
	let celebrating = false;

	$: currentQuestions = contactData.games[currentGame];
	$: currentQuestion = currentQuestions[currentQuestionIndex];
	$: progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
	$: discoveredCount = Object.keys(discoveredInfo).length;

	// Cipher decoding function
	function decodeCipher(encoded: string, cipher: string): string {
		if (cipher.includes('ROT-5')) {
			return encoded.split('').map(char => {
				if (char.match(/[a-z]/)) {
					return String.fromCharCode(((char.charCodeAt(0) - 97 - 5 + 26) % 26) + 97);
				}
				return char;
			}).join('');
		} else if (cipher.includes('A=1')) {
			return encoded.split(/[\s-]+/).map(num => {
				const n = parseInt(num);
				return n >= 1 && n <= 26 ? String.fromCharCode(64 + n) : '';
			}).join(' ');
		}
		return encoded;
	}

	function startGame(game: GameType) {
		currentGame = game;
		currentQuestionIndex = 0;
		gameState = 'playing';
		userAnswer = '';
		showHint = false;
		gameScore = 0;
		attemptsLeft = 3;
		totalQuestions = currentQuestions.length;
		
		setTimeout(() => {
			questionVisible = true;
		}, 300);
	}

	function submitAnswer() {
		if (!userAnswer.trim()) return;

		const correct = checkAnswer(userAnswer.trim(), currentQuestion);
		
		if (correct) {
			gameScore++;
			discoveredInfo[currentQuestion.reveal] = currentQuestion.value;
			showSuccess = true;
			celebrating = true;
			
			setTimeout(() => {
				showSuccess = false;
				celebrating = false;
				nextQuestion();
			}, 2000);
		} else {
			attemptsLeft--;
			if (attemptsLeft <= 0) {
				// Show answer and move to next
				discoveredInfo[currentQuestion.reveal] = currentQuestion.value;
				setTimeout(() => {
					nextQuestion();
				}, 1500);
			}
			userAnswer = '';
		}
	}

	function checkAnswer(answer: string, question: any): boolean {
		const cleanAnswer = answer.toLowerCase().replace(/[^a-z0-9\s]/g, '');
		const correctAnswer = question.answer.toLowerCase().replace(/[^a-z0-9\s]/g, '');
		
		return cleanAnswer === correctAnswer;
	}

	function nextQuestion() {
		if (currentQuestionIndex < currentQuestions.length - 1) {
			currentQuestionIndex++;
			userAnswer = '';
			showHint = false;
			attemptsLeft = 3;
			questionVisible = false;
			
			setTimeout(() => {
				questionVisible = true;
			}, 300);
		} else {
			completeGame();
		}
	}

	function completeGame() {
		gameState = 'completed';
		questionVisible = false;
	}

	function resetGame() {
		gameState = 'menu';
		currentQuestionIndex = 0;
		userAnswer = '';
		showHint = false;
		gameScore = 0;
		questionVisible = false;
		celebrating = false;
		showSuccess = false;
		attemptsLeft = 3;
	}

	function revealHint() {
		showHint = true;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && gameState === 'playing') {
			submitAnswer();
		}
	}

	function showAllInfo() {
		// Show all contact information without playing games
		discoveredInfo = {
			'Full Name': contactData.personalInfo.name,
			'Email Address': contactData.personalInfo.email,
			'Phone Number': contactData.personalInfo.phone,
			'Location': contactData.personalInfo.location,
			'Profession': contactData.personalInfo.profession,
			'Current Company': contactData.personalInfo.company,
			'LinkedIn Profile': contactData.personalInfo.linkedin,
			'GitHub Profile': contactData.personalInfo.github,
			'Website': contactData.personalInfo.website
		};
	}

	onMount(() => {
		window.addEventListener('keypress', handleKeyPress);
		return () => {
			window.removeEventListener('keypress', handleKeyPress);
		};
	});
</script>

<div class="contact-page">
	<div class="container">
		<div class="page-header fade-in-up">
			<h1>Contact Quest</h1>
			<p>Solve puzzles and games to discover my contact information</p>
		</div>

		<div class="game-interface">
			{#if gameState === 'menu'}
				<div class="game-menu">
					<div class="discovery-progress">
						<h3>🔍 Information Discovered: {discoveredCount}/9</h3>
						<div class="progress-bar">
							<div 
								class="progress-fill" 
								style="width: {(discoveredCount / 9) * 100}%"
							></div>
						</div>
					</div>

					<div class="discovered-info">
						{#each Object.entries(discoveredInfo) as [key, value]}
							<div class="info-item">
								<span class="info-key">{key}:</span>
								<span class="info-value">{value}</span>
							</div>
						{/each}
					</div>

					<div class="game-selection">
						<h3>Choose Your Challenge</h3>
						<div class="skip-games">
							<button class="btn skip-btn" on:click={showAllInfo}>
								🎯 Just Show Me Everything
							</button>
							<p class="skip-text">Skip the games and view all contact information directly</p>
						</div>
						<div class="divider">
							<span>OR</span>
						</div>
						<h4>Earn Contact Info Through Games</h4>
						<div class="game-options">
							<button 
								class="game-btn riddles"
								on:click={() => startGame('riddles')}
							>
								<div class="game-icon">🧩</div>
								<div class="game-name">Riddle Master</div>
								<div class="game-desc">Solve clever riddles to find my contact info</div>
								<div class="game-questions">{contactData.games.riddles.length} questions</div>
							</button>

							<button 
								class="game-btn word-scramble"
								on:click={() => startGame('wordScramble')}
							>
								<div class="game-icon">🔤</div>
								<div class="game-name">Word Detective</div>
								<div class="game-desc">Unscramble words to reveal personal details</div>
								<div class="game-questions">{contactData.games.wordScramble.length} puzzles</div>
							</button>

							<button 
								class="game-btn code-breaker"
								on:click={() => startGame('codeBreaker')}
							>
								<div class="game-icon">🔐</div>
								<div class="game-name">Code Breaker</div>
								<div class="game-desc">Decode secret messages using ciphers</div>
								<div class="game-questions">{contactData.games.codeBreaker.length} codes</div>
							</button>
						</div>
					</div>

					{#if discoveredCount >= 6}
						<div class="contact-unlocked">
							<h3>🎉 Congratulations!</h3>
							<p>You've discovered enough information to contact me directly!</p>
							<div class="contact-methods">
								<a href="mailto:{contactData.personalInfo.email}" class="contact-btn email">
									📧 Send Email
								</a>
								<a href="tel:{contactData.personalInfo.phone}" class="contact-btn phone">
									📞 Call Me
								</a>
								<a href={contactData.socialLinks.linkedin} target="_blank" class="contact-btn linkedin">
									💼 LinkedIn
								</a>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if gameState === 'playing'}
				<div class="game-area">
					<div class="game-header">
						<h2>
							{#if currentGame === 'riddles'}🧩 Riddle Master
							{:else if currentGame === 'wordScramble'}🔤 Word Detective
							{:else}🔐 Code Breaker{/if}
						</h2>
						<div class="game-progress">
							Question {currentQuestionIndex + 1} of {totalQuestions}
						</div>
					</div>

					<div class="progress-bar">
						<div 
							class="progress-fill" 
							style="width: {progressPercent}%"
						></div>
					</div>

					<div class="question-area" class:visible={questionVisible}>
						{#if currentGame === 'riddles'}
							<div class="riddle-question">
								<h3>🤔 Riddle Time!</h3>
								<p class="question-text">{currentQuestion.question}</p>
							</div>
						{:else if currentGame === 'wordScramble'}
							<div class="scramble-question">
								<h3>🔤 Unscramble This!</h3>
								<div class="scrambled-word">{currentQuestion.scrambled}</div>
								<p class="question-text">Hint: {currentQuestion.hint}</p>
							</div>
						{:else}
							<div class="code-question">
								<h3>🔐 Decode This Message!</h3>
								<div class="encoded-text">{currentQuestion.encoded}</div>
								<p class="cipher-info">Cipher: {currentQuestion.cipher}</p>
								<p class="question-text">Hint: {currentQuestion.hint}</p>
							</div>
						{/if}

						<div class="answer-section">
							<input 
								bind:value={userAnswer}
								placeholder="Enter your answer..."
								class="answer-input"
								class:error={attemptsLeft < 3}
							/>
							<button class="btn submit-btn" on:click={submitAnswer}>
								Submit Answer
							</button>
						</div>

						<div class="game-controls">
							<div class="attempts">
								Attempts left: 
								{#each Array(attemptsLeft) as _}
									<span class="attempt-heart">💖</span>
								{/each}
								{#each Array(3 - attemptsLeft) as _}
									<span class="attempt-heart lost">💔</span>
								{/each}
							</div>

							{#if !showHint}
								<button class="btn btn-outline hint-btn" on:click={revealHint}>
									💡 Need a Hint?
								</button>
							{:else}
								<div class="hint">
									💡 Hint: {currentQuestion.hint}
								</div>
							{/if}

							<button class="btn btn-outline" on:click={resetGame}>
								🏠 Back to Menu
							</button>
						</div>
					</div>

					{#if showSuccess}
						<div class="success-message" class:celebrating>
							<h3>🎉 Correct!</h3>
							<p>You discovered: <strong>{currentQuestion.reveal}</strong></p>
							<p class="revealed-value">{currentQuestion.value}</p>
						</div>
					{/if}

					{#if attemptsLeft <= 0 && !showSuccess}
						<div class="failure-message">
							<h3>😅 Out of attempts!</h3>
							<p>Here's the answer: <strong>{currentQuestion.reveal}</strong></p>
							<p class="revealed-value">{currentQuestion.value}</p>
						</div>
					{/if}
				</div>
			{/if}

			{#if gameState === 'completed'}
				<div class="completion-screen">
					<h2>🎯 Game Complete!</h2>
					<div class="final-score">
						<div class="score-item">
							<div class="score-value">{gameScore}</div>
							<div class="score-label">Correct Answers</div>
						</div>
						<div class="score-item">
							<div class="score-value">{Math.round((gameScore / totalQuestions) * 100)}%</div>
							<div class="score-label">Success Rate</div>
						</div>
						<div class="score-item">
							<div class="score-value">{discoveredCount}</div>
							<div class="score-label">Info Discovered</div>
						</div>
					</div>

					<div class="completion-actions">
						<button class="btn" on:click={resetGame}>
							🎮 Play More Games
						</button>
						{#if discoveredCount >= 6}
							<a href="mailto:{contactData.personalInfo.email}" class="btn">
								📧 Contact Me Now
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		{#if discoveredCount < 6}
			<div class="encouragement">
				<div class="card">
					<h3>🎯 Keep Going!</h3>
					<p>You need to discover at least 6 pieces of information to unlock direct contact methods.</p>
					<p>Current progress: {discoveredCount}/6</p>
				</div>
			</div>
		{:else}
			<div class="direct-contact">
				<div class="card">
					<h3>🎉 You've Unlocked Direct Contact!</h3>
					<p>Congratulations on your detective skills! Here are all my contact details:</p>
					
					<div class="full-contact-info">
						<div class="contact-detail">
							<strong>Name:</strong> {contactData.personalInfo.name}
						</div>
						<div class="contact-detail">
							<strong>Email:</strong> 
							<a href="mailto:{contactData.personalInfo.email}">{contactData.personalInfo.email}</a>
						</div>
						<div class="contact-detail">
							<strong>Phone:</strong> 
							<a href="tel:{contactData.personalInfo.phone}">{contactData.personalInfo.phone}</a>
						</div>
						<div class="contact-detail">
							<strong>Location:</strong> {contactData.personalInfo.location}
						</div>
						<div class="contact-detail">
							<strong>Profession:</strong> {contactData.personalInfo.profession}
						</div>
						<div class="contact-detail">
							<strong>Company:</strong> {contactData.personalInfo.company}
						</div>
					</div>

					<div class="social-links">
						<a href={contactData.socialLinks.github} target="_blank" class="social-btn github">
							🐙 GitHub
						</a>
						<a href={contactData.socialLinks.linkedin} target="_blank" class="social-btn linkedin">
							💼 LinkedIn
						</a>
						<a href={contactData.socialLinks.website} target="_blank" class="social-btn website">
							🌐 Website
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Background effects -->
	<div class="puzzle-pieces">
		{#each Array(8) as _, i}
			<div class="puzzle-piece piece-{i + 1}"></div>
		{/each}
	</div>
</div>

<style>
	.contact-page {
		position: relative;
		min-height: 100vh;
		padding: 2rem 0;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.game-interface {
		max-width: 1000px;
		margin: 0 auto;
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 3rem;
		border: 1px solid var(--border-color);
		margin-bottom: 3rem;
	}

	.discovery-progress {
		text-align: center;
		margin-bottom: 2rem;
	}

	.discovery-progress h3 {
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.progress-bar {
		width: 100%;
		height: 12px;
		background: var(--primary-bg);
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 2rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		transition: width 0.5s ease;
	}

	.discovered-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.info-item {
		background: var(--primary-bg);
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		animation: fadeInUp 0.5s ease-out;
	}

	.info-key {
		color: var(--accent-purple);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.info-value {
		color: var(--accent-cyan);
		font-weight: 500;
	}

	.game-selection h3 {
		text-align: center;
		color: var(--accent-purple);
		margin-bottom: 2rem;
	}

	.skip-games {
		text-align: center;
		margin-bottom: 2rem;
		padding: 2rem;
		background: var(--primary-bg);
		border-radius: 1rem;
		border: 2px solid var(--accent-cyan);
	}

	.skip-btn {
		font-size: 1.1rem;
		padding: 1rem 2rem;
		margin-bottom: 1rem;
	}

	.skip-text {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.divider {
		text-align: center;
		position: relative;
		margin: 2rem 0;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--border-color);
		z-index: 1;
	}

	.divider span {
		background: var(--secondary-bg);
		color: var(--text-muted);
		padding: 0 1rem;
		position: relative;
		z-index: 2;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.game-selection h4 {
		text-align: center;
		color: var(--accent-cyan);
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.game-options {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.game-btn {
		background: var(--primary-bg);
		border: 2px solid var(--border-color);
		border-radius: 1rem;
		padding: 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: center;
	}

	.game-btn:hover {
		border-color: var(--accent-cyan);
		transform: translateY(-4px);
		box-shadow: 0 10px 25px rgba(0, 255, 255, 0.2);
	}

	.game-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.game-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--accent-cyan);
		margin-bottom: 0.5rem;
	}

	.game-desc {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		line-height: 1.4;
	}

	.game-questions {
		color: var(--accent-purple);
		font-size: 0.9rem;
		font-weight: 600;
	}

	.game-area {
		animation: fadeInUp 0.5s ease-out;
	}

	.game-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.game-header h2 {
		color: var(--accent-cyan);
		margin-bottom: 0.5rem;
	}

	.game-progress {
		color: var(--text-secondary);
		font-size: 1.1rem;
	}

	.question-area {
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.5s ease;
		text-align: center;
	}

	.question-area.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.riddle-question, .scramble-question, .code-question {
		margin-bottom: 2rem;
	}

	.riddle-question h3, .scramble-question h3, .code-question h3 {
		color: var(--accent-purple);
		margin-bottom: 1.5rem;
	}

	.question-text {
		font-size: 1.2rem;
		color: var(--text-primary);
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.scrambled-word, .encoded-text {
		font-family: 'Fira Code', monospace;
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--accent-cyan);
		background: var(--primary-bg);
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		margin: 1rem 0;
		letter-spacing: 0.2em;
		border: 2px solid var(--border-color);
	}

	.cipher-info {
		font-style: italic;
		color: var(--text-muted);
		margin-bottom: 1rem;
	}

	.answer-section {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.answer-input {
		min-width: 300px;
		padding: 1rem;
		font-size: 1.1rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.answer-input.error {
		border-color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
	}

	.submit-btn {
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.game-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.attempts {
		color: var(--text-secondary);
		font-weight: 600;
	}

	.attempt-heart {
		margin-left: 0.25rem;
	}

	.attempt-heart.lost {
		opacity: 0.3;
	}

	.hint {
		background: var(--primary-bg);
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		border: 2px solid var(--accent-purple);
		color: var(--accent-purple);
		font-weight: 600;
	}

	.success-message, .failure-message {
		text-align: center;
		padding: 2rem;
		border-radius: 1rem;
		margin-top: 2rem;
		animation: fadeInUp 0.5s ease-out;
	}

	.success-message {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		color: var(--primary-bg);
	}

	.success-message.celebrating {
		animation: pulse 0.6s ease-in-out;
	}

	.failure-message {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border: 2px solid #ef4444;
	}

	.revealed-value {
		font-size: 1.2rem;
		font-weight: 700;
		margin-top: 1rem;
	}

	.completion-screen {
		text-align: center;
		animation: fadeInUp 0.5s ease-out;
	}

	.completion-screen h2 {
		color: var(--accent-cyan);
		margin-bottom: 2rem;
	}

	.final-score {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 2rem 0;
		flex-wrap: wrap;
	}

	.score-item {
		text-align: center;
	}

	.score-value {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.5rem;
	}

	.score-label {
		color: var(--text-muted);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.completion-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}

	.contact-unlocked {
		background: var(--primary-bg);
		border-radius: 1rem;
		padding: 2rem;
		border: 2px solid var(--accent-cyan);
		text-align: center;
		animation: fadeInUp 0.5s ease-out;
	}

	.contact-unlocked h3 {
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.contact-methods {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	.contact-btn {
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.contact-btn.email {
		background: var(--accent-cyan);
		color: var(--primary-bg);
	}

	.contact-btn.phone {
		background: var(--accent-purple);
		color: var(--primary-bg);
	}

	.contact-btn.linkedin {
		background: #0077b5;
		color: white;
	}

	.contact-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
	}

	.encouragement, .direct-contact {
		max-width: 800px;
		margin: 2rem auto;
	}

	.full-contact-info {
		margin: 2rem 0;
		text-align: left;
	}

	.contact-detail {
		margin-bottom: 1rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.contact-detail strong {
		color: var(--accent-purple);
		margin-right: 1rem;
	}

	.contact-detail a {
		color: var(--accent-cyan);
		text-decoration: none;
	}

	.contact-detail a:hover {
		text-decoration: underline;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}

	.social-btn {
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		color: var(--text-primary);
		border: 2px solid var(--border-color);
	}

	.social-btn:hover {
		border-color: var(--accent-cyan);
		transform: translateY(-2px);
	}

	/* Background puzzle pieces */
	.puzzle-pieces {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.puzzle-piece {
		position: absolute;
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		opacity: 0.1;
		border-radius: 20% 80% 20% 80%;
		animation: puzzle-float 10s ease-in-out infinite;
	}

	.piece-1 { top: 15%; left: 10%; animation-delay: 0s; }
	.piece-2 { top: 30%; right: 15%; animation-delay: 2s; }
	.piece-3 { top: 60%; left: 20%; animation-delay: 4s; }
	.piece-4 { top: 80%; right: 25%; animation-delay: 6s; }
	.piece-5 { top: 10%; right: 40%; animation-delay: 8s; }
	.piece-6 { bottom: 20%; left: 30%; animation-delay: 10s; }
	.piece-7 { top: 45%; left: 5%; animation-delay: 12s; }
	.piece-8 { bottom: 10%; right: 10%; animation-delay: 14s; }

	@keyframes puzzle-float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-30px) rotate(180deg); }
	}

	@media (max-width: 768px) {
		.game-interface {
			padding: 2rem 1rem;
		}
		
		.game-options {
			grid-template-columns: 1fr;
		}
		
		.answer-section {
			flex-direction: column;
		}
		
		.answer-input {
			min-width: 100%;
		}
		
		.game-controls {
			flex-direction: column;
			gap: 1rem;
		}
		
		.final-score {
			gap: 2rem;
		}
		
		.contact-methods, .social-links {
			flex-direction: column;
		}
		
		.completion-actions {
			flex-direction: column;
		}
	}
</style>