<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Resume', href: '/resume' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Blog', href: '/blog' }
	];
</script>

<svelte:head>
	<title>Portfolio | Developer & Creator</title>
	<meta name="description" content="A modern dark portfolio showcasing development projects and skills" />
	<link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
</svelte:head>

<div class="app">
	<nav class="navbar">
		<div class="container">
			<div class="nav-content">
				<div class="logo">
					<a href="/" class="logo-link">
						<span class="logo-text">Portfolio</span>
					</a>
				</div>
				
				<div class="nav-links">
					{#each navItems as item}
						<a 
							href={item.href} 
							class="nav-link"
							class:active={$page.url.pathname === item.href}
						>
							{item.name}
						</a>
					{/each}
				</div>
				
				<div class="mobile-menu-btn">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	</nav>

	<main class="main-content">
		{@render children?.()}
	</main>

	<footer class="footer">
		<div class="container">
			<div class="footer-content">
				<p>&copy; 2024 Portfolio. Built with Svelte & passion.</p>
				<div class="footer-links">
					<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
					<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
				</div>
			</div>
		</div>
	</footer>
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

	.mobile-menu-btn {
		display: none;
		flex-direction: column;
		cursor: pointer;
		gap: 4px;
	}

	.mobile-menu-btn span {
		width: 25px;
		height: 3px;
		background: var(--accent-cyan);
		transition: all 0.3s ease;
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
