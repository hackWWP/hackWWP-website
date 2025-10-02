import { supabase, type Message } from '../lib/supabase';
import { userService } from './userService';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface LocalMessage {
	id: string;
	content: string;
	timestamp: Date;
	fromUser: string;
	toUser: string;
	status: MessageStatus;
	isFromCurrentUser: boolean;
}

class MessagesService {
	private storageKey = 'messages';
	private messageSubscription: any = null;
	private listeners: ((messages: LocalMessage[]) => void)[] = [];

	constructor() {
		this.setupRealtimeSubscription();
	}

	private setupRealtimeSubscription() {
		const user = userService.getCurrentUser();
		if (!user || user.is_guest) return;

		// Subscribe to messages for current user
		this.messageSubscription = supabase
			.channel('messages')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'messages',
					filter: `or(from_user_id.eq.${user.id},to_user_id.eq.${user.id})`
				},
				() => {
					// Refresh messages when changes occur
					this.getMessages().then(messages => {
						this.notifyListeners(messages);
					});
				}
			)
			.subscribe();
	}

	private notifyListeners(messages: LocalMessage[]) {
		this.listeners.forEach(listener => listener(messages));
	}

	addListener(listener: (messages: LocalMessage[]) => void) {
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

	async getMessages(): Promise<LocalMessage[]> {
		const user = userService.getCurrentUser();
		if (!user) return [];

		if (user.is_guest) {
			// For guest users, use localStorage
			return this.getLocalMessages();
		}

		try {
			// For registered users, fetch from Supabase
			const { data: messages, error } = await supabase
				.from('messages')
				.select(`
					*,
					from_user:users!messages_from_user_id_fkey(username),
					to_user:users!messages_to_user_id_fkey(username)
				`)
				.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
				.order('created_at', { ascending: true });

			if (error) {
				console.error('Error fetching messages:', error);
				return this.getLocalMessages(); // Fallback to local
			}

			return messages.map(msg => ({
				id: msg.id,
				content: msg.content,
				timestamp: new Date(msg.created_at),
				fromUser: msg.from_user?.username || 'Unknown',
				toUser: msg.to_user?.username || 'Unknown',
				status: msg.status,
				isFromCurrentUser: msg.from_user_id === user.id
			}));
		} catch (error) {
			console.error('Error in getMessages:', error);
			return this.getLocalMessages();
		}
	}

	private getLocalMessages(): LocalMessage[] {
		try {
			const stored = localStorage.getItem(this.getStorageKey());
			if (!stored) return [];

			const parsed = JSON.parse(stored);
			return Array.isArray(parsed) ? parsed.map(msg => ({
				...msg,
				timestamp: new Date(msg.timestamp)
			})) : [];
		} catch (error) {
			console.error('Error loading messages:', error);
			return [];
		}
	}

	private saveLocalMessages(messages: LocalMessage[]): void {
		try {
			localStorage.setItem(this.getStorageKey(), JSON.stringify(messages));
		} catch (error) {
			console.error('Error saving messages:', error);
		}
	}

	async sendMessage(content: string, toUser: string): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		const messageData = {
			content: content.trim(),
			fromUser: user.username,
			toUser,
			timestamp: new Date(),
			status: 'sent' as const,
			isFromCurrentUser: true
		};

		if (user.is_guest) {
			// For guest users, save locally
			const messages = this.getLocalMessages();
			const newMessage: LocalMessage = {
				id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				...messageData
			};
			
			messages.push(newMessage);
			this.saveLocalMessages(messages);
			this.notifyListeners(messages);
			
			return { success: true };
		}

		try {
			// For registered users, save to Supabase
			// First, find the target user
			const { data: targetUser } = await supabase
				.from('users')
				.select('id')
				.eq('username', toUser)
				.single();

			if (!targetUser) {
				return { success: false, error: 'User not found' };
			}

			const { data, error } = await supabase
				.from('messages')
				.insert({
					content: content.trim(),
					from_user_id: user.id,
					to_user_id: targetUser.id,
					status: 'sent'
				})
				.select()
				.single();

			if (error) {
				console.error('Error sending message:', error);
				return { success: false, error: 'Failed to send message' };
			}

			// Update message status to delivered
			setTimeout(async () => {
				await this.updateMessageStatus(data.id, 'delivered');
			}, 1000);

			// Simulate read status after a delay
			setTimeout(async () => {
				await this.updateMessageStatus(data.id, 'read');
			}, 3000);

			return { success: true };
		} catch (error) {
			console.error('Error in sendMessage:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async updateMessageStatus(messageId: string, status: MessageStatus): Promise<void> {
		const user = userService.getCurrentUser();
		if (!user || user.is_guest) return;

		try {
			await supabase
				.from('messages')
				.update({ status })
				.eq('id', messageId);
		} catch (error) {
			console.error('Error updating message status:', error);
		}
	}

	async deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
		const user = userService.getCurrentUser();
		if (!user) {
			return { success: false, error: 'No user logged in' };
		}

		if (user.is_guest) {
			// For guest users, remove from localStorage
			const messages = this.getLocalMessages();
			const updatedMessages = messages.filter(msg => msg.id !== messageId);
			this.saveLocalMessages(updatedMessages);
			this.notifyListeners(updatedMessages);
			return { success: true };
		}

		try {
			const { error } = await supabase
				.from('messages')
				.delete()
				.eq('id', messageId)
				.eq('from_user_id', user.id); // Only allow deleting own messages

			if (error) {
				return { success: false, error: 'Failed to delete message' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error deleting message:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async clearAllMessages(): Promise<{ success: boolean; error?: string }> {
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
				.from('messages')
				.delete()
				.eq('from_user_id', user.id); // Only delete own messages

			if (error) {
				return { success: false, error: 'Failed to clear messages' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error clearing messages:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async getConversations(): Promise<string[]> {
		const messages = await this.getMessages();
		const user = userService.getCurrentUser();
		if (!user) return [];

		const conversations = new Set<string>();
		messages.forEach(msg => {
			if (msg.isFromCurrentUser) {
				conversations.add(msg.toUser);
			} else {
				conversations.add(msg.fromUser);
			}
		});

		return Array.from(conversations);
	}

	async getMessagesWithUser(username: string): Promise<LocalMessage[]> {
		const allMessages = await this.getMessages();
		const user = userService.getCurrentUser();
		if (!user) return [];

		return allMessages.filter(msg => 
			(msg.isFromCurrentUser && msg.toUser === username) ||
			(!msg.isFromCurrentUser && msg.fromUser === username)
		);
	}

	// Cleanup subscription when service is destroyed
	destroy() {
		if (this.messageSubscription) {
			this.messageSubscription.unsubscribe();
		}
		this.listeners = [];
	}
}

export const messagesService = new MessagesService();
export default messagesService;