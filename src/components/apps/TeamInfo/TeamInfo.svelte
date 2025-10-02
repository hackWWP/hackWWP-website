<script lang="ts">
	interface TeamMember {
		name: string;
		role: string;
		department?: string;
	}

	const executiveBoard: TeamMember[] = [
		{ name: "Christopher Ren", role: "Executive Board" },
		{ name: "Syam Paladugu", role: "Executive Board" }
	];

	const marketingLogistics: TeamMember[] = [
		{ name: "Syam Paladugu", role: "Director" },
		{ name: "Christopher Ren", role: "Contest Logistics" },
		{ name: "Vijay Murali", role: "Marketing" },
		{ name: "Aarav Dwivedi", role: "Marketing" }
	];

	const contestOperations: TeamMember[] = [
		{ name: "Adhithya Jayamohan", role: "Director" },
		{ name: "Abhilash Kalyan", role: "Director" }
	];

	const judges: TeamMember[] = [
		{ name: "Christopher Ren", role: "Lead Judge" },
		{ name: "Syam Paladugu", role: "Assistant Judge" },
		{ name: "Vijay Murali", role: "Assistant Judge" }
	];

	const technology: TeamMember[] = [
		{ name: "Gabriel Jimenez", role: "Director, Lead Backend & Grading Server Developer" },
		{ name: "Christopher Ren", role: "Lead Frontend Developer & Grading Server Developer" },
		{ name: "Aarav Dwivedi", role: "Frontend Developer" },
		{ name: "Syam Paladugu", role: "Frontend Developer" },
		{ name: "Vijay Murali", role: "Backend Developer" },
		{ name: "Aarav Dwivedi", role: "Backend Developer" }
	];

	const outreach: TeamMember[] = [
		{ name: "Vijay Murali", role: "Director" }
	];
</script>

<div class="team-info">
	<div class="header">
		<h1>2025-2026 hackWWP Team</h1>
		<p>Meet the amazing team behind hackWWP!</p>
	</div>

	<div class="teams-grid">
		<div class="team-section">
			<h2>👑 Executive Board</h2>
			<div class="members">
				{#each executiveBoard as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="team-section">
			<h2>📢 Marketing & Logistics</h2>
			<div class="members">
				{#each marketingLogistics as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="team-section">
			<h2>⚙️ Contest Operations</h2>
			<div class="members">
				{#each contestOperations as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="team-section">
			<h2>⚖️ Panel of Judges</h2>
			<div class="members">
				{#each judges as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="team-section wide">
			<h2>💻 Technology</h2>
			<div class="members">
				{#each technology as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="team-section">
			<h2>🌟 Outreach</h2>
			<div class="members">
				{#each outreach as member}
					<div class="member-card">
						<div class="member-name">{member.name}</div>
						<div class="member-role">{member.role}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.team-info {
		padding: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100%;
		color: white;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 30px;
		padding: 20px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		backdrop-filter: blur(10px);
	}

	.header h1 {
		font-size: 2.5em;
		margin: 0;
		background: linear-gradient(45deg, #fff, #f0f0f0);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: 700;
	}

	.header p {
		margin: 10px 0 0 0;
		opacity: 0.9;
		font-size: 1.1em;
	}

	.teams-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}

	.team-section {
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 15px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.team-section.wide {
		grid-column: 1 / -1;
	}

	.team-section h2 {
		margin: 0 0 15px 0;
		font-size: 1.3em;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.members {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.team-section.wide .members {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
	}

	.member-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 12px 15px;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: transform 0.2s ease, background 0.2s ease;
	}

	.member-card:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.1);
	}

	.member-name {
		font-weight: 600;
		font-size: 1.1em;
		margin-bottom: 4px;
	}

	.member-role {
		font-size: 0.9em;
		opacity: 0.8;
		line-height: 1.3;
	}

	@media (max-width: 768px) {
		.teams-grid {
			grid-template-columns: 1fr;
		}
		
		.team-section.wide {
			grid-column: 1;
		}
		
		.team-section.wide .members {
			grid-template-columns: 1fr;
		}
	}
</style>