<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { notesService, type LocalNote } from '../../../services/notesService';
	import { userService } from '../../../services/userService';
	
	let notes: LocalNote[] = [];
	let selectedNote: LocalNote | null = null;
	let unsubscribeNotes: (() => void) | null = null;
	
	// Reactive variables that update when userService state changes
	$: currentUser = userService.getCurrentUser();
	$: isLoggedIn = userService.isLoggedIn();
	
	onMount(async () => {
		await loadNotes();
		
		// Subscribe to real-time note updates
		unsubscribeNotes = notesService.addListener((newNotes) => {
			notes = newNotes;
			// Update selected note if it was modified
			if (selectedNote) {
				const updatedNote = newNotes.find(n => n.id === selectedNote?.id);
				if (updatedNote) {
					selectedNote = updatedNote;
				} else {
					selectedNote = newNotes[0] || null;
				}
			} else if (newNotes.length > 0 && !selectedNote) {
				selectedNote = newNotes[0];
			}
		});
	});
	
	onDestroy(() => {
		if (unsubscribeNotes) {
			unsubscribeNotes();
		}
	});

	async function loadNotes() {
		notes = await notesService.getNotes();
		if (notes.length > 0 && !selectedNote) {
			selectedNote = notes[0];
		}
	}

	async function createNewNote() {
		const result = await notesService.createNote('New Note', '');
		if (result.success && result.note) {
			selectedNote = result.note;
			notes = await notesService.getNotes();
			// Focus the content area after a brief delay
			setTimeout(() => {
				const textarea = document.querySelector('.note-content') as HTMLTextAreaElement;
				if (textarea) textarea.focus();
			}, 100);
		} else {
			console.error('Failed to create note:', result.error);
		}
	}

	async function updateNote() {
		if (!selectedNote) return;
		
		// Update title based on first line of content
		const firstLine = selectedNote.content.split('\n')[0].trim();
		const newTitle = firstLine.substring(0, 50) || "New Note";
		
		if (newTitle !== selectedNote.title || selectedNote.content !== selectedNote.content) {
			const result = await notesService.updateNote(selectedNote.id, {
				title: newTitle,
				content: selectedNote.content
			});
			
			if (!result.success) {
				console.error('Failed to update note:', result.error);
			}
		}
	}

	async function deleteNote(noteId: string) {
		const result = await notesService.deleteNote(noteId);
		if (result.success) {
			notes = await notesService.getNotes();
			if (selectedNote?.id === noteId) {
				selectedNote = notes[0] || null;
			}
		} else {
			console.error('Failed to delete note:', result.error);
		}
	}

	function formatDate(date: Date): string {
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 1) return "Today";
		if (diffDays === 2) return "Yesterday";
		if (diffDays <= 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function login() {
		// Redirect to startup login
		window.location.reload();
	}

	function logout() {
		userService.logout();
	}

	function getPreview(content: string): string {
		const lines = content.split('\n');
		const firstNonEmptyLine = lines.find(line => line.trim() !== '') || '';
		const secondLine = lines.slice(1).find(line => line.trim() !== '') || '';
		
		if (secondLine) {
			return secondLine.substring(0, 50) + (secondLine.length > 50 ? '...' : '');
		}
		return 'No additional text';
	}
</script>

<div class="notes-app">
	{#if !isLoggedIn}
		<div class="login-screen">
			<div class="login-icon">📝</div>
			<h2>Notes</h2>
			<p>Please sign in to access your notes</p>
			<button on:click={login} class="login-btn">Sign In</button>
		</div>
	{:else}
		<!-- Sidebar -->
		<div class="notes-sidebar">
			<div class="sidebar-header">
				<div class="notes-title">
					<img src="/app-icons/hackwwp/192.png" alt="hackWWP Logo" class="notes-logo" />
					<h2>Notes</h2>
				</div>
				<div class="header-actions">
					<button class="new-note-btn" on:click={createNewNote} title="New Note" aria-label="Create new note">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
						</svg>
					</button>
					<button on:click={logout} class="logout-btn" title="Sign Out">⏻</button>
				</div>
			</div>

			<div class="notes-list">
				{#each notes as note (note.id)}
					<div 
						class="note-item {selectedNote?.id === note.id ? 'active' : ''}"
						role="button"
						tabindex="0"
						on:click={() => selectedNote = note}
						on:keydown={(e) => e.key === 'Enter' && (selectedNote = note)}
					>
						<div class="note-title">{note.title}</div>
						<div class="note-meta">
							<span class="note-date">{formatDate(note.updatedAt)}</span>
							<span class="note-preview">{getPreview(note.content)}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Editor -->
		<div class="notes-editor">
			{#if selectedNote}
				<div class="editor-header">
					<button class="delete-btn" on:click={() => deleteNote(selectedNote.id)} title="Delete Note" aria-label="Delete note">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 1.152l.557 10.795A2 2 0 0 0 5.046 16h5.908a2 2 0 0 0 1.993-1.553l.557-10.795A.58.58 0 0 0 13.494 2.5H11ZM4.5 5.5A.5.5 0 0 1 5 5h.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5Zm3 0A.5.5 0 0 1 8 5h.5a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5Zm3 0a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5Z"/>
						</svg>
					</button>
				</div>
				<textarea 
					class="note-content" 
					bind:value={selectedNote.content}
					on:input={updateNote}
					placeholder="Start writing..."
				></textarea>
			{:else}
				<div class="empty-state">
					<div class="empty-icon">📝</div>
					<h3>No Note Selected</h3>
					<p>Select a note from the sidebar or create a new one</p>
					<button class="create-note-btn" on:click={createNewNote}>Create New Note</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.notes-app {
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

	/* Sidebar */
	.notes-sidebar {
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

	.notes-title {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.notes-logo {
		width: 20px;
		height: 20px;
		border-radius: 4px;
		object-fit: contain;
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.new-note-btn, .logout-btn {
		background: none;
		border: none;
		color: #007aff;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 4px;
		border-radius: 4px;
		transition: background 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.new-note-btn:hover, .logout-btn:hover {
		background: rgba(0, 122, 255, 0.1);
	}

	.logout-btn {
		color: #8e8e93;
	}

	.logout-btn:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.notes-list {
		flex: 1;
		overflow-y: auto;
	}

	.note-item {
		padding: 12px 16px;
		cursor: pointer;
		transition: background 0.2s ease;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.note-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.note-item.active {
		background: #007aff;
		color: white;
	}

	.note-title {
		font-weight: 600;
		font-size: 15px;
		margin-bottom: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.note-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.note-date {
		font-size: 12px;
		opacity: 0.7;
	}

	.note-preview {
		font-size: 13px;
		opacity: 0.6;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Editor */
	.notes-editor {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.editor-header {
		display: flex;
		justify-content: flex-end;
		padding: 3rem 20px 8px 20px;
		border-bottom: 1px solid #f0f0f0;
	}

	.delete-btn {
		background: none;
		border: none;
		color: #ff3b30;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delete-btn:hover {
		background: rgba(255, 59, 48, 0.1);
	}

	.note-content {
		flex: 1;
		border: none;
		outline: none;
		padding: 20px;
		font-size: 15px;
		line-height: 1.6;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		resize: none;
		background: transparent;
		color: #1d1d1f;
	}

	.note-content::placeholder {
		color: #8e8e93;
	}

	/* Empty State */
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
		color: #8e8e93;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1d1d1f;
	}

	.empty-state p {
		margin: 0 0 2rem 0;
		font-size: 15px;
	}

	.create-note-btn {
		background: #007aff;
		border: none;
		color: white;
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 15px;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.create-note-btn:hover {
		background: #0056b3;
	}

	/* Scrollbar */
	.notes-list::-webkit-scrollbar {
		width: 6px;
	}

	.notes-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.notes-list::-webkit-scrollbar-thumb {
		background: #c7c7cc;
		border-radius: 3px;
	}

	.notes-list::-webkit-scrollbar-thumb:hover {
		background: #a1a1a6;
	}
</style>
