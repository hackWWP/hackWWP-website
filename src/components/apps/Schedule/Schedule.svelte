<script lang="ts">
	interface ScheduleEvent {
		time: string;
		title: string;
		description?: string;
		type: 'main' | 'workshop' | 'food' | 'social' | 'judging';
	}

	const day1Events: ScheduleEvent[] = [
		{ time: "12:00 PM", title: "Registration & Check-in", description: "Welcome to hackWWP! Get your swag and meet the team", type: "main" },
		{ time: "12:30 PM", title: "Opening Ceremony", description: "Kick-off presentation and rules overview", type: "main" },
		{ time: "1:00 PM", title: "Team Formation", description: "Find your teammates and start brainstorming", type: "social" },
		{ time: "1:30 PM", title: "Lunch", description: "Pizza and refreshments", type: "food" },
		{ time: "2:00 PM", title: "Hacking Begins!", description: "Let the coding commence!", type: "main" },
		{ time: "3:00 PM", title: "Git Workshop", description: "Version control best practices", type: "workshop" },
		{ time: "4:30 PM", title: "API Integration Workshop", description: "Learn to work with external APIs", type: "workshop" },
		{ time: "6:00 PM", title: "Dinner", description: "Sandwiches and snacks", type: "food" },
		{ time: "8:00 PM", title: "UI/UX Design Workshop", description: "Creating beautiful user interfaces", type: "workshop" },
		{ time: "10:00 PM", title: "Late Night Snacks", description: "Coffee, energy drinks, and cookies", type: "food" },
		{ time: "12:00 AM", title: "Midnight Check-in", description: "How's your progress? Need help?", type: "social" }
	];

	const day2Events: ScheduleEvent[] = [
		{ time: "2:00 AM", title: "Quiet Hours Begin", description: "Respect sleeping participants", type: "social" },
		{ time: "6:00 AM", title: "Breakfast", description: "Bagels, coffee, and energy for the final push", type: "food" },
		{ time: "8:00 AM", title: "Morning Standup", description: "Share progress and get feedback", type: "social" },
		{ time: "10:00 AM", title: "Project Submission Deadline", description: "Final push! Submit your projects", type: "main" },
		{ time: "10:30 AM", title: "Judging Period", description: "Judges review all submissions", type: "judging" },
		{ time: "11:00 AM", title: "Project Presentations", description: "Teams present their projects (3 min each)", type: "main" },
		{ time: "11:45 AM", title: "Closing Ceremony & Awards", description: "Winner announcements and prizes", type: "main" },
		{ time: "12:00 PM", title: "Event End", description: "Thank you for participating!", type: "main" }
	];

	function getEventTypeColor(type: string): string {
		switch (type) {
			case 'main': return '#4F46E5';
			case 'workshop': return '#059669';
			case 'food': return '#DC2626';
			case 'social': return '#7C3AED';
			case 'judging': return '#EA580C';
			default: return '#6B7280';
		}
	}

	function getEventTypeIcon(type: string): string {
		switch (type) {
			case 'main': return '🚀';
			case 'workshop': return '🛠️';
			case 'food': return '🍕';
			case 'social': return '🤝';
			case 'judging': return '⚖️';
			default: return '📅';
		}
	}
</script>

<div class="schedule">
	<div class="header">
		<h1>hackWWP Schedule</h1>
		<p>24 hours of innovation, learning, and fun!</p>
	</div>

	<div class="days-container">
		<div class="day-section">
			<h2>📅 Day 1 - June 13, 2025</h2>
			<div class="events">
				{#each day1Events as event}
					<div class="event-card" style="border-left-color: {getEventTypeColor(event.type)}">
						<div class="event-time">{event.time}</div>
						<div class="event-content">
							<div class="event-title">
								<span class="event-icon">{getEventTypeIcon(event.type)}</span>
								{event.title}
							</div>
							{#if event.description}
								<div class="event-description">{event.description}</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="day-section">
			<h2>📅 Day 2 - June 14, 2025</h2>
			<div class="events">
				{#each day2Events as event}
					<div class="event-card" style="border-left-color: {getEventTypeColor(event.type)}">
						<div class="event-time">{event.time}</div>
						<div class="event-content">
							<div class="event-title">
								<span class="event-icon">{getEventTypeIcon(event.type)}</span>
								{event.title}
							</div>
							{#if event.description}
								<div class="event-description">{event.description}</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="legend">
		<h3>Event Types</h3>
		<div class="legend-items">
			<div class="legend-item">
				<div class="legend-color" style="background-color: {getEventTypeColor('main')}"></div>
				<span>🚀 Main Events</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: {getEventTypeColor('workshop')}"></div>
				<span>🛠️ Workshops</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: {getEventTypeColor('food')}"></div>
				<span>🍕 Food & Drinks</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: {getEventTypeColor('social')}"></div>
				<span>🤝 Social</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background-color: {getEventTypeColor('judging')}"></div>
				<span>⚖️ Judging</span>
			</div>
		</div>
	</div>
</div>

<style>
	.schedule {
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

	.days-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-bottom: 30px;
	}

	.day-section {
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 15px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.day-section h2 {
		margin: 0 0 20px 0;
		font-size: 1.4em;
		font-weight: 600;
		text-align: center;
	}

	.events {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.event-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 15px;
		border-radius: 10px;
		border-left: 4px solid;
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		gap: 15px;
		transition: transform 0.2s ease, background 0.2s ease;
	}

	.event-card:hover {
		transform: translateX(5px);
		background: rgba(255, 255, 255, 0.1);
	}

	.event-time {
		font-weight: 600;
		font-size: 0.9em;
		min-width: 80px;
		color: #FFD700;
	}

	.event-content {
		flex: 1;
	}

	.event-title {
		font-weight: 600;
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.event-icon {
		font-size: 1.1em;
	}

	.event-description {
		font-size: 0.9em;
		opacity: 0.8;
		line-height: 1.4;
	}

	.legend {
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 15px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.legend h3 {
		margin: 0 0 15px 0;
		text-align: center;
		font-size: 1.2em;
	}

	.legend-items {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 15px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.9em;
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	@media (max-width: 768px) {
		.days-container {
			grid-template-columns: 1fr;
		}
		
		.event-card {
			flex-direction: column;
			gap: 8px;
		}
		
		.event-time {
			min-width: auto;
		}
		
		.legend-items {
			flex-direction: column;
			align-items: center;
		}
	}
</style>