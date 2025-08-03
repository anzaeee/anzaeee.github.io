<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	interface PageParams {
		gameId?: string;
	}

	const params = $page.params as PageParams;
	const gameId = params.gameId || '';
	const gameTitle = gameId
		.split('-')
		.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
</script>

<div class="game-page">
	<div class="game-header">
		<button class="back-button" on:click={() => goto('/projects')}>
			← Back to Projects
		</button>
		<h1>{gameTitle}</h1>
	</div>

	<div class="game-container">
		<slot />
	</div>
</div>

<style>
	.game-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.game-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.back-button {
		background: none;
		border: none;
		color: var(--accent-cyan);
		font-size: 1.1rem;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
	}

	.back-button:hover {
		background: var(--secondary-bg);
		transform: translateX(-5px);
	}

	h1 {
		font-size: 2.5rem;
		color: var(--text-primary);
		margin: 0;
	}

	.game-container {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 2rem;
		border: 1px solid var(--border-color);
		min-height: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 768px) {
		.game-page {
			padding: 1rem;
		}

		.game-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>