<script lang="ts">
	import { onMount } from 'svelte';
	
	let terminalText = '';
	let currentIndex = 0;
	let isTyping = false;
	let finished = false;
	
	const fullText = `$ hackwwp --team-info

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
Director: Vijay Murali
`;

	onMount(() => {
		isTyping = true;
		typeText();
	});
	
	function typeText() {
		if (currentIndex < fullText.length) {
			terminalText += fullText[currentIndex];
			currentIndex++;
			
			const delay = Math.random() * 25 + 8;
			setTimeout(typeText, delay);
		} else {
			isTyping = false;
			// after finishing, add the prompt
			terminalText += `\n$ `;
			finished = true;
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
		<div class="terminal-title">
			<img src="/hackWWP.png" alt="hackWWP Logo" class="terminal-logo" />
			hackwwp-terminal — Team Information
		</div>
	</div>
	
	<div class="terminal-body">
		<pre class="terminal-text">
{terminalText}{#if isTyping}<span class="cursor">█</span>{/if}{#if finished}<span class="cursor">█</span>{/if}
		</pre>
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
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.terminal-logo {
		width: 18px;
		height: 18px;
		border-radius: 3px;
		object-fit: contain;
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
