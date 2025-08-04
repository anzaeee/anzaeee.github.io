<script lang="ts">
	import { goto } from '$app/navigation';

	const games = [
		{
			id: 'tictactoe',
			title: 'Cosmic Tic-Tac-Toe',
			description: 'Challenge the AI in this classic game with a stellar twist',
			icon: '🎮'
		},
		{
			id: 'typing',
			title: 'Speed Typing Challenge',
			description: 'Test your typing speed with real-time feedback',
			icon: '⌨️'
		},
		{
			id: 'ball-protector',
			title: 'Ball Protector',
			description: 'Protect the falling ball from hitting the ground!',
			icon: '🎯'
		},
		{
			id: 'hogwarts-runner',
			title: 'Hogwarts Runner',
			description: 'Jump over flying books in this magical endless runner',
			icon: '🧙‍♂️'
		}
	];

	function navigateToGame(gameId: string) {
		goto(`/games/${gameId}`);
	}

	let isMobile = false;
	function checkMobile() {
		isMobile = window.innerWidth <= 768;
	}

	if (typeof window !== 'undefined') {
		checkMobile();
		window.addEventListener('resize', checkMobile);
	}
</script>

<div class="projects-page">
	<div class="container">
		<div class="page-header fade-in-up">
			<h1>Projects & Games</h1>
			<p>Interactive experiences and coding challenges</p>
		</div>

		<div class="games-grid">
			{#if isMobile}
				{#each games.filter(g => g.id === 'tictactoe') as game}
					<button 
						class="game-card" 
						on:click={() => navigateToGame(game.id)}
						on:keydown={(e) => e.key === 'Enter' && navigateToGame(game.id)}
					>
						<div class="game-icon">{game.icon}</div>
						<h2>{game.title}</h2>
						<p>{game.description}</p>
					</button>
				{/each}
			{:else}
				{#each games as game}
					<button 
						class="game-card" 
						on:click={() => navigateToGame(game.id)}
						on:keydown={(e) => e.key === 'Enter' && navigateToGame(game.id)}
					>
						<div class="game-icon">{game.icon}</div>
						<h2>{game.title}</h2>
						<p>{game.description}</p>
					</button>
				{/each}
			{/if}
		</div>

		<div class="coming-soon">
			<div class="card">
				<h3>More Projects Coming Soon</h3>
				<p>Stay tuned for more interactive experiences, coding challenges, and creative projects!</p>
				<div class="project-ideas">
					<div class="idea-item">🧩 Algorithm Visualizer</div>
					<div class="idea-item">🎨 Generative Art Gallery</div>
					<div class="idea-item">📊 Data Visualization Playground</div>
				</div>
			</div>
		</div>
	</div>
	
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

	.games-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto 4rem;
		padding: 0 1rem;
	}

	.game-card {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 2rem;
		border: 1px solid var(--border-color);
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.game-card:hover {
		transform: translateY(-5px);
		border-color: var(--accent-cyan);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.game-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.game-card h2 {
		color: var(--accent-cyan);
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.game-card p {
		color: var(--text-secondary);
		font-size: 1rem;
		line-height: 1.5;
	}

	.coming-soon {
		opacity: 0;
		animation: fadeInUp 0.6s ease-out 0.5s forwards;
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.card {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 3rem;
		border: 1px solid var(--border-color);
		text-align: center;
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
		.games-grid {
			grid-template-columns: 1fr;
			padding: 0 2rem;
		}

		.game-card {
			padding: 1.5rem;
		}

		.coming-soon {
			padding: 0 2rem;
		}

		.card {
			padding: 2rem;
		}

		.project-ideas {
			grid-template-columns: 1fr;
		}
	}
</style>