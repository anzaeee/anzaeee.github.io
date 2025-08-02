<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let stars: Star[] = [];
	let galaxies: Galaxy[] = [];
	let animationId: number;

	interface Star {
		x: number;
		y: number;
		size: number;
		opacity: number;
		twinkle: number;
		speed: number;
	}

	interface Galaxy {
		x: number;
		y: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
		opacity: number;
	}

	// Get current month's horoscope theme
	function getHoroscopeTheme() {
		const month = new Date().getMonth();
		const themes = [
			{ name: 'Capricorn', starCount: 150, galaxyCount: 3, color: '#00ffff' }, // Jan
			{ name: 'Aquarius', starCount: 200, galaxyCount: 4, color: '#8b5cf6' }, // Feb
			{ name: 'Pisces', starCount: 180, galaxyCount: 5, color: '#06b6d4' }, // Mar
			{ name: 'Aries', starCount: 120, galaxyCount: 2, color: '#ef4444' }, // Apr
			{ name: 'Taurus', starCount: 160, galaxyCount: 3, color: '#10b981' }, // May
			{ name: 'Gemini', starCount: 220, galaxyCount: 6, color: '#f59e0b' }, // Jun
			{ name: 'Cancer', starCount: 140, galaxyCount: 4, color: '#6366f1' }, // Jul
			{ name: 'Leo', starCount: 180, galaxyCount: 3, color: '#eab308' }, // Aug
			{ name: 'Virgo', starCount: 160, galaxyCount: 2, color: '#84cc16' }, // Sep
			{ name: 'Libra', starCount: 190, galaxyCount: 4, color: '#ec4899' }, // Oct
			{ name: 'Scorpio', starCount: 130, galaxyCount: 5, color: '#dc2626' }, // Nov
			{ name: 'Sagittarius', starCount: 170, galaxyCount: 3, color: '#7c3aed' } // Dec
		];
		return themes[month];
	}

	function createStars() {
		const theme = getHoroscopeTheme();
		stars = [];
		for (let i = 0; i < theme.starCount; i++) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 3 + 1,
				opacity: Math.random() * 0.8 + 0.2,
				twinkle: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.02 + 0.01
			});
		}
	}

	function createGalaxies() {
		const theme = getHoroscopeTheme();
		galaxies = [];
		for (let i = 0; i < theme.galaxyCount; i++) {
			galaxies.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 150 + 100,
				rotation: 0,
				rotationSpeed: (Math.random() - 0.5) * 0.01,
				opacity: Math.random() * 0.3 + 0.1
			});
		}
	}

	function drawStars() {
		const theme = getHoroscopeTheme();
		stars.forEach(star => {
			ctx.save();
			ctx.globalAlpha = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));
			ctx.fillStyle = theme.color;
			ctx.shadowBlur = 10;
			ctx.shadowColor = theme.color;
			
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			ctx.fill();
			
			star.twinkle += star.speed;
			ctx.restore();
		});
	}

	function drawGalaxies() {
		galaxies.forEach(galaxy => {
			ctx.save();
			ctx.globalAlpha = galaxy.opacity;
			ctx.translate(galaxy.x, galaxy.y);
			ctx.rotate(galaxy.rotation);
			
			const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
			gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
			gradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.4)');
			gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
			
			ctx.fillStyle = gradient;
			ctx.fillRect(-galaxy.size, -galaxy.size, galaxy.size * 2, galaxy.size * 2);
			
			galaxy.rotation += galaxy.rotationSpeed;
			ctx.restore();
		});
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGalaxies();
		drawStars();
		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		createStars();
		createGalaxies();
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		handleResize();
		animate();

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
		};
	});

	const currentTheme = getHoroscopeTheme();
</script>

<div class="hero-section">
	<canvas bind:this={canvas} class="background-canvas"></canvas>
	
	<div class="hero-content container">
		<div class="hero-text fade-in-up">
			<h1 class="hero-title">
				Welcome to My Universe
			</h1>
			<h2 class="hero-subtitle">
				Currently aligned with <span class="horoscope-sign">{currentTheme.name}</span>
			</h2>
			<p class="hero-description">
				A developer crafting digital experiences in the cosmic void. 
				Exploring the intersection of technology, creativity, and the stars above.
			</p>
			<div class="hero-buttons">
				<a href="/projects" class="btn">Explore Projects</a>
				<a href="/about" class="btn btn-outline">About Me</a>
			</div>
		</div>
		
		<div class="hero-stats">
			<div class="stat-item">
				<div class="stat-number">{currentTheme.starCount}</div>
				<div class="stat-label">Stars Tonight</div>
			</div>
			<div class="stat-item">
				<div class="stat-number">{currentTheme.galaxyCount}</div>
				<div class="stat-label">Galaxies Visible</div>
			</div>
			<div class="stat-item">
				<div class="stat-number">∞</div>
				<div class="stat-label">Possibilities</div>
			</div>
		</div>
	</div>
	
	<div class="scroll-indicator">
		<div class="scroll-arrow"></div>
	</div>
</div>

<style>
	.hero-section {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.background-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background: radial-gradient(ellipse at bottom, #1a1a1a 0%, #0a0a0a 100%);
	}

	.hero-content {
		text-align: center;
		z-index: 1;
		max-width: 800px;
	}

	.hero-title {
		font-size: 4rem;
		margin-bottom: 1rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.hero-subtitle {
		font-size: 1.5rem;
		margin-bottom: 2rem;
		color: var(--text-secondary);
		font-weight: 400;
	}

	.horoscope-sign {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 600;
	}

	.hero-description {
		font-size: 1.2rem;
		margin-bottom: 3rem;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.hero-buttons {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 4rem;
	}

	.hero-stats {
		display: flex;
		justify-content: center;
		gap: 4rem;
		margin-top: 4rem;
	}

	.stat-item {
		text-align: center;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: var(--text-muted);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		animation: bounce 2s infinite;
	}

	.scroll-arrow {
		width: 24px;
		height: 24px;
		border: 2px solid var(--accent-cyan);
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			transform: translateX(-50%) translateY(0);
		}
		40% {
			transform: translateX(-50%) translateY(-10px);
		}
		60% {
			transform: translateX(-50%) translateY(-5px);
		}
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}
		
		.hero-subtitle {
			font-size: 1.2rem;
		}
		
		.hero-description {
			font-size: 1rem;
		}
		
		.hero-stats {
			gap: 2rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.hero-buttons {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
