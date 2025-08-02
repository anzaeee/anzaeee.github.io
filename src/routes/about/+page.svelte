<script lang="ts">
	import { onMount } from 'svelte';

	let skillsVisible = false;
	let timelineVisible = false;
	let factsVisible = false;

	const skills = [
		{ name: 'JavaScript', level: 95, category: 'frontend' },
		{ name: 'TypeScript', level: 90, category: 'frontend' },
		{ name: 'React', level: 88, category: 'frontend' },
		{ name: 'Svelte', level: 85, category: 'frontend' },
		{ name: 'Vue.js', level: 82, category: 'frontend' },
		{ name: 'Node.js', level: 90, category: 'backend' },
		{ name: 'Python', level: 85, category: 'backend' },
		{ name: 'PostgreSQL', level: 80, category: 'database' },
		{ name: 'MongoDB', level: 78, category: 'database' },
		{ name: 'AWS', level: 83, category: 'cloud' },
		{ name: 'Docker', level: 85, category: 'devops' },
		{ name: 'GraphQL', level: 75, category: 'api' }
	];

	const timeline = [
		{
			year: '2024',
			title: 'Senior Full Stack Developer',
			company: 'TechCorp Inc.',
			description: 'Leading development of microservices architecture, mentoring junior developers, and implementing cutting-edge solutions.',
			technologies: ['React', 'Node.js', 'AWS', 'TypeScript']
		},
		{
			year: '2022',
			title: 'Full Stack Developer',
			company: 'InnovateLab',
			description: 'Built scalable web applications, optimized performance, and collaborated with cross-functional teams.',
			technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Docker']
		},
		{
			year: '2020',
			title: 'Frontend Developer',
			company: 'StartupXYZ',
			description: 'Created responsive user interfaces, implemented modern design patterns, and improved user experience.',
			technologies: ['React', 'JavaScript', 'CSS3', 'REST APIs']
		},
		{
			year: '2018',
			title: 'Junior Developer',
			company: 'WebSolutions',
			description: 'Started my journey in web development, learned best practices, and contributed to various projects.',
			technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery']
		}
	];

	const funFacts = [
		{ icon: '☕', text: 'I consume approximately 1,095 cups of coffee per year' },
		{ icon: '🌙', text: 'I do my best coding between 10 PM and 2 AM' },
		{ icon: '🎮', text: 'I built my first game in BASIC when I was 12' },
		{ icon: '🚀', text: 'I follow SpaceX launches religiously' },
		{ icon: '📚', text: 'I read at least 20 tech books every year' },
		{ icon: '🎵', text: 'I code to lo-fi hip hop and synthwave' },
		{ icon: '🧩', text: 'I solve Rubik\'s cubes to clear my mind' },
		{ icon: '🌱', text: 'I maintain a small garden of succulents on my desk' }
	];

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (entry.target.classList.contains('skills-section')) {
						skillsVisible = true;
					}
					if (entry.target.classList.contains('timeline-section')) {
						timelineVisible = true;
					}
					if (entry.target.classList.contains('facts-section')) {
						factsVisible = true;
					}
				}
			});
		}, { threshold: 0.3 });

		const skillsSection = document.querySelector('.skills-section');
		const timelineSection = document.querySelector('.timeline-section');
		const factsSection = document.querySelector('.facts-section');

		if (skillsSection) observer.observe(skillsSection);
		if (timelineSection) observer.observe(timelineSection);
		if (factsSection) observer.observe(factsSection);

		return () => observer.disconnect();
	});

	function getSkillColor(category: string): string {
		const colors = {
			frontend: 'var(--accent-cyan)',
			backend: 'var(--accent-purple)',
			database: '#10b981',
			cloud: '#f59e0b',
			devops: '#ef4444',
			api: '#8b5cf6'
		};
		return colors[category] || 'var(--accent-cyan)';
	}
</script>

<div class="about-page">
	<div class="container">
		<div class="hero-section fade-in-up">
			<div class="hero-content">
				<h1>About Me</h1>
				<p class="hero-subtitle">Developer, Problem Solver, Coffee Enthusiast</p>
				<div class="hero-description">
					<p>
						I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems. 
						With over 5 years of experience in the industry, I've had the privilege of working on diverse projects 
						ranging from startup MVPs to enterprise-scale applications.
					</p>
					<p>
						My journey in technology is driven by curiosity and a desire to build things that matter. 
						I believe in writing clean, maintainable code and creating user experiences that delight and empower.
					</p>
				</div>
			</div>
			<div class="hero-image">
				<div class="profile-avatar">
					<div class="avatar-circle">
						<span class="avatar-emoji">👨‍💻</span>
					</div>
					<div class="avatar-glow"></div>
				</div>
			</div>
		</div>

		<div class="skills-section" class:visible={skillsVisible}>
			<h2>Technical Arsenal</h2>
			<p class="section-subtitle">Technologies I work with daily</p>
			
			<div class="skills-grid">
				{#each skills as skill, index}
					<div 
						class="skill-item" 
						style="animation-delay: {index * 0.1}s"
						class:visible={skillsVisible}
					>
						<div class="skill-header">
							<span class="skill-name">{skill.name}</span>
							<span class="skill-level">{skill.level}%</span>
						</div>
						<div class="skill-bar">
							<div 
								class="skill-progress" 
								style="width: {skillsVisible ? skill.level : 0}%; background-color: {getSkillColor(skill.category)}"
							></div>
						</div>
						<div class="skill-category">{skill.category}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="timeline-section" class:visible={timelineVisible}>
			<h2>Professional Journey</h2>
			<p class="section-subtitle">My path through the tech world</p>
			
			<div class="timeline">
				{#each timeline as item, index}
					<div 
						class="timeline-item" 
						class:visible={timelineVisible}
						style="animation-delay: {index * 0.2}s"
					>
						<div class="timeline-marker">
							<div class="timeline-year">{item.year}</div>
						</div>
						<div class="timeline-content">
							<h3 class="timeline-title">{item.title}</h3>
							<div class="timeline-company">{item.company}</div>
							<p class="timeline-description">{item.description}</p>
							<div class="timeline-technologies">
								{#each item.technologies as tech}
									<span class="tech-tag">{tech}</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="facts-section" class:visible={factsVisible}>
			<h2>Fun Facts & Quirks</h2>
			<p class="section-subtitle">Things that make me, me</p>
			
			<div class="facts-grid">
				{#each funFacts as fact, index}
					<div 
						class="fact-item" 
						class:visible={factsVisible}
						style="animation-delay: {index * 0.1}s"
					>
						<div class="fact-icon">{fact.icon}</div>
						<p class="fact-text">{fact.text}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="philosophy-section">
			<div class="card">
				<h2>My Development Philosophy</h2>
				<div class="philosophy-grid">
					<div class="philosophy-item">
						<h3>🎯 User-Centered</h3>
						<p>Every line of code should serve the end user. I prioritize creating intuitive, accessible experiences that solve real problems.</p>
					</div>
					<div class="philosophy-item">
						<h3>🔧 Clean & Maintainable</h3>
						<p>I believe in writing code that future-me (and my teammates) will thank me for. Clear, well-documented, and testable.</p>
					</div>
					<div class="philosophy-item">
						<h3>🚀 Continuous Learning</h3>
						<p>Technology evolves rapidly. I stay curious, experiment with new tools, and never stop learning from the community.</p>
					</div>
					<div class="philosophy-item">
						<h3>🤝 Collaborative</h3>
						<p>The best solutions come from diverse minds working together. I value communication, feedback, and shared ownership.</p>
					</div>
				</div>
			</div>
		</div>

		<div class="cta-section">
			<div class="cta-content">
				<h2>Let's Build Something Amazing</h2>
				<p>I'm always excited to work on new projects and connect with fellow developers. Whether you have an idea, need help with a project, or just want to chat about technology, I'd love to hear from you.</p>
				<div class="cta-buttons">
					<a href="/contact" class="btn">Get In Touch</a>
					<a href="/projects" class="btn btn-outline">View My Work</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Background elements -->
	<div class="floating-icons">
		<div class="icon-particle icon-1">💻</div>
		<div class="icon-particle icon-2">⚡</div>
		<div class="icon-particle icon-3">🚀</div>
		<div class="icon-particle icon-4">✨</div>
		<div class="icon-particle icon-5">🎯</div>
		<div class="icon-particle icon-6">🔥</div>
	</div>
</div>

<style>
	.about-page {
		position: relative;
		padding: 2rem 0;
	}

	.hero-section {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 4rem;
		align-items: center;
		margin-bottom: 6rem;
		min-height: 70vh;
	}

	.hero-content h1 {
		font-size: 3.5rem;
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		font-size: 1.5rem;
		color: var(--accent-cyan);
		margin-bottom: 2rem;
		font-weight: 500;
	}

	.hero-description {
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.hero-description p {
		margin-bottom: 1.5rem;
	}

	.hero-image {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profile-avatar {
		position: relative;
	}

	.avatar-circle {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 2;
		animation: float 3s ease-in-out infinite;
	}

	.avatar-emoji {
		font-size: 5rem;
	}

	.avatar-glow {
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		opacity: 0.3;
		animation: pulse 2s ease-in-out infinite;
		z-index: 1;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.skills-section, .timeline-section, .facts-section {
		margin-bottom: 6rem;
		text-align: center;
	}

	.skills-section h2, .timeline-section h2, .facts-section h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: var(--accent-cyan);
	}

	.section-subtitle {
		font-size: 1.2rem;
		color: var(--text-secondary);
		margin-bottom: 3rem;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}

	.skill-item {
		background: var(--secondary-bg);
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid var(--border-color);
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.6s ease;
	}

	.skill-item.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.skill-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.skill-name {
		font-weight: 600;
		color: var(--text-primary);
		font-size: 1.1rem;
	}

	.skill-level {
		color: var(--accent-purple);
		font-weight: 700;
	}

	.skill-bar {
		height: 8px;
		background: var(--primary-bg);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.skill-progress {
		height: 100%;
		transition: width 1.5s ease-in-out;
		border-radius: 4px;
	}

	.skill-category {
		color: var(--text-muted);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.timeline {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple));
		transform: translateX(-50%);
	}

	.timeline-item {
		display: flex;
		align-items: center;
		margin-bottom: 3rem;
		opacity: 0;
		transform: translateX(-50px);
		transition: all 0.6s ease;
	}

	.timeline-item.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.timeline-item:nth-child(even) {
		flex-direction: row-reverse;
		transform: translateX(50px);
	}

	.timeline-item:nth-child(even).visible {
		transform: translateX(0);
	}

	.timeline-marker {
		position: relative;
		z-index: 2;
		margin: 0 2rem;
	}

	.timeline-year {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		color: var(--primary-bg);
		padding: 1rem 1.5rem;
		border-radius: 2rem;
		font-weight: 700;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.timeline-content {
		background: var(--secondary-bg);
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid var(--border-color);
		flex: 1;
		text-align: left;
		max-width: 350px;
	}

	.timeline-title {
		color: var(--accent-cyan);
		margin-bottom: 0.5rem;
		font-size: 1.3rem;
	}

	.timeline-company {
		color: var(--accent-purple);
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.timeline-description {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.timeline-technologies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tech-tag {
		background: var(--primary-bg);
		color: var(--accent-cyan);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		border: 1px solid var(--border-color);
	}

	.facts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}

	.fact-item {
		background: var(--secondary-bg);
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid var(--border-color);
		text-align: center;
		opacity: 0;
		transform: scale(0.9);
		transition: all 0.5s ease;
	}

	.fact-item.visible {
		opacity: 1;
		transform: scale(1);
	}

	.fact-item:hover {
		transform: scale(1.05);
		border-color: var(--accent-cyan);
		box-shadow: 0 10px 25px rgba(0, 255, 255, 0.2);
	}

	.fact-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.fact-text {
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.philosophy-section {
		margin-bottom: 6rem;
	}

	.philosophy-section h2 {
		text-align: center;
		color: var(--accent-purple);
		margin-bottom: 3rem;
	}

	.philosophy-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.philosophy-item {
		text-align: center;
		padding: 1.5rem;
	}

	.philosophy-item h3 {
		color: var(--accent-cyan);
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	.philosophy-item p {
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.cta-section {
		text-align: center;
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 4rem 2rem;
		border: 1px solid var(--border-color);
	}

	.cta-content h2 {
		color: var(--accent-cyan);
		margin-bottom: 1.5rem;
		font-size: 2.5rem;
	}

	.cta-content p {
		font-size: 1.1rem;
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	/* Floating background icons */
	.floating-icons {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.icon-particle {
		position: absolute;
		font-size: 2rem;
		opacity: 0.1;
		animation: icon-float 8s ease-in-out infinite;
	}

	.icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
	.icon-2 { top: 20%; right: 15%; animation-delay: 2s; }
	.icon-3 { top: 60%; left: 5%; animation-delay: 4s; }
	.icon-4 { top: 80%; right: 20%; animation-delay: 6s; }
	.icon-5 { top: 40%; right: 10%; animation-delay: 8s; }
	.icon-6 { bottom: 20%; left: 20%; animation-delay: 10s; }

	@keyframes icon-float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-30px) rotate(180deg); }
	}

	@media (max-width: 768px) {
		.hero-section {
			grid-template-columns: 1fr;
			text-align: center;
			gap: 2rem;
		}

		.hero-content h1 {
			font-size: 2.5rem;
		}

		.avatar-circle {
			width: 150px;
			height: 150px;
		}

		.avatar-emoji {
			font-size: 4rem;
		}

		.skills-grid {
			grid-template-columns: 1fr;
		}

		.timeline::before {
			left: 20px;
		}

		.timeline-item {
			flex-direction: row !important;
			transform: translateX(0) !important;
		}

		.timeline-marker {
			margin: 0 1rem 0 0;
		}

		.timeline-content {
			max-width: none;
		}

		.facts-grid {
			grid-template-columns: 1fr;
		}

		.philosophy-grid {
			grid-template-columns: 1fr;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: center;
		}
	}
</style>