<script lang="ts">
	let currentUrl = 'https://hackwwp.princeton.edu';
	let isLoading = false;
	
	const quickLinks = [
		{ title: 'hackWWP', url: 'https://hackwwp.princeton.edu', favicon: '🚀' },
		{ title: 'Princeton CS', url: 'https://www.cs.princeton.edu', favicon: '🎓' },
		{ title: 'GitHub', url: 'https://github.com', favicon: '⚡' },
		{ title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '📚' },
		{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org', favicon: '🌐' },
		{ title: 'Devpost', url: 'https://devpost.com', favicon: '💡' }
	];

	function navigate(url: string) {
		isLoading = true;
		currentUrl = url;
		setTimeout(() => {
			isLoading = false;
		}, 1000);
	}

	function handleUrlSubmit(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			navigate(currentUrl);
		}
	}
</script>

<div class="safari">
	<div class="toolbar">
		<div class="navigation-controls">
			<button class="nav-button" disabled>←</button>
			<button class="nav-button" disabled>→</button>
			<button class="refresh-button" on:click={() => navigate(currentUrl)}>↻</button>
		</div>
		
		<div class="address-bar">
			<div class="security-indicator">🔒</div>
			<input 
				type="text" 
				bind:value={currentUrl}
				on:keydown={handleUrlSubmit}
				placeholder="Enter URL or search"
			/>
		</div>
		
		<div class="toolbar-actions">
			<button class="action-button">📚</button>
			<button class="action-button">⚙️</button>
		</div>
	</div>

	<div class="content-area">
		{#if isLoading}
			<div class="loading">
				<div class="loading-bar">
					<div class="loading-progress"></div>
				</div>
				<p>Loading...</p>
			</div>
		{:else if currentUrl.includes('hackwwp')}
			<div class="hackwwp-page">
				<div class="hero">
					<h1>hackWWP 2025</h1>
					<h2>Princeton University Hackathon</h2>
					<p>June 13-14, 2025 • Princeton CS 104/105</p>
					<button class="cta-button">Register Now</button>
				</div>
				
				<div class="features">
					<div class="feature">
						<h3>🏆 Prizes</h3>
						<p>Amazing prizes for top projects</p>
					</div>
					<div class="feature">
						<h3>🤝 Mentorship</h3>
						<p>Expert mentors to guide you</p>
					</div>
					<div class="feature">
						<h3>🍕 Free Food</h3>
						<p>Meals and snacks provided</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="start-page">
				<div class="welcome">
					<h2>Welcome to Safari</h2>
					<p>Your gateway to the web during hackWWP</p>
				</div>
				
				<div class="quick-links">
					<h3>Quick Links</h3>
					<div class="links-grid">
						{#each quickLinks as link}
							<button class="quick-link" on:click={() => navigate(link.url)}>
								<span class="favicon">{link.favicon}</span>
								<span class="title">{link.title}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.safari {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #f5f5f7;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
	}

	.toolbar {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		background: #e8e8e8;
		border-bottom: 1px solid #d1d1d1;
		gap: 12px;
	}

	.navigation-controls {
		display: flex;
		gap: 4px;
	}

	.nav-button, .refresh-button, .action-button {
		padding: 6px 10px;
		border: none;
		border-radius: 4px;
		background: #f0f0f0;
		color: #666;
		font-size: 14px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.nav-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.nav-button:not(:disabled):hover,
	.refresh-button:hover,
	.action-button:hover {
		background: #e0e0e0;
	}

	.address-bar {
		flex: 1;
		display: flex;
		align-items: center;
		background: white;
		border: 1px solid #d1d1d1;
		border-radius: 6px;
		padding: 6px 8px;
		gap: 8px;
	}

	.security-indicator {
		font-size: 12px;
	}

	.address-bar input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 14px;
	}

	.toolbar-actions {
		display: flex;
		gap: 4px;
	}

	.content-area {
		flex: 1;
		overflow-y: auto;
		background: white;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200px;
		gap: 20px;
	}

	.loading-bar {
		width: 200px;
		height: 4px;
		background: #e0e0e0;
		border-radius: 2px;
		overflow: hidden;
	}

	.loading-progress {
		width: 100%;
		height: 100%;
		background: #007AFF;
		border-radius: 2px;
		animation: loading 1s ease-in-out infinite;
	}

	@keyframes loading {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.hackwwp-page {
		padding: 40px 20px;
	}

	.hero {
		text-align: center;
		margin-bottom: 60px;
		padding: 40px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 15px;
	}

	.hero h1 {
		font-size: 3em;
		margin: 0;
		font-weight: 700;
	}

	.hero h2 {
		font-size: 1.5em;
		margin: 10px 0;
		font-weight: 300;
	}

	.hero p {
		font-size: 1.1em;
		margin: 20px 0 30px 0;
		opacity: 0.9;
	}

	.cta-button {
		background: white;
		color: #667eea;
		border: none;
		padding: 12px 30px;
		border-radius: 25px;
		font-size: 1.1em;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.cta-button:hover {
		transform: translateY(-2px);
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 30px;
		max-width: 800px;
		margin: 0 auto;
	}

	.feature {
		text-align: center;
		padding: 30px;
		background: #f8f9fa;
		border-radius: 15px;
		border: 1px solid #e9ecef;
	}

	.feature h3 {
		font-size: 1.3em;
		margin: 0 0 10px 0;
		color: #495057;
	}

	.feature p {
		color: #6c757d;
		line-height: 1.5;
	}

	.start-page {
		padding: 40px 20px;
		max-width: 800px;
		margin: 0 auto;
	}

	.welcome {
		text-align: center;
		margin-bottom: 40px;
	}

	.welcome h2 {
		font-size: 2em;
		color: #1d1d1f;
		margin: 0 0 10px 0;
	}

	.welcome p {
		color: #86868b;
		font-size: 1.1em;
	}

	.quick-links h3 {
		font-size: 1.3em;
		color: #1d1d1f;
		margin: 0 0 20px 0;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 15px;
	}

	.quick-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 15px;
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		text-align: left;
	}

	.quick-link:hover {
		background: #e9ecef;
		transform: translateY(-2px);
	}

	.favicon {
		font-size: 1.2em;
	}

	.title {
		font-weight: 500;
		color: #495057;
	}
</style>