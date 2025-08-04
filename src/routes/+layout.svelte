<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	let { children } = $props();

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Resume', href: '/resume' },
		{ name: 'Contact', href: '/contact' }
	];
	export const prerender = true;

	const menuOpen = writable(false);
	function closeMenu() { menuOpen.set(false); }
	function toggleMenu() { menuOpen.update(v => !v); }
</script>

<svelte:head>
	<title>Shanzay Asad | Product Engineer</title>
	<meta name="description" content="A modern dark portfolio showcasing development projects and skills" />
	<link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
</svelte:head>

<div class="app">
	<nav class="navbar">
		<div class="container">
			<div class="nav-content">
				<div class="logo">
					<a href="/" class="logo-link">
						<span class="logo-text">Shanzay Asad</span>
					</a>
				</div>
				
				<div class="nav-links { $menuOpen ? 'open' : '' }">
					{#each navItems as item}
						<a 
							href={item.href} 
							class="nav-link"
							class:active={$page.url.pathname === item.href}
							onclick={closeMenu}
						>
							{item.name}
						</a>
					{/each}
				</div>
				
				<button class="mobile-menu-btn" onclick={toggleMenu} aria-label="Open navigation" type="button">
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>
		</div>
	</nav>

	<main class="main-content">
		{@render children?.()}
	</main>

	<footer class="footer">
		<div class="container">
			<div class="footer-content">
				<p>&copy; 2025 Portfolio. Built with Svelte, Vercel & passion.</p>
				<div class="footer-links">
					<a href="https://github.com/anzaeee" target="_blank" rel="noopener noreferrer">GitHub</a>
					<a href="https://www.linkedin.com/in/anzay/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				</div>
			</div>
		</div>
	</footer>

	{#if $menuOpen}
		<button class="mobile-backdrop" onclick={closeMenu} aria-label="Close navigation" type="button"></button>
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background-color: var(--secondary-bg);
		border-bottom: 1px solid var(--border-color);
		padding: 1rem 0;
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(10px);
	}

	.nav-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo-link {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-links.open {
		display: flex !important;
		flex-direction: column;
		position: absolute;
		top: 100%;
		left: 0;
		width: 100vw;
		background: var(--secondary-bg);
		z-index: 200;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0,0,0,0.2);
		gap: 1.5rem;
		align-items: flex-start;
		border-top: 1px solid var(--border-color);
	}

	.nav-links.open .nav-link {
		width: 100%;
		padding: 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		border: 1px solid transparent;
	}

	.nav-links.open .nav-link:hover {
		background-color: var(--hover-bg);
		border-color: var(--accent-cyan);
	}

	.mobile-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.3);
		z-index: 150;
		border: none;
		cursor: pointer;
	}

	.mobile-menu-btn {
		display: none;
		flex-direction: column;
		cursor: pointer;
		gap: 4px;
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: background-color 0.3s ease;
	}

	.mobile-menu-btn:hover {
		background-color: var(--hover-bg);
	}

	.mobile-menu-btn span {
		width: 25px;
		height: 3px;
		background: var(--accent-cyan);
		transition: all 0.3s ease;
		border-radius: 2px;
	}

	.main-content {
		flex: 1;
		padding: 2rem 0;
	}

	.footer {
		background-color: var(--secondary-bg);
		border-top: 1px solid var(--border-color);
		padding: 2rem 0;
		margin-top: 4rem;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-links {
		display: flex;
		gap: 2rem;
	}

	.footer-links a {
		color: var(--text-secondary);
		transition: color 0.3s ease;
	}

	.footer-links a:hover {
		color: var(--accent-cyan);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
		.nav-links.open {
			display: flex !important;
		}
		.mobile-menu-btn {
			display: flex;
		}

		.footer-content {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
