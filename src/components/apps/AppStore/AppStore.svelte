<script lang="ts">
	import { onMount } from 'svelte';
	import { sleep } from '🍎/helpers/sleep';
	import type { AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import { spring } from '🍎/state/spring.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();

	const motion_val = spring(0, { damping: 0.28, stiffness: 0.1 });

	interface HackathonProject {
		id: string;
		name: string;
		description: string;
		team: string;
		category: string;
		tech: string[];
		github?: string;
		demo?: string;
		icon: string;
	}

	let projects: HackathonProject[] = [
		{
			id: '1',
			name: 'EcoTracker',
			description: 'Track your carbon footprint and get personalized sustainability tips',
			team: 'Green Tech Team',
			category: 'Sustainability',
			tech: ['React', 'Node.js', 'MongoDB'],
			icon: '🌱'
		},
		{
			id: '2',
			name: 'StudyBuddy',
			description: 'AI-powered study companion that creates personalized learning paths',
			team: 'Learning Innovators',
			category: 'Education',
			tech: ['Python', 'Flask', 'OpenAI API'],
			icon: '📚'
		},
		{
			id: '3',
			name: 'CampusConnect',
			description: 'Social platform connecting students with similar interests and study groups',
			team: 'Social Coders',
			category: 'Social',
			tech: ['Vue.js', 'Express', 'PostgreSQL'],
			icon: '🤝'
		}
	];

	onMount(async () => {
		await sleep(100);
		motion_val.value = 1;
	});

	const image_transform = $derived(
		!preferences.reduced_motion
			? `rotate(${180 * (motion_val.value + 1)}deg) scale(${motion_val.value}) translateZ(0px)`
			: 'initial',
	);
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle"></header>
	<section class="main-area">
		<div class="app-store-header">
			<div class="store-icon">
				<img
					style:transform={image_transform}
					src="/app-icons/{app_id}/256.webp"
					alt="App Store"
				/>
			</div>
			<div class="header-content">
				<h1>hackWWP Project Store</h1>
				<p>Discover amazing projects built during hackWWP 2025</p>
			</div>
		</div>

		<div class="projects-section">
			<h2>🏆 Featured Projects</h2>
			<div class="projects-grid">
				{#each projects as project}
					<div class="project-card">
						<div class="project-header">
							<div class="project-icon">{project.icon}</div>
							<div class="project-info">
								<h3>{project.name}</h3>
								<p class="team-name">{project.team}</p>
							</div>
							<div class="category-badge">{project.category}</div>
						</div>
						
						<div class="project-description">
							{project.description}
						</div>
						
						<div class="tech-stack">
							{#each project.tech as tech}
								<span class="tech-tag">{tech}</span>
							{/each}
						</div>
						
						<div class="project-actions">
							<button class="btn primary">View Project</button>
							<button class="btn secondary">GitHub</button>
						</div>
					</div>
				{/each}
			</div>
			
			<div class="coming-soon">
				<h3>🚀 More Projects Coming Soon!</h3>
				<p>This space will be filled with all the amazing projects created during hackWWP. Check back after the event to see what our talented participants have built!</p>
			</div>
		</div>
	</section>
</section>

<style>
	.container {
		background-color: var(--system-color-light);
		border-radius: inherit;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.titlebar {
		height: 1.75rem;
		background: linear-gradient(
			180deg,
			hsla(var(--system-color-light-hsl), 0.8) 0%,
			hsla(var(--system-color-light-hsl), 0.6) 100%
		);
		backdrop-filter: blur(20px);
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}

	.main-area {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		background: #f8f9fa;
	}

	.app-store-header {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 30px;
		padding: 20px;
		background: white;
		border-radius: 15px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.store-icon img {
		width: 60px;
		height: 60px;
		border-radius: 12px;
	}

	.header-content h1 {
		margin: 0 0 5px 0;
		font-size: 1.8em;
		font-weight: 700;
		color: #1d1d1f;
	}

	.header-content p {
		margin: 0;
		color: #86868b;
		font-size: 1.1em;
	}

	.projects-section h2 {
		margin: 0 0 20px 0;
		font-size: 1.4em;
		font-weight: 600;
		color: #1d1d1f;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.project-card {
		background: white;
		border-radius: 15px;
		padding: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.project-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 15px;
	}

	.project-icon {
		font-size: 2em;
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8f9fa;
		border-radius: 10px;
	}

	.project-info {
		flex: 1;
	}

	.project-info h3 {
		margin: 0 0 4px 0;
		font-size: 1.2em;
		font-weight: 600;
		color: #1d1d1f;
	}

	.team-name {
		margin: 0;
		font-size: 0.9em;
		color: #86868b;
	}

	.category-badge {
		background: #007AFF;
		color: white;
		padding: 4px 8px;
		border-radius: 8px;
		font-size: 0.8em;
		font-weight: 500;
	}

	.project-description {
		margin-bottom: 15px;
		line-height: 1.5;
		color: #333;
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 15px;
	}

	.tech-tag {
		background: #e3f2fd;
		color: #1976d2;
		padding: 4px 8px;
		border-radius: 6px;
		font-size: 0.8em;
		font-weight: 500;
	}

	.project-actions {
		display: flex;
		gap: 10px;
	}

	.btn {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		font-size: 0.9em;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn.primary {
		background: #007AFF;
		color: white;
	}

	.btn.primary:hover {
		background: #0056b3;
	}

	.btn.secondary {
		background: #f8f9fa;
		color: #333;
		border: 1px solid #d1d1d6;
	}

	.btn.secondary:hover {
		background: #e9ecef;
	}

	.coming-soon {
		text-align: center;
		padding: 40px 20px;
		background: white;
		border-radius: 15px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.coming-soon h3 {
		margin: 0 0 10px 0;
		font-size: 1.3em;
		color: #1d1d1f;
	}

	.coming-soon p {
		margin: 0;
		color: #86868b;
		line-height: 1.5;
		max-width: 500px;
		margin: 0 auto;
	}
</style>
