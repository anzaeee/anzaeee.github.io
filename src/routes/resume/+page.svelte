<script lang="ts">
	import { onMount } from 'svelte';

	interface EducationStage {
		id: string;
		title: string;
		period: string;
		institution: string;
		description: string;
		achievements: string[];
		icon: string;
		color: string;
	}

	let currentStage = 0;
	let stagesVisible = false;
	let journeyStarted = false;

	const educationJourney: EducationStage[] = [
		{
			id: 'primary',
			title: 'Primary School',
			period: '2003 - 2009',
			institution: 'Sunshine Elementary School',
			description: 'Where it all began - my first encounter with computers and problem-solving.',
			achievements: [
				'First computer programming experience in Logo',
				'Won school math competition (3 consecutive years)',
				'Led the school robotics club project',
				'Perfect attendance award',
				'Student council representative'
			],
			icon: '🎒',
			color: '#10b981'
		},
		{
			id: 'middle',
			title: 'Middle School',
			period: '2009 - 2012',
			institution: 'Tech Valley Middle School',
			description: 'Deepened my passion for technology and discovered web development.',
			achievements: [
				'Built first website for school science fair',
				'Learned HTML, CSS, and basic JavaScript',
				'Regional winner in programming contest',
				'Founded the Computer Club',
				'Mentored younger students in basic coding'
			],
			icon: '💻',
			color: '#8b5cf6'
		},
		{
			id: 'high',
			title: 'High School',
			period: '2012 - 2016',
			institution: 'Innovation High School',
			description: 'Advanced programming skills and leadership development.',
			achievements: [
				'Graduated Summa Cum Laude (4.0 GPA)',
				'Created mobile app with 1000+ downloads',
				'Internship at local tech startup',
				'National Merit Scholar finalist',
				'Varsity programming team captain'
			],
			icon: '🎓',
			color: '#f59e0b'
		},
		{
			id: 'college',
			title: 'University',
			period: '2016 - 2020',
			institution: 'State University - Computer Science',
			description: 'Comprehensive computer science education with focus on software engineering.',
			achievements: [
				'Bachelor of Science in Computer Science',
				'Dean\'s List for 6 semesters',
				'Teaching Assistant for Data Structures course',
				'Published research paper on machine learning',
				'Led hackathon team to victory (3 times)'
			],
			icon: '🏛️',
			color: '#ef4444'
		},
		{
			id: 'career',
			title: 'Professional Career',
			period: '2020 - Present',
			institution: 'Tech Industry',
			description: 'Applying knowledge to solve real-world problems and mentor others.',
			achievements: [
				'Senior Full Stack Developer at TechCorp Inc.',
				'Led architecture for microservices serving 1M+ users',
				'Reduced deployment time by 60% through CI/CD',
				'Mentored 15+ junior developers',
				'Speaker at 3 tech conferences'
			],
			icon: '🚀',
			color: '#00ffff'
		}
	];

	function startJourney() {
		journeyStarted = true;
		setTimeout(() => {
			stagesVisible = true;
		}, 500);
	}

	function nextStage() {
		if (currentStage < educationJourney.length - 1) {
			currentStage++;
		}
	}

	function prevStage() {
		if (currentStage > 0) {
			currentStage--;
		}
	}

	function goToStage(index: number) {
		currentStage = index;
	}

	onMount(() => {
		// Auto-start the journey after a brief delay
		setTimeout(() => {
			if (!journeyStarted) {
				startJourney();
			}
		}, 1000);
	});

	$: currentStageData = educationJourney[currentStage];
</script>

<div class="resume-page">
	<div class="container">
		<div class="page-header fade-in-up">
			<h1>My Educational Journey</h1>
			<p>From first lines of code to professional software development</p>
		</div>

		{#if !journeyStarted}
			<div class="journey-intro">
				<div class="intro-card">
					<h2>🎯 Interactive Resume Experience</h2>
					<p>
						Take a journey through my educational path and discover how each stage shaped my career in technology. 
						From elementary school programming to leading enterprise software development.
					</p>
					<button class="btn start-journey-btn" on:click={startJourney}>
						🚀 Begin the Journey
					</button>
				</div>
			</div>
		{:else}
			<div class="journey-container" class:visible={stagesVisible}>
				<!-- Stage Navigation -->
				<div class="stage-nav">
					{#each educationJourney as stage, index}
						<button 
							class="stage-dot"
							class:active={index === currentStage}
							class:completed={index < currentStage}
							style="border-color: {stage.color}"
							on:click={() => goToStage(index)}
							title={stage.title}
						>
							<span class="stage-icon">{stage.icon}</span>
						</button>
					{/each}
				</div>

				<!-- Current Stage Display -->
				<div class="stage-display">
					<div class="stage-content" style="border-left-color: {currentStageData.color}">
						<div class="stage-header">
							<div class="stage-title-section">
								<span class="stage-emoji" style="color: {currentStageData.color}">
									{currentStageData.icon}
								</span>
								<div>
									<h2 class="stage-title">{currentStageData.title}</h2>
									<div class="stage-period">{currentStageData.period}</div>
									<div class="stage-institution">{currentStageData.institution}</div>
								</div>
							</div>
						</div>

						<p class="stage-description">{currentStageData.description}</p>

						<div class="achievements-section">
							<h3>Key Achievements</h3>
							<div class="achievements-list">
								{#each currentStageData.achievements as achievement, index}
									<div 
										class="achievement-item"
										style="animation-delay: {index * 0.1}s"
									>
										<span class="achievement-bullet" style="background-color: {currentStageData.color}">
											✓
										</span>
										<span class="achievement-text">{achievement}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Navigation Controls -->
				<div class="journey-controls">
					<button 
						class="btn btn-outline nav-btn" 
						on:click={prevStage}
						disabled={currentStage === 0}
					>
						← Previous
					</button>
					
					<div class="stage-counter">
						{currentStage + 1} of {educationJourney.length}
					</div>
					
					<button 
						class="btn btn-outline nav-btn" 
						on:click={nextStage}
						disabled={currentStage === educationJourney.length - 1}
					>
						Next →
					</button>
				</div>

				<!-- Progress Bar -->
				<div class="progress-container">
					<div class="progress-bar">
						<div 
							class="progress-fill"
							style="width: {((currentStage + 1) / educationJourney.length) * 100}%; background-color: {currentStageData.color}"
						></div>
					</div>
					<div class="progress-text">
						Journey Progress: {Math.round(((currentStage + 1) / educationJourney.length) * 100)}%
					</div>
				</div>
			</div>
		{/if}

		<!-- Download CTA -->
		<div class="download-section">
			<div class="download-card">
				<h2>📄 Complete Professional Resume</h2>
				<p>
					Want the traditional format? Download my comprehensive resume with detailed work experience, 
					technical skills, projects, and certifications.
				</p>
				<div class="download-buttons">
					<button class="btn download-btn">
						📥 Download PDF Resume
					</button>
					<button class="btn btn-outline">
						📧 Email Resume to You
					</button>
				</div>
				<div class="resume-stats">
					<div class="resume-stat">
						<span class="stat-number">5+</span>
						<span class="stat-label">Years Experience</span>
					</div>
					<div class="resume-stat">
						<span class="stat-number">20+</span>
						<span class="stat-label">Technologies</span>
					</div>
					<div class="resume-stat">
						<span class="stat-number">10+</span>
						<span class="stat-label">Major Projects</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Info -->
		<div class="additional-info">
			<div class="info-grid">
				<div class="info-card">
					<h3>🎯 Current Focus</h3>
					<p>Leading development of scalable microservices architecture and mentoring the next generation of developers.</p>
				</div>
				<div class="info-card">
					<h3>🌟 Philosophy</h3>
					<p>Continuous learning, clean code, and user-centered development drive everything I do.</p>
				</div>
				<div class="info-card">
					<h3>🚀 Future Goals</h3>
					<p>Expanding into AI/ML applications and contributing to open-source projects that make a difference.</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Background Elements -->
	<div class="education-particles">
		{#each Array(12) as _, i}
			<div class="particle edu-particle-{i + 1}">📚</div>
		{/each}
	</div>
</div>

<style>
	.resume-page {
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

	.journey-intro {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
	}

	.intro-card {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 4rem;
		text-align: center;
		border: 1px solid var(--border-color);
		max-width: 600px;
		animation: fadeInUp 0.8s ease-out;
	}

	.intro-card h2 {
		color: var(--accent-cyan);
		margin-bottom: 2rem;
		font-size: 2rem;
	}

	.intro-card p {
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 3rem;
		color: var(--text-secondary);
	}

	.start-journey-btn {
		font-size: 1.3rem;
		padding: 1.2rem 2.5rem;
	}

	.journey-container {
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s ease;
		max-width: 900px;
		margin: 0 auto;
	}

	.journey-container.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.stage-nav {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 3rem;
		flex-wrap: wrap;
	}

	.stage-dot {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		border: 3px solid var(--border-color);
		background: var(--secondary-bg);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.stage-dot:hover {
		transform: scale(1.1);
		box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
	}

	.stage-dot.active {
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		border-color: var(--accent-cyan);
		transform: scale(1.2);
	}

	.stage-dot.completed {
		background: var(--accent-cyan);
		border-color: var(--accent-cyan);
	}

	.stage-icon {
		font-size: 1.5rem;
	}

	.stage-display {
		margin-bottom: 3rem;
	}

	.stage-content {
		background: var(--secondary-bg);
		border-radius: 1rem;
		padding: 3rem;
		border: 1px solid var(--border-color);
		border-left: 5px solid var(--accent-cyan);
		animation: slideInRight 0.6s ease-out;
	}

	.stage-header {
		margin-bottom: 2rem;
	}

	.stage-title-section {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
	}

	.stage-emoji {
		font-size: 3rem;
		line-height: 1;
	}

	.stage-title {
		color: var(--accent-cyan);
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.stage-period {
		color: var(--accent-purple);
		font-weight: 600;
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.stage-institution {
		color: var(--text-secondary);
		font-style: italic;
	}

	.stage-description {
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.achievements-section h3 {
		color: var(--accent-purple);
		margin-bottom: 1.5rem;
		font-size: 1.3rem;
	}

	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.achievement-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		opacity: 0;
		animation: fadeInLeft 0.5s ease-out forwards;
	}

	.achievement-bullet {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: bold;
		color: #000000;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.achievement-text {
		flex: 1;
		line-height: 1.6;
		color: var(--text-primary);
	}

	.journey-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.nav-btn {
		min-width: 120px;
	}

	.nav-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.stage-counter {
		background: var(--primary-bg);
		padding: 0.75rem 1.5rem;
		border-radius: 2rem;
		border: 1px solid var(--border-color);
		color: var(--accent-cyan);
		font-weight: 600;
	}

	.progress-container {
		text-align: center;
		margin-bottom: 4rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--primary-bg);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.progress-fill {
		height: 100%;
		transition: all 0.5s ease;
		border-radius: 4px;
	}

	.progress-text {
		color: var(--text-muted);
		font-size: 0.9rem;
		font-weight: 600;
	}

	.download-section {
		margin: 4rem 0;
	}

	.download-card {
		background: var(--secondary-bg);
		border-radius: 1.5rem;
		padding: 3rem;
		text-align: center;
		border: 1px solid var(--border-color);
		position: relative;
		overflow: hidden;
	}

	.download-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
	}

	.download-card h2 {
		color: var(--accent-cyan);
		margin-bottom: 1.5rem;
		font-size: 2rem;
	}

	.download-card p {
		font-size: 1.1rem;
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 2.5rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.download-buttons {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 3rem;
		flex-wrap: wrap;
	}

	.download-btn {
		font-size: 1.2rem;
		padding: 1rem 2rem;
	}

	.resume-stats {
		display: flex;
		justify-content: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	.resume-stat {
		text-align: center;
	}

	.stat-number {
		display: block;
		font-size: 2rem;
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

	.additional-info {
		margin-top: 4rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.info-card {
		background: var(--secondary-bg);
		border-radius: 1rem;
		padding: 2rem;
		border: 1px solid var(--border-color);
		text-align: center;
		transition: all 0.3s ease;
	}

	.info-card:hover {
		transform: translateY(-4px);
		border-color: var(--accent-cyan);
		box-shadow: 0 10px 25px rgba(0, 255, 255, 0.1);
	}

	.info-card h3 {
		color: var(--accent-purple);
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	.info-card p {
		color: var(--text-secondary);
		line-height: 1.6;
	}

	/* Background particles */
	.education-particles {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.particle {
		position: absolute;
		font-size: 1.5rem;
		opacity: 0.1;
		animation: edu-float 15s ease-in-out infinite;
	}

	/* Particle positions */
	.edu-particle-1 { top: 10%; left: 5%; animation-delay: 0s; }
	.edu-particle-2 { top: 20%; right: 10%; animation-delay: 2s; }
	.edu-particle-3 { top: 30%; left: 15%; animation-delay: 4s; }
	.edu-particle-4 { top: 40%; right: 20%; animation-delay: 6s; }
	.edu-particle-5 { top: 50%; left: 25%; animation-delay: 8s; }
	.edu-particle-6 { top: 60%; right: 30%; animation-delay: 10s; }
	.edu-particle-7 { top: 70%; left: 35%; animation-delay: 12s; }
	.edu-particle-8 { top: 80%; right: 40%; animation-delay: 14s; }
	.edu-particle-9 { top: 15%; left: 70%; animation-delay: 16s; }
	.edu-particle-10 { top: 25%; right: 60%; animation-delay: 18s; }
	.edu-particle-11 { top: 35%; left: 80%; animation-delay: 20s; }
	.edu-particle-12 { top: 45%; right: 50%; animation-delay: 22s; }

	@keyframes edu-float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-50px) rotate(180deg); }
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fadeInLeft {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		.intro-card {
			padding: 2rem;
			margin: 0 1rem;
		}

		.stage-nav {
			gap: 1rem;
		}

		.stage-dot {
			width: 3rem;
			height: 3rem;
		}

		.stage-content {
			padding: 2rem;
		}

		.stage-title-section {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.journey-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.download-card {
			padding: 2rem;
		}

		.download-buttons {
			flex-direction: column;
			align-items: center;
		}

		.resume-stats {
			gap: 2rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>