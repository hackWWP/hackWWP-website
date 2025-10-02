<script lang="ts">

</script>

<div class="event-info">
	<div class="header">
		<h1>hackWWP 2025</h1>
		<h2>Princeton University Computer Science Hackathon</h2>
	</div>
	
	<div class="content">
		<div class="event-details">
			<h3>📅 Event Details</h3>
			<div class="detail-item">
				<strong>Dates:</strong> June 13-14, 2025
			</div>
			<div class="detail-item">
				<strong>Time:</strong> 12:00 PM (June 13) - 12:00 PM (June 14)
			</div>
			<div class="detail-item">
				<strong>Location:</strong> Princeton University CS 104/105
			</div>
			<div class="detail-item">
				<strong>Duration:</strong> 24 Hours
			</div>
		</div>

		<div class="about-event">
			<h3>🚀 About hackWWP</h3>
			<p>
				Join us for an exciting 24-hour hackathon at Princeton University! hackWWP brings together 
				innovative minds to create, build, and showcase incredible projects. Whether you're a 
				seasoned developer or just starting your coding journey, this event is designed to 
				challenge and inspire.
			</p>
		</div>

		<div class="what-to-expect">
			<h3>💡 What to Expect</h3>
			<ul>
				<li>Team formation and networking opportunities</li>
				<li>Mentor guidance from industry professionals</li>
				<li>Workshops and tech talks</li>
				<li>Prizes and recognition for outstanding projects</li>
				<li>Free food and refreshments throughout the event</li>
				<li>Fun activities and community building</li>
			</ul>
		</div>

		<div class="contact-info">
			<h3>📧 Contact</h3>
			<p>Have questions? Reach out to our team through the Messages app or contact our organizers directly.</p>
		</div>
	</div>
</div>

<style>
	.event-info {
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
		font-size: 3em;
		margin: 0;
		background: linear-gradient(45deg, #fff, #f0f0f0);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: 700;
	}

	.header h2 {
		font-size: 1.2em;
		margin: 10px 0 0 0;
		opacity: 0.9;
		font-weight: 300;
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.event-details,
	.about-event,
	.what-to-expect,
	.contact-info {
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 15px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.what-to-expect {
		grid-column: 1 / -1;
	}

	.contact-info {
		grid-column: 1 / -1;
		text-align: center;
	}

	h3 {
		margin: 0 0 15px 0;
		font-size: 1.3em;
		font-weight: 600;
	}

	.detail-item {
		margin: 10px 0;
		padding: 8px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.detail-item:last-child {
		border-bottom: none;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		margin: 8px 0;
		padding: 8px 0;
		padding-left: 20px;
		position: relative;
	}

	li::before {
		content: "✨";
		position: absolute;
		left: 0;
	}

	p {
		line-height: 1.6;
		opacity: 0.9;
	}

	@media (max-width: 768px) {
		.content {
			grid-template-columns: 1fr;
		}
		
		.what-to-expect,
		.contact-info {
			grid-column: 1;
		}
	}
</style>