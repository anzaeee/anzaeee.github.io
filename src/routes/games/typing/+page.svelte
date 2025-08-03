<script lang="ts">
	import { onMount } from 'svelte';
	import typingData from '$lib/typing-data.json';
	import TypingChallenge from '$lib/components/TypingChallenge.svelte';
</script>

<div class="typing-game">
	<TypingChallenge />
</div>

<style>
	.typing-game {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}
</style>