<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { messagesService, type LocalMessage } from '../../../services/messagesService';
	import { userService } from '../../../services/userService';
	
	let messages: LocalMessage[] = [];
	let messageInput = '';
	let searchQuery = '';
	let selectedConversation = 'General';
	let conversations: string[] = [];
	let unsubscribeMessages: (() => void) | null = null;
	
	// Reactive variables that update when userService state changes
	$: currentUser = userService.getCurrentUser();
	$: isLoggedIn = userService.isLoggedIn();
	$: filteredMessages = filterMessages(messages, selectedConversation, searchQuery);
	
	onMount(async () => {
		await loadMessages();
		await loadConversations();
		
		// Subscribe to real-time message updates
		unsubscribeMessages = messagesService.addListener((newMessages) => {
			messages = newMessages;
		});
	});
	
	onDestroy(() => {
		if (unsubscribeMessages) {
			unsubscribeMessages();
		}
	});

	async function loadMessages() {
		messages = await messagesService.getMessages();
	}
	
	async function loadConversations() {
		conversations = await messagesService.getConversations();
		if (conversations.length === 0) {
			conversations = ['General'];
		}
	}

	async function sendMessage() {
		if (!messageInput.trim() || !currentUser) return;
		
		const result = await messagesService.sendMessage(messageInput.trim(), selectedConversation);
		if (result.success) {
			messageInput = '';
			messages = await messagesService.getMessages();
		} else {
			console.error('Failed to send message:', result.error);
		}
	}
	
	function filterMessages(allMessages: LocalMessage[], conversation: string, search: string): LocalMessage[] {
		let filtered = allMessages;
		
		// Filter by conversation (for now, just show all messages)
		// In a real app, you'd filter by conversation participants
		
		// Filter by search query
		if (search.trim()) {
			filtered = filtered.filter(msg => 
				msg.content.toLowerCase().includes(search.toLowerCase()) ||
				msg.fromUser.toLowerCase().includes(search.toLowerCase())
			);
		}
		
		return filtered;
	}
	
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	}
	
	function getMessageStatusIcon(status: string): string {
		switch (status) {
			case 'sending': return '⏳';
			case 'sent': return '✓';
			case 'delivered': return '✓✓';
			case 'read': return '✓✓';
			default: return '';
		}
	}

	function logout() {
		if (userService.isGuest()) {
			messagesService.clearAllMessages();
		}
		userService.logout();
	}

	function login() {
		// Redirect to startup login
		window.location.reload();
	}
	
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script><div class="messages-app">
	{#if !isLoggedIn}
		<div class="login-screen">
			<div class="login-icon">💬</div>
			<h2>Messages</h2>
			<p>Please sign in to start messaging</p>
			<button on:click={login} class="login-btn">Sign In</button>
		</div>
	{:else}
		<!-- Conversations Sidebar -->
		<div class="conversations-sidebar">
			<div class="sidebar-header">
				<h2>Messages</h2>
				<button on:click={logout} class="logout-btn" title="Sign Out">⏻</button>
			</div>
			
			<div class="search-container">
				<input
					type="text"
					placeholder="Search"
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>
			
			<div class="conversations-list">
				{#each conversations as conversation}
					<div 
						class="conversation-item"
						class:active={selectedConversation === conversation}
						role="button"
						tabindex="0"
						on:click={() => selectedConversation = conversation}
						on:keydown={(e) => e.key === 'Enter' && (selectedConversation = conversation)}
					>
						<div class="conversation-avatar">
							{conversation.charAt(0).toUpperCase()}
						</div>
						<div class="conversation-details">
							<div class="conversation-name">{conversation}</div>
							<div class="conversation-preview">Tap to view messages</div>
						</div>
						<div class="conversation-time">now</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Messages Area -->
		<div class="messages-area">
			<div class="messages-header">
				<div class="conversation-title">
					<h3>{selectedConversation}</h3>
					<div class="participants-count">{filteredMessages.length} messages</div>
				</div>
			</div>

			<div class="messages-content">
				<div class="messages-list">
					{#each filteredMessages as message (message.id)}
						<div class="message" class:own={message.isFromCurrentUser}>
							<div class="message-bubble" class:own={message.isFromCurrentUser}>
								<div class="message-text">{message.content}</div>
								<div class="message-time">
									{formatTime(message.timestamp)}
									{#if message.isFromCurrentUser}
										<span class="message-status" class:read={message.status === 'read'}>
											{getMessageStatusIcon(message.status)}
										</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="message-input-container">
				<div class="message-input-wrapper">
					<textarea
						bind:value={messageInput}
						on:keydown={handleKeyPress}
						placeholder="Message"
						class="message-input"
						rows="1"
					></textarea>
					<button 
						on:click={sendMessage} 
						disabled={!messageInput.trim()}
						class="send-btn"
					>
						→
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.messages-app {
		height: 100%;
		display: flex;
		background: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		overflow: hidden;
	}

	/* Login Screen */
	.login-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		text-align: center;
		padding: 2rem;
		background: #f5f5f7;
	}

	.login-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.login-screen h2 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.login-screen p {
		margin: 0 0 2rem 0;
		color: #86868b;
		font-size: 1.1rem;
	}

	.login-btn {
		background: #007aff;
		border: none;
		color: white;
		padding: 0.8rem 2rem;
		border-radius: 20px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.login-btn:hover {
		background: #0056b3;
	}

	/* Conversations Sidebar */
	.conversations-sidebar {
		width: 280px;
		background: #f5f5f7;
		border-right: 1px solid #d1d1d6;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 3rem 16px 12px 16px;
		border-bottom: 1px solid #d1d1d6;
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.logout-btn {
		background: none;
		border: none;
		color: #8e8e93;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 4px;
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.logout-btn:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.search-container {
		padding: 12px 16px;
	}

	.search-input {
		width: 100%;
		padding: 8px 12px;
		border: none;
		border-radius: 10px;
		background: #e5e5ea;
		font-size: 14px;
		outline: none;
		transition: background 0.2s ease;
		box-sizing: border-box;
	}

	.search-input:focus {
		background: #d1d1d6;
	}

	.conversations-list {
		flex: 1;
		overflow-y: auto;
	}

	.conversation-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		cursor: pointer;
		transition: background 0.2s ease;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.conversation-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.conversation-item.active {
		background: #007aff;
		color: white;
	}

	.conversation-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #007aff;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 16px;
		flex-shrink: 0;
	}

	.conversation-item.active .conversation-avatar {
		background: rgba(255, 255, 255, 0.2);
	}

	.conversation-details {
		flex: 1;
		min-width: 0;
	}

	.conversation-name {
		font-weight: 600;
		font-size: 15px;
		margin-bottom: 2px;
	}

	.conversation-preview {
		font-size: 13px;
		opacity: 0.7;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.conversation-time {
		font-size: 12px;
		opacity: 0.6;
		flex-shrink: 0;
	}

	/* Messages Area */
	.messages-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.messages-header {
		padding: 3rem 20px 12px 20px;
		border-bottom: 1px solid #f0f0f0;
	}

	.conversation-title h3 {
		margin: 0 0 4px 0;
		font-size: 1.3rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.participants-count {
		font-size: 13px;
		color: #8e8e93;
	}

	.messages-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.messages-list {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.message {
		display: flex;
		margin-bottom: 4px;
	}

	.message.own {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 60%;
		padding: 8px 12px;
		border-radius: 18px;
		position: relative;
		word-wrap: break-word;
	}

	.message-bubble:not(.own) {
		background: #e5e5ea;
		color: #1d1d1f;
		margin-right: auto;
	}

	.message-bubble.own {
		background: #007aff;
		color: white;
		margin-left: auto;
	}

	.message-text {
		font-size: 15px;
		line-height: 1.3;
	}

	.message-time {
		font-size: 11px;
		opacity: 0.6;
		margin-top: 4px;
		text-align: right;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.message-bubble:not(.own) .message-time {
		text-align: left;
	}

	.message-status {
		font-size: 10px;
		color: #007aff;
	}

	.message-status.read {
		color: #007aff;
	}

	/* Message Input */
	.message-input-container {
		padding: 12px 20px 20px 20px;
		border-top: 1px solid #f0f0f0;
		background: #ffffff;
	}

	.message-input-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #f0f0f0;
		border-radius: 22px;
		padding: 4px;
	}

	.message-input {
		flex: 1;
		border: none;
		background: none;
		padding: 8px 12px;
		font-size: 15px;
		outline: none;
		border-radius: 18px;
		resize: none;
		max-height: 100px;
		min-height: 32px;
		font-family: inherit;
	}

	.send-btn {
		background: #007aff;
		border: none;
		color: white;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease;
		flex-shrink: 0;
	}

	.send-btn:hover:not(:disabled) {
		background: #0056b3;
	}

	.send-btn:disabled {
		background: #c7c7cc;
		cursor: not-allowed;
	}
</style>