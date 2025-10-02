<script lang="ts">
	import { onMount } from 'svelte';

	let terminalText: string = '';
	let currentIndex: number = 0;
	let isTyping: boolean = false;

	const fullText: string = `$ hackwwp --event-info

Welcome to hackWWP 2025!
========================

Event Details:
--------------
Date: June 13-14, 2025
Time: 12:00 PM (June 13) to 12:00 PM (June 14)
Location: Princeton University
Venue: Computer Science Building, Rooms 104 & 105

Event Schedule:
---------------
Day 1 (June 13):
  12:00 PM - Check-in & Welcome
  01:00 PM - Opening Ceremony
  02:00 PM - Networking
  03:00 PM - Hacking Begins
  06:00 PM - Dinner
  08:00 PM - Workshop: API Integration
  10:00 PM - Snacks
  11:59 PM - Late Night Hacking

Day 2 (June 14):
  12:00 AM - Midnight Energy Boost
  08:00 AM - Breakfast & Morning Standup
  10:00 AM - Final Hacking Hours
  11:00 AM - Project Submission Deadline
  12:00 PM - Results Announcement & Closing Ceremony

What to Bring:
--------------
Laptop & Charger
Phone & Charger
Valid ID
Caffeine Tolerance

Getting There:
--------------
Address: Princeton University
         Computer Science Building
         35 Olden Street
         Princeton, NJ 08544

Parking: Available on campus
Public Transit: NJ Transit Princeton Branch
Walking: Campus is pedestrian-friendly

Contact Information:
--------------------
Email: hackwwp@gmail.com

$ hackwwp --team-info

2025-2026 hackWWP Team
======================

Executive Board
---------------
Christopher Ren
Syam Paladugu

Marketing & Logistics
---------------------
Director: Syam Paladugu
Christopher Ren, Contest Logistics
Vijay Murali, Marketing
Aarav Dwivedi, Marketing

Contest Operations
------------------
Director: Adhithya Jayamohan
Director: Abhilash Kalyan

Panel of Judges
---------------
Christopher Ren, Lead Judge
Syam Paladugu, Asst. Judge
Vijay Murali, Asst. Judge

Technology
----------
Director, Lead Backend & Grading Server Developer: Gabriel Jimenez
Christopher Ren, Lead Frontend Developer & Grading Server Developer
Aarav Dwivedi, Frontend Developer
Syam Paladugu, Frontend Developer
Vijay Murali, Backend Developer
Aarav Dwivedi, Backend Developer

Outreach
--------
Director: Vijay Murali`;


	onMount(() => {
		isTyping = true;
		typeText();
	});

	function typeText() {
		if (currentIndex < fullText.length) {
			terminalText = terminalText + fullText[currentIndex];
			currentIndex++;

			const delay = Math.random() * 30 + 10;
			setTimeout(typeText, delay);
		} else {
			isTyping = false;
		}
	}
</script>

<div class="terminal-container">
	<div class="terminal-header">
		<div class="terminal-title">
				<img src="app-icons/hackwwp/192.png" alt="hackWWP Logo" class="terminal-logo" />
				hackwwp-terminal — Event Information
		</div>
	</div>

	<div class="terminal-body">
		<pre class="terminal-text">{terminalText}{#if isTyping}<span class="cursor">█</span>{/if}</pre>
	</div>
</div>

<style>
	.terminal-container {
		height: 100%;
		background: #1e1e1e;
		color: #00ff00;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.terminal-header {
		background: #2d2d2d;
		padding: 12px 16px;
		border-bottom: 1px solid #404040;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.terminal-controls {
		display: flex;
		gap: 8px;
	}

	.control-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.terminal-title {
		color: #a0a0a0;
		font-size: 0.9rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.terminal-logo {
		width: 18px;
		height: 18px;
		border-radius: 3px;
		object-fit: contain;
		margin-top: 2px;
		margin-left: 67px;
	}

	.terminal-body {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		background: #1e1e1e;
	}

	.terminal-text {
		font-size: 14px;
		line-height: 1.4;
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		color: #00ff00;
		text-shadow: 0 0 5px #00ff0040;
	}

	.cursor {
		animation: blink 1s infinite;
		color: #00ff00;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	.terminal-body::-webkit-scrollbar {
		width: 8px;
	}

	.terminal-body::-webkit-scrollbar-track {
		background: #2d2d2d;
	}

	.terminal-body::-webkit-scrollbar-thumb {
		background: #4a4a4a;
		border-radius: 4px;
	}

	.terminal-body::-webkit-scrollbar-thumb:hover {
		background: #5a5a5a;
	}
</style>
