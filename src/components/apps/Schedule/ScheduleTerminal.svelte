<script lang="ts">
	import { onMount } from 'svelte';
	
	let terminalText = '';
	let currentIndex = 0;
	let isTyping = false;
	
	const fullText = `$ hackwwp --schedule

hackWWP 2025 Event Schedule
===========================

Day 1 - Friday, June 13, 2025
==============================

12:00 PM - CHECK-IN & REGISTRATION
----------------------------------
🏢 Location: CS Building Lobby
📝 What: Participant check-in, badge pickup
👥 Who: All participants
🎒 Note: Bring valid ID

01:00 PM - OPENING CEREMONY
---------------------------
🏢 Location: CS 104/105 Main Hall
🎤 What: Welcome, rules, timeline overview
👥 Who: All participants + organizers
⏱️ Duration: 45 minutes

02:00 PM - TEAM FORMATION
-------------------------
🏢 Location: CS 104 & 105
🤝 What: Network, form teams, brainstorm
👥 Who: Looking for teams
⏱️ Duration: 60 minutes

03:00 PM - HACKING BEGINS!
--------------------------
🏢 Location: CS 104/105
💻 What: Official start of development
👥 Who: All teams
🚀 Note: Let the creativity flow!

06:00 PM - DINNER & NETWORKING
------------------------------
🏢 Location: CS Building Atrium
🍕 What: Pizza, networking, energy boost
👥 Who: All participants
⏱️ Duration: 60 minutes

08:00 PM - WORKSHOP: API INTEGRATION
------------------------------------
🏢 Location: CS 105
🛠️ What: Learn API integration techniques
👥 Who: Optional attendance
⏱️ Duration: 90 minutes

10:00 PM - LATE NIGHT SNACKS
----------------------------
🏢 Location: CS Building Kitchen
🍿 What: Snacks, coffee, energy drinks
👥 Who: Night owls
🌙 Note: Fuel for the all-nighter

12:00 AM - MIDNIGHT ENERGY BOOST
--------------------------------
🏢 Location: CS 104/105
⚡ What: Games, music, motivation
👥 Who: Still coding
🎮 Note: Take a break, recharge

Day 2 - Saturday, June 14, 2025
================================

08:00 AM - BREAKFAST & STANDUP
------------------------------
🏢 Location: CS Building Atrium
🥐 What: Breakfast, team check-ins
👥 Who: Early birds + teams
☕ Note: Coffee will be served

10:00 AM - MENTOR OFFICE HOURS
------------------------------
🏢 Location: CS 105 Side Rooms
👨‍💼 What: One-on-one mentoring sessions
👥 Who: Teams needing guidance
📝 Note: Sign up in advance

12:00 PM - FINAL SUBMISSION DEADLINE
------------------------------------
🏢 Location: Online Portal
💾 What: Submit final projects
👥 Who: All teams (MANDATORY)
⚠️ Note: Hard deadline - no extensions!

12:30 PM - PROJECT PRESENTATIONS
--------------------------------
🏢 Location: CS 104 Main Hall
🎤 What: 3-minute team presentations
👥 Who: All teams present
⏱️ Duration: ~90 minutes

02:00 PM - JUDGING & DELIBERATION
---------------------------------
🏢 Location: CS 105 (Private)
⚖️ What: Judges review and decide
👥 Who: Judges only
🤫 Note: Results announcement at 3 PM

03:00 PM - AWARDS CEREMONY
--------------------------
🏢 Location: CS 104 Main Hall
🏆 What: Winner announcements, prizes
👥 Who: All participants
📸 Note: Photo opportunities!

04:00 PM - CLOSING & NETWORKING
-------------------------------
🏢 Location: CS Building Lobby
🤝 What: Final networking, contacts
👥 Who: All participants
👋 Note: See you next year!

Legend:
-------
🏢 Location indicator
🎤 Presentation/Speaking event
💻 Technical/Development time
🍕 Food/Refreshments
👥 Attendance info
⏱️ Duration estimate
📝 Notes/Requirements
🏆 Competition element

Emergency Contacts:
-------------------
📱 Event Hotline: (609) 258-1000
💬 Discord: #hackwwp-help
📧 Email: help@hackwwp.princeton.edu

$ █`;

	onMount(() => {
		isTyping = true;
		typeText();
	});
	
	function typeText() {
		if (currentIndex < fullText.length) {
			terminalText += fullText[currentIndex];
			currentIndex++;
			
			const delay = Math.random() * 20 + 5;
			setTimeout(typeText, delay);
		} else {
			isTyping = false;
		}
	}
</script>

<div class="terminal-container">
	<div class="terminal-header">
		<div class="terminal-controls">
			<div class="control-btn red"></div>
			<div class="control-btn yellow"></div>
			<div class="control-btn green"></div>
		</div>
		<div class="terminal-title">hackwwp-terminal — Event Schedule</div>
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
	
	.control-btn.red {
		background: #ff5f56;
	}
	
	.control-btn.yellow {
		background: #ffbd2e;
	}
	
	.control-btn.green {
		background: #27ca3f;
	}
	
	.terminal-title {
		color: #a0a0a0;
		font-size: 0.9rem;
		font-weight: 500;
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