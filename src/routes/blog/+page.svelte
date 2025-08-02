<script lang="ts">
	import { onMount } from 'svelte';

	interface BlogPost {
		id: string;
		title: string;
		excerpt: string;
		content: string;
		date: string;
		readTime: string;
		tags: string[];
		featured: boolean;
	}

	let blogPosts: BlogPost[] = [
		{
			id: '1',
			title: 'Building Scalable Applications with Svelte and TypeScript',
			excerpt: 'Exploring the power of Svelte combined with TypeScript for creating maintainable, high-performance web applications.',
			content: `# Building Scalable Applications with Svelte and TypeScript

Svelte has quickly become one of my favorite frameworks for building modern web applications. When combined with TypeScript, it provides an incredibly developer-friendly experience while maintaining excellent runtime performance.

## Why Svelte + TypeScript?

The combination offers several compelling advantages:

### Compile-Time Optimizations
Svelte compiles your components to vanilla JavaScript at build time, eliminating the need for a virtual DOM. This results in smaller bundle sizes and faster runtime performance.

### Type Safety
TypeScript provides excellent tooling support and catches errors at compile time, making your code more reliable and maintainable.

### Developer Experience
The combination of Svelte's intuitive syntax and TypeScript's intelligent autocompletion creates a delightful development experience.

## Best Practices

1. **Component Structure**: Keep components focused and single-purpose
2. **State Management**: Use stores for shared state across components
3. **Type Definitions**: Create interfaces for props and complex data structures
4. **Testing**: Leverage Jest and Testing Library for comprehensive testing

## Conclusion

Svelte and TypeScript together provide a powerful foundation for building modern web applications. The compile-time benefits and excellent developer experience make this combination ideal for projects of any size.`,
			date: '2024-01-15',
			readTime: '5 min read',
			tags: ['Svelte', 'TypeScript', 'Web Development'],
			featured: true
		},
		{
			id: '2',
			title: 'The Art of Clean Code: Lessons from the Trenches',
			excerpt: 'Practical insights on writing maintainable code learned from years of development experience.',
			content: `# The Art of Clean Code: Lessons from the Trenches

After years of writing code professionally, I've learned that clean code isn't just about following rules—it's about empathy for future developers, including yourself.

## Core Principles

### 1. Code Should Tell a Story
Your code should read like well-written prose. Variable names, function names, and comments should work together to tell the story of what your code does and why.

### 2. Functions Should Do One Thing
The single responsibility principle isn't just for classes—it applies to functions too. Each function should have one clear purpose.

### 3. Consistency is King
Whether it's naming conventions, formatting, or architectural patterns, consistency across your codebase is crucial for maintainability.

## Practical Tips

- Use meaningful names that don't require comments
- Keep functions small and focused
- Write tests that serve as documentation
- Refactor regularly to pay down technical debt

## The Human Element

Remember, code is written once but read many times. Optimize for readability and understanding, not just cleverness.`,
			date: '2024-01-08',
			readTime: '7 min read',
			tags: ['Clean Code', 'Best Practices', 'Development'],
			featured: false
		},
		{
			id: '3',
			title: 'Mastering Async JavaScript: Promises, Async/Await, and Beyond',
			excerpt: 'A deep dive into asynchronous JavaScript patterns and how to use them effectively in modern applications.',
			content: `# Mastering Async JavaScript: Promises, Async/Await, and Beyond

Asynchronous programming is at the heart of modern JavaScript development. Understanding how to work with async operations effectively is crucial for building responsive applications.

## Evolution of Async JavaScript

### Callbacks → Promises → Async/Await

JavaScript's async story has evolved significantly:

1. **Callbacks**: The original pattern, prone to callback hell
2. **Promises**: Introduced composable async operations
3. **Async/Await**: Made async code look synchronous

## Best Practices

### Error Handling
Always handle errors in async operations:

\`\`\`javascript
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw error;
}
\`\`\`

### Parallel vs Sequential
Understand when to run operations in parallel vs sequence:

\`\`\`javascript
// Parallel
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
]);

// Sequential
const user = await fetchUser(id);
const posts = await fetchPosts(user.id);
\`\`\`

## Advanced Patterns

- Using Promise.allSettled for fault-tolerant operations
- Implementing retry logic with exponential backoff
- Building async iterators for streaming data

Mastering these patterns will make you a more effective JavaScript developer.`,
			date: '2024-01-01',
			readTime: '6 min read',
			tags: ['JavaScript', 'Async', 'Promises'],
			featured: true
		}
	];

	let selectedPost: BlogPost | null = null;
	let searchTerm = '';
	let selectedTag = '';
	let postsVisible = false;

	$: filteredPosts = blogPosts.filter(post => {
		const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTag = !selectedTag || post.tags.includes(selectedTag);
		return matchesSearch && matchesTag;
	});

	$: allTags = [...new Set(blogPosts.flatMap(post => post.tags))].sort();

	function openPost(post: BlogPost) {
		selectedPost = post;
	}

	function closePost() {
		selectedPost = null;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function clearFilters() {
		searchTerm = '';
		selectedTag = '';
	}

	onMount(() => {
		setTimeout(() => {
			postsVisible = true;
		}, 300);
	});
</script>

<div class="blog-page">
	<div class="container">
		{#if !selectedPost}
			<div class="blog-header fade-in-up">
				<h1>Developer Blog</h1>
				<p>Thoughts, experiences, and insights from my journey in technology</p>
			</div>

			<div class="blog-controls">
				<div class="search-section">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Search articles..."
						class="search-input"
					/>
					<select bind:value={selectedTag} class="tag-filter">
						<option value="">All Topics</option>
						{#each allTags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
					{#if searchTerm || selectedTag}
						<button class="btn btn-outline clear-btn" on:click={clearFilters}>
							Clear Filters
						</button>
					{/if}
				</div>

				<div class="blog-stats">
					<div class="stat">
						<span class="stat-number">{blogPosts.length}</span>
						<span class="stat-label">Articles</span>
					</div>
					<div class="stat">
						<span class="stat-number">{allTags.length}</span>
						<span class="stat-label">Topics</span>
					</div>
					<div class="stat">
						<span class="stat-number">{filteredPosts.length}</span>
						<span class="stat-label">Showing</span>
					</div>
				</div>
			</div>

			{#if filteredPosts.length > 0}
				<div class="blog-grid" class:visible={postsVisible}>
					{#each filteredPosts as post, index}
						<article 
							class="blog-card"
							class:featured={post.featured}
							style="animation-delay: {index * 0.1}s"
							on:click={() => openPost(post)}
							on:keydown={(e) => e.key === 'Enter' && openPost(post)}
							tabindex="0"
							role="button"
						>
							<div class="card-header">
								{#if post.featured}
									<div class="featured-badge">⭐ Featured</div>
								{/if}
								<div class="post-meta">
									<span class="post-date">{formatDate(post.date)}</span>
									<span class="post-read-time">{post.readTime}</span>
								</div>
							</div>
							
							<h2 class="post-title">{post.title}</h2>
							<p class="post-excerpt">{post.excerpt}</p>
							
							<div class="post-tags">
								{#each post.tags as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
							
							<div class="read-more">
								<span>Read Article →</span>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="no-results">
					<div class="no-results-icon">🔍</div>
					<h3>No articles found</h3>
					<p>Try adjusting your search terms or filters</p>
					<button class="btn" on:click={clearFilters}>
						Clear All Filters
					</button>
				</div>
			{/if}

			<div class="blog-footer">
				<div class="card">
					<h3>📝 Want to contribute?</h3>
					<p>
						This blog is a work in progress! I'm always working on new content covering 
						web development, best practices, and technology insights. Check back regularly 
						for new posts, or reach out if you have suggestions for topics you'd like to see covered.
					</p>
					<div class="footer-actions">
						<a href="/contact" class="btn">Suggest a Topic</a>
						<a href="https://github.com/johndoe/blog" target="_blank" class="btn btn-outline">
							View Source
						</a>
					</div>
				</div>
			</div>
		{:else}
			<!-- Full Post View -->
			<div class="post-view">
				<div class="post-header">
					<button class="back-btn" on:click={closePost}>
						← Back to Blog
					</button>
					
					<div class="post-info">
						{#if selectedPost.featured}
							<div class="featured-badge large">⭐ Featured Article</div>
						{/if}
						
						<h1 class="post-title-full">{selectedPost.title}</h1>
						
						<div class="post-meta-full">
							<span class="meta-item">📅 {formatDate(selectedPost.date)}</span>
							<span class="meta-item">⏱️ {selectedPost.readTime}</span>
							<span class="meta-item">🏷️ {selectedPost.tags.join(', ')}</span>
						</div>
					</div>
				</div>

				<div class="post-content">
					{@html selectedPost.content.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>')}
				</div>

				<div class="post-footer">
					<div class="post-tags-full">
						{#each selectedPost.tags as tag}
							<button 
								class="tag clickable" 
								on:click={() => {
									selectedTag = tag;
									closePost();
								}}
							>
								{tag}
							</button>
						{/each}
					</div>
					
					<div class="post-actions">
						<button class="btn btn-outline" on:click={closePost}>
							← Back to All Posts
						</button>
						<a href="/contact" class="btn">
							💬 Discuss This Post
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Background elements -->
	<div class="blog-background">
		{#each Array(15) as _, i}
			<div class="blog-particle particle-{i + 1}">📖</div>
		{/each}
	</div>
</div>

<style>
	.blog-page {
		position: relative;
		min-height: 100vh;
		padding: 2rem 0;
	}

	.blog-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.blog-header h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.blog-header p {
		font-size: 1.2rem;
		color: var(--text-secondary);
	}

	.blog-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.search-section {
		display: flex;
		gap: 1rem;
		flex: 1;
		max-width: 600px;
		align-items: center;
		flex-wrap: wrap;
	}

	.search-input, .tag-filter {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		min-width: 200px;
	}

	.search-input {
		flex: 1;
	}

	.clear-btn {
		padding: 0.75rem 1.5rem;
	}

	.blog-stats {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.stat {
		text-align: center;
		min-width: 60px;
	}

	.stat-number {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.blog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.6s ease;
	}

	.blog-grid.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.blog-card {
		background: var(--secondary-bg);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		opacity: 0;
		transform: translateY(30px);
		animation: fadeInUp 0.6s ease-out forwards;
	}

	.blog-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 255, 255, 0.1);
		border-color: var(--accent-cyan);
	}

	.blog-card.featured {
		border-color: var(--accent-purple);
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 255, 255, 0.05));
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.featured-badge {
		background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
		color: var(--primary-bg);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.featured-badge.large {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.post-title {
		color: var(--text-primary);
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 1rem;
		line-height: 1.4;
	}

	.post-excerpt {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		background: var(--primary-bg);
		color: var(--accent-cyan);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		border: 1px solid var(--border-color);
		transition: all 0.3s ease;
	}

	.tag.clickable {
		cursor: pointer;
		border: none;
		background: var(--primary-bg);
	}

	.tag.clickable:hover {
		background: var(--accent-cyan);
		color: var(--primary-bg);
	}

	.read-more {
		color: var(--accent-purple);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		color: var(--text-secondary);
	}

	.no-results-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.no-results h3 {
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.blog-footer {
		max-width: 800px;
		margin: 4rem auto 0;
	}

	.blog-footer h3 {
		color: var(--accent-cyan);
		margin-bottom: 1rem;
	}

	.footer-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	/* Full Post View Styles */
	.post-view {
		max-width: 800px;
		margin: 0 auto;
		animation: fadeInUp 0.5s ease-out;
	}

	.post-header {
		margin-bottom: 3rem;
	}

	.back-btn {
		background: none;
		border: 2px solid var(--accent-cyan);
		color: var(--accent-cyan);
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		margin-bottom: 2rem;
	}

	.back-btn:hover {
		background: var(--accent-cyan);
		color: var(--primary-bg);
	}

	.post-title-full {
		font-size: 2.5rem;
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}

	.post-meta-full {
		display: flex;
		gap: 2rem;
		color: var(--text-muted);
		font-size: 0.9rem;
		flex-wrap: wrap;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.post-content {
		background: var(--secondary-bg);
		border-radius: 1rem;
		padding: 3rem;
		border: 1px solid var(--border-color);
		margin-bottom: 3rem;
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.post-content :global(h1) {
		color: var(--accent-cyan);
		font-size: 2rem;
		margin: 2rem 0 1rem 0;
	}

	.post-content :global(h2) {
		color: var(--accent-purple);
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	.post-content :global(h3) {
		color: var(--text-primary);
		font-size: 1.2rem;
		margin: 1rem 0 0.5rem 0;
	}

	.post-footer {
		border-top: 1px solid var(--border-color);
		padding-top: 2rem;
	}

	.post-tags-full {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.post-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Background particles */
	.blog-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}

	.blog-particle {
		position: absolute;
		font-size: 1.5rem;
		opacity: 0.05;
		animation: blog-float 12s ease-in-out infinite;
	}

	/* Generate random positions */
	.particle-1 { top: 10%; left: 5%; animation-delay: 0s; }
	.particle-2 { top: 20%; right: 10%; animation-delay: 2s; }
	.particle-3 { top: 30%; left: 15%; animation-delay: 4s; }
	.particle-4 { top: 40%; right: 20%; animation-delay: 6s; }
	.particle-5 { top: 50%; left: 25%; animation-delay: 8s; }
	.particle-6 { top: 60%; right: 30%; animation-delay: 10s; }
	.particle-7 { top: 70%; left: 35%; animation-delay: 12s; }
	.particle-8 { top: 80%; right: 40%; animation-delay: 14s; }
	.particle-9 { top: 15%; left: 70%; animation-delay: 16s; }
	.particle-10 { top: 25%; right: 60%; animation-delay: 18s; }
	.particle-11 { top: 35%; left: 80%; animation-delay: 20s; }
	.particle-12 { top: 45%; right: 50%; animation-delay: 22s; }
	.particle-13 { top: 55%; left: 90%; animation-delay: 24s; }
	.particle-14 { top: 65%; right: 70%; animation-delay: 26s; }
	.particle-15 { top: 75%; left: 60%; animation-delay: 28s; }

	@keyframes blog-float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-40px) rotate(180deg); }
	}

	@media (max-width: 768px) {
		.blog-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.search-section {
			max-width: none;
		}

		.search-input, .tag-filter {
			min-width: 0;
			flex: 1;
		}

		.blog-stats {
			justify-content: center;
		}

		.blog-grid {
			grid-template-columns: 1fr;
		}

		.post-meta-full {
			flex-direction: column;
			gap: 0.5rem;
		}

		.post-content {
			padding: 2rem 1.5rem;
		}

		.post-actions {
			flex-direction: column;
		}

		.footer-actions {
			flex-direction: column;
		}
	}
</style>