import { supabase, type Note } from '../lib/supabase';
import { userService } from './userService';

export interface LocalNote {
	id: string;
	title: string;
	content: string;
	color?: string;
	isPinned: boolean;
	createdAt: Date;
	updatedAt: Date;
}

class NotesService {
	private storageKey = 'notes';
	private noteSubscription: any = null;
	private listeners: ((notes: LocalNote[]) => void)[] = [];

	constructor() {
		this.setupRealtimeSubscription();
	}

	private setupRealtimeSubscription() {
		const user = userService.getCurrentUser();
		if (!user || user.is_guest) return;

		// Subscribe to notes for current user
		this.noteSubscription = supabase
			.channel('notes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'notes',
					filter: `user_id.eq.${user.id}`
				},
				() => {
					// Refresh notes when changes occur
					this.getNotes().then(notes => {
						this.notifyListeners(notes);
					});
				}
			)
			.subscribe();
	}

	private notifyListeners(notes: LocalNote[]) {
		this.listeners.forEach(listener => listener(notes));
	}

	addListener(listener: (notes: LocalNote[]) => void) {
		this.listeners.push(listener);
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	private getStorageKey(): string {
		return `${userService.getStoragePrefix()}${this.storageKey}`;
	}

	async getNotes(): Promise<LocalNote[]> {
		const user = userService.getCurrentUser();
		if (!user) return [];

		if (user.is_guest) {
			// For guest users, use localStorage
			return this.getLocalNotes();
		}

		try {
			// For registered users, fetch from Supabase
			const { data: notes, error } = await supabase
				.from('notes')
				.select('*')
				.eq('user_id', user.id)
				.order('updated_at', { ascending: false });

			if (error) {
				console.error('Error fetching notes:', error);
				return this.getLocalNotes(); // Fallback to local
			}

			return notes.map(note => ({
				id: note.id,
				title: note.title,
				content: note.content,
				color: note.color,
				isPinned: note.is_pinned,
				createdAt: new Date(note.created_at),
				updatedAt: new Date(note.updated_at)
			}));
		} catch (error) {
			console.error('Error in getNotes:', error);
			return this.getLocalNotes();
		}
	}

	private getLocalNotes(): LocalNote[] {
		try {
			const stored = localStorage.getItem(this.getStorageKey());
			if (!stored) return [];

			const parsed = JSON.parse(stored);
			return Array.isArray(parsed) ? parsed.map(note => ({
				...note,
				createdAt: new Date(note.createdAt),
				updatedAt: new Date(note.updatedAt)
			})) : [];
		} catch (error) {
			console.error('Error loading notes:', error);
			return [];
		}
	}

	private saveLocalNotes(notes: LocalNote[]): void {
		try {
			localStorage.setItem(this.getStorageKey(), JSON.stringify(notes));
		} catch (error) {
			console.error('Error saving notes:', error);
		}
	}

	async createNote(title: string, content: string, color?: string): Promise<{ success: boolean; note?: LocalNote; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		const noteData = {
			title: title.trim(),
			content: content.trim(),
			color,
			isPinned: false,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		if (user.is_guest) {
			// For guest users, save locally
			const notes = this.getLocalNotes();
			const newNote: LocalNote = {
				id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				...noteData
			};
			
			notes.unshift(newNote); // Add to beginning for recent-first order
			this.saveLocalNotes(notes);
			this.notifyListeners(notes);
			
			return { success: true, note: newNote };
		}

		try {
			// For registered users, save to Supabase
			const { data, error } = await supabase
				.from('notes')
				.insert({
					user_id: user.id,
					title: noteData.title,
					content: noteData.content,
					color: noteData.color,
					is_pinned: false
				})
				.select()
				.single();

			if (error) {
				console.error('Error creating note:', error);
				return { success: false, error: 'Failed to create note' };
			}

			const newNote: LocalNote = {
				id: data.id,
				title: data.title,
				content: data.content,
				color: data.color,
				isPinned: data.is_pinned,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at)
			};

			return { success: true, note: newNote };
		} catch (error) {
			console.error('Error in createNote:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async updateNote(id: string, updates: Partial<LocalNote>): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		if (user.is_guest) {
			// For guest users, update localStorage
			const notes = this.getLocalNotes();
			const noteIndex = notes.findIndex(note => note.id === id);
			
			if (noteIndex === -1) {
				return { success: false, error: 'Note not found' };
			}

			notes[noteIndex] = {
				...notes[noteIndex],
				...updates,
				updatedAt: new Date()
			};

			this.saveLocalNotes(notes);
			this.notifyListeners(notes);
			return { success: true };
		}

		try {
			const supabaseUpdates: any = {};
			if (updates.title !== undefined) supabaseUpdates.title = updates.title;
			if (updates.content !== undefined) supabaseUpdates.content = updates.content;
			if (updates.color !== undefined) supabaseUpdates.color = updates.color;
			if (updates.isPinned !== undefined) supabaseUpdates.is_pinned = updates.isPinned;

			const { error } = await supabase
				.from('notes')
				.update(supabaseUpdates)
				.eq('id', id)
				.eq('user_id', user.id); // Ensure user can only update their own notes

			if (error) {
				return { success: false, error: 'Failed to update note' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error updating note:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async deleteNote(id: string): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		if (user.is_guest) {
			// For guest users, remove from localStorage
			const notes = this.getLocalNotes();
			const updatedNotes = notes.filter(note => note.id !== id);
			this.saveLocalNotes(updatedNotes);
			this.notifyListeners(updatedNotes);
			return { success: true };
		}

		try {
			const { error } = await supabase
				.from('notes')
				.delete()
				.eq('id', id)
				.eq('user_id', user.id); // Ensure user can only delete their own notes

			if (error) {
				return { success: false, error: 'Failed to delete note' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error deleting note:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async togglePinNote(id: string): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		if (user.is_guest) {
			// For guest users, update localStorage
			const notes = this.getLocalNotes();
			const noteIndex = notes.findIndex(note => note.id === id);
			
			if (noteIndex === -1) {
				return { success: false, error: 'Note not found' };
			}

			notes[noteIndex].isPinned = !notes[noteIndex].isPinned;
			notes[noteIndex].updatedAt = new Date();

			this.saveLocalNotes(notes);
			this.notifyListeners(notes);
			return { success: true };
		}

		try {
			// First get the current pinned state
			const { data: currentNote } = await supabase
				.from('notes')
				.select('is_pinned')
				.eq('id', id)
				.eq('user_id', user.id)
				.single();

			if (!currentNote) {
				return { success: false, error: 'Note not found' };
			}

			const { error } = await supabase
				.from('notes')
				.update({ is_pinned: !currentNote.is_pinned })
				.eq('id', id)
				.eq('user_id', user.id);

			if (error) {
				return { success: false, error: 'Failed to toggle pin status' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error toggling pin status:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async clearAllNotes(): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		if (user.is_guest) {
			// For guest users, clear localStorage
			localStorage.removeItem(this.getStorageKey());
			this.notifyListeners([]);
			return { success: true };
		}

		try {
			const { error } = await supabase
				.from('notes')
				.delete()
				.eq('user_id', user.id);

			if (error) {
				return { success: false, error: 'Failed to clear notes' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error clearing notes:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async searchNotes(query: string): Promise<LocalNote[]> {
		const allNotes = await this.getNotes();
		if (!query.trim()) return allNotes;

		const searchTerm = query.toLowerCase();
		return allNotes.filter(note => 
			note.title.toLowerCase().includes(searchTerm) ||
			note.content.toLowerCase().includes(searchTerm)
		);
	}

	async getPinnedNotes(): Promise<LocalNote[]> {
		const allNotes = await this.getNotes();
		return allNotes.filter(note => note.isPinned);
	}

	async getNotesByColor(color: string): Promise<LocalNote[]> {
		const allNotes = await this.getNotes();
		return allNotes.filter(note => note.color === color);
	}

	// Cleanup subscription when service is destroyed
	destroy() {
		if (this.noteSubscription) {
			this.noteSubscription.unsubscribe();
		}
		this.listeners = [];
	}
}

export const notesService = new NotesService();
export default notesService;