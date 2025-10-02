<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Command {
		input: string;
		output: string[];
		timestamp: Date;
	}

	let terminal: HTMLElement;
	let currentInput = '';
	let commandHistory: Command[] = [];
	let historyIndex = -1;
	let currentDirectory = '~/hackwwp';
	
	const welcomeMessage = [
		'Welcome to hackWWP Terminal v1.0',
		'Type "help" for available commands',
		''
	];

	const fileSystem = {
		'hackwwp': {
			'project': {
				'src': {
					'main.js': 'console.log("Hello hackWWP!");',
					'style.css': 'body { background: #f0f0f0; }',
					'index.html': '<!DOCTYPE html><html>...</html>'
				},
				'package.json': '{"name": "hackwwp-project", "version": "1.0.0"}',
				'README.md': '# My hackWWP Project\n\nBuilt during hackWWP 2025!'
			},
			'docs': {
				'schedule.txt': 'hackWWP Schedule\n\nJune 13-14, 2025\nPrinceton University CS 104/105',
				'team-info.txt': 'Team Information\n\nExecutive Board:\n- Christopher Ren\n- Syam Paladugu'
			}
		}
	};

	onMount(() => {
		commandHistory.push({
			input: '',
			output: welcomeMessage,
			timestamp: new Date()
		});
		scrollToBottom();
	});

	function executeCommand(input: string) {
		const command = input.trim().toLowerCase();
		const args = command.split(' ');
		const cmd = args[0];
		let output: string[] = [];

		switch (cmd) {
			case 'help':
				output = [
					'Available commands:',
					'  help          - Show this help message',
					'  ls            - List directory contents',
					'  cd <dir>      - Change directory',
					'  pwd           - Print working directory',
					'  cat <file>    - Display file contents',
					'  clear         - Clear terminal',
					'  whoami        - Display current user',
					'  date          - Show current date and time',
					'  echo <text>   - Display text',
					'  hackwwp       - Show hackWWP info',
					'  git status    - Show git repository status',
					'  npm --version - Show npm version',
					'  node --version- Show node version',
					''
				];
				break;
			
			case 'ls':
				if (currentDirectory === '~/hackwwp') {
					output = ['project/', 'docs/', ''];
				} else if (currentDirectory === '~/hackwwp/project') {
					output = ['src/', 'package.json', 'README.md', ''];
				} else if (currentDirectory === '~/hackwwp/project/src') {
					output = ['main.js', 'style.css', 'index.html', ''];
				} else if (currentDirectory === '~/hackwwp/docs') {
					output = ['schedule.txt', 'team-info.txt', ''];
				} else {
					output = ['Directory not found', ''];
				}
				break;
			
			case 'pwd':
				output = [currentDirectory, ''];
				break;
			
			case 'cd':
				const target = args[1];
				if (!target || target === '~') {
					currentDirectory = '~/hackwwp';
					output = [''];
				} else if (target === '..') {
					const parts = currentDirectory.split('/');
					if (parts.length > 2) {
						parts.pop();
						currentDirectory = parts.join('/');
					}
					output = [''];
				} else {
					const newPath = currentDirectory === '~/hackwwp' ? 
						`~/hackwwp/${target}` : 
						`${currentDirectory}/${target}`;
					
					if (target === 'project' && currentDirectory === '~/hackwwp') {
						currentDirectory = '~/hackwwp/project';
						output = [''];
					} else if (target === 'src' && currentDirectory === '~/hackwwp/project') {
						currentDirectory = '~/hackwwp/project/src';
						output = [''];
					} else if (target === 'docs' && currentDirectory === '~/hackwwp') {
					currentDirectory = '~/hackwwp/docs';
					output = [''];
				} else {
						output = [`cd: ${target}: No such file or directory`, ''];
					}
				}
				break;
			
			case 'cat':
				const filename = args[1];
				if (!filename) {
					output = ['cat: missing file operand', ''];
				} else if (filename === 'README.md' && currentDirectory === '~/hackwwp/project') {
					output = ['# My hackWWP Project', '', 'Built during hackWWP 2025!', 'An amazing hackathon experience.', ''];
				} else if (filename === 'package.json' && currentDirectory === '~/hackwwp/project') {
					output = ['{', '  "name": "hackwwp-project",', '  "version": "1.0.0",', '  "description": "My hackWWP project"', '}', ''];
				} else if (filename === 'main.js' && currentDirectory === '~/hackwwp/project/src') {
					output = ['console.log("Hello hackWWP!");', 'console.log("Building amazing things!");', ''];
				} else if (filename === 'schedule.txt' && currentDirectory === '~/hackwwp/docs') {
					output = ['hackWWP Schedule', '', 'June 13-14, 2025', 'Princeton University CS 104/105', '12 PM - 12 PM (24 hours)', ''];
				} else {
					output = [`cat: ${filename}: No such file or directory`, ''];
				}
				break;
			
			case 'clear':
				commandHistory = [];
				return;
			
			case 'whoami':
				output = ['hackwwp-participant', ''];
				break;
			
			case 'date':
				output = [new Date().toString(), ''];
				break;
			
			case 'echo':
				const text = args.slice(1).join(' ');
				output = [text || '', ''];
				break;
			
			case 'hackwwp':
				output = [
					'🚀 hackWWP 2025',
					'Princeton University Computer Science Hackathon',
					'June 13-14, 2025 | CS 104/105',
					'',
					'Build • Learn • Connect',
					'24 hours of innovation and coding!',
					''
				];
				break;
			
			case 'git':
				if (args[1] === 'status') {
					output = [
						'On branch main',
						'Your branch is up to date with \'origin/main\'.',
						'',
						'Changes not staged for commit:',
						'  (use "git add <file>..." to update what will be committed)',
						'  (use "git checkout -- <file>..." to discard changes)',
						'',
						'	modified:   src/main.js',
						'',
						'no changes added to commit (use "git add" or "git commit -a")',
						''
					];
				} else {
					output = [`git: '${args.slice(1).join(' ')}' is not a git command.`, ''];
				}
				break;
			
			case 'npm':
				if (args[1] === '--version') {
					output = ['9.8.1', ''];
				} else {
					output = ['npm <command>', '', 'Usage:', '', 'npm install, npm start, npm test', ''];
				}
				break;
			
			case 'node':
				if (args[1] === '--version') {
					output = ['v18.17.1', ''];
				} else {
					output = ['Welcome to Node.js v18.17.1.', 'Type ".help" for more information.', ''];
				}
				break;
			
			case '':
				output = [''];
				break;
			
			default:
				output = [`command not found: ${cmd}`, ''];
		}

		commandHistory.push({
			input: input,
			output: output,
			timestamp: new Date()
		});

		currentInput = '';
		setTimeout(scrollToBottom, 0);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			executeCommand(currentInput);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				const command = commandHistory[commandHistory.length - 1 - historyIndex];
				currentInput = command.input;
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				const command = commandHistory[commandHistory.length - 1 - historyIndex];
				currentInput = command.input;
			} else if (historyIndex === 0) {
				historyIndex = -1;
				currentInput = '';
			}
		}
	}

	function scrollToBottom() {
		if (terminal) {
			terminal.scrollTop = terminal.scrollHeight;
		}
	}

	function focusInput() {
		const input = document.querySelector('.terminal-input') as HTMLInputElement;
		if (input) input.focus();
	}
</script>

<div class="terminal" bind:this={terminal} on:click={focusInput} on:keydown={(e) => e.key === 'Enter' && focusInput()} role="button" tabindex="0">
	<div class="terminal-header">
		<div class="terminal-title">hackwwp@princeton:~$ terminal</div>
		<div class="spacer"></div>
	</div>
	
	<div class="terminal-content">
		{#each commandHistory as command}
			{#if command.input}
				<div class="command-line">
					<span class="prompt">hackwwp@princeton:{currentDirectory}$</span>
					<span class="command">{command.input}</span>
				</div>
			{/if}
			{#each command.output as line}
				<div class="output-line">{line}</div>
			{/each}
		{/each}
		
		<div class="current-line">
			<span class="prompt">hackwwp@princeton:{currentDirectory}$</span>
			<input 
				type="text" 
				class="terminal-input"
				bind:value={currentInput}
				on:keydown={handleKeydown}
				autocomplete="off"
				spellcheck="false"
			/>
		</div>
	</div>
</div>

<style>
	.terminal {
		height: 100%;
		background: #1e1e1e;
		color: #d4d4d4;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 13px;
		line-height: 1.4;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		padding: 8px 16px;
		background: #2d2d2d;
		border-bottom: 1px solid #3e3e3e;
		user-select: none;
	}

	.terminal-title {
		margin-left: 16px;
		color: #cccccc;
		font-size: 12px;
	}

	.spacer {
		flex: 1;
	}

	.terminal-content {
		flex: 1;
		padding: 16px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.command-line, .current-line, .output-line {
		margin-bottom: 2px;
		word-wrap: break-word;
	}

	.prompt {
		color: #4ec9b0;
		font-weight: 600;
	}

	.command {
		color: #d4d4d4;
		margin-left: 8px;
	}

	.output-line {
		color: #cccccc;
		white-space: pre-wrap;
	}

	.current-line {
		display: flex;
		align-items: center;
	}

	.terminal-input {
		background: transparent;
		border: none;
		outline: none;
		color: #d4d4d4;
		font-family: inherit;
		font-size: inherit;
		margin-left: 8px;
		flex: 1;
		caret-color: #d4d4d4;
	}

	.terminal-input::selection {
		background: rgba(255, 255, 255, 0.2);
	}

	/* Scrollbar styling */
	.terminal-content::-webkit-scrollbar {
		width: 8px;
	}

	.terminal-content::-webkit-scrollbar-track {
		background: #2d2d2d;
	}

	.terminal-content::-webkit-scrollbar-thumb {
		background: #555555;
		border-radius: 4px;
	}

	.terminal-content::-webkit-scrollbar-thumb:hover {
		background: #666666;
	}
</style>