<script lang="ts">
	import { onMount } from 'svelte';

	let terminalText: string = '';
	let currentIndex: number = 0;
	let isTyping: boolean = false;

	const fullText: string = `$ hackwwp --sponsor-info

Sponsor Tiers
=============

Up to $100 – FORTRAN Tier
-------------------------
Benefits:
• Logo on website
• Logo on t-shirts

$100 – $250 – Pascal Tier
-------------------------
Benefits:
• Everything in FORTRAN
• Social media mention
• Logo on presentation slides

$250 – $500 – C Tier
--------------------
Benefits:
• Everything in Pascal
• Logo on event banner
• Access to digital resume book
• Option to include swag in participant bags

$500 – $1000 – Java Tier
------------------------
Benefits:
• Everything in C
• Larger logo placement (website, t-shirts, signage)
• Opportunity to host a company booth
• Option to send mentors to support teams

$1000+ – Python Tier
--------------------
Benefits:
• Everything in Java
• Premium logo placement (front of shirts, main banner)
• Opportunity to judge projects or host a workshop
• Featured spotlight in opening/closing ceremony

Contact Information
-------------------
Email: hackwwp@gmail.com

Thank you for supporting hackWWP 2025!
======================================
`;

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
			<img src="app-icons/sponsors/256.png" alt="Sponsors Logo" class="terminal-logo" />
			hackwwp-terminal — Sponsor Information
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
