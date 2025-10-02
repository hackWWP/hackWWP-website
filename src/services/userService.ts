import { supabase, type User } from '../lib/supabase';

export interface UserSession {
	user: User | null;
	isLoggedIn: boolean;
	loginType: 'guest' | 'registered' | null;
}

class UserService {
	private storageKey = 'hackwwp:user-session';
	private currentSession: UserSession = {
		user: null,
		isLoggedIn: false,
		loginType: null
	};

	constructor() {
		this.loadSession();
		this.cleanupGuestData();
		this.setupAuthListener();
	}

	private setupAuthListener() {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN' && session?.user) {
				await this.handleSupabaseSignIn(session.user);
			} else if (event === 'SIGNED_OUT') {
				this.handleSignOut();
			}
		});
	}

	private async handleSupabaseSignIn(authUser: any) {
		try {
			// Check if user profile exists
			const { data: userProfile } = await supabase
				.from('users')
				.select('*')
				.eq('id', authUser.id)
				.single();

			if (!userProfile) {
				// Create user profile
				const newUser: Partial<User> = {
					id: authUser.id,
					username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
					email: authUser.email,
					is_guest: false,
				};

				const { data: createdUser } = await supabase
					.from('users')
					.insert(newUser)
					.select()
					.single();

				if (createdUser) {
					this.setCurrentUser(createdUser, 'registered');
				}
			} else {
				this.setCurrentUser(userProfile, 'registered');
			}
		} catch (error) {
			console.error('Error handling Supabase sign in:', error);
		}
	}

	private handleSignOut() {
		this.currentSession = {
			user: null,
			isLoggedIn: false,
			loginType: null
		};
		this.saveSession();
	}

	private setCurrentUser(user: User, loginType: 'guest' | 'registered') {
		this.currentSession = {
			user,
			isLoggedIn: true,
			loginType
		};
		this.saveSession();
	}

	private loadSession() {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const session = JSON.parse(stored);
				// Validate session structure
				if (session.user && typeof session.isLoggedIn === 'boolean') {
					// Don't restore guest sessions - guests should log in each time
					if (session.loginType === 'guest') {
						this.clearSession();
						return;
					}
					this.currentSession = session;
				}
			}
		} catch (error) {
			console.error('Error loading user session:', error);
			this.clearSession();
		}
	}

	private saveSession() {
		try {
			// Don't persist guest sessions to localStorage
			if (this.currentSession.loginType === 'guest') {
				return;
			}
			localStorage.setItem(this.storageKey, JSON.stringify(this.currentSession));
		} catch (error) {
			console.error('Error saving user session:', error);
		}
	}

	private clearSession() {
		this.currentSession = {
			user: null,
			isLoggedIn: false,
			loginType: null
		};
		localStorage.removeItem(this.storageKey);
	}

	private cleanupGuestData() {
		// Clean up any leftover guest data from previous sessions
		const keysToRemove: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && (key.startsWith('hackwwp:guest_') || key.includes(':guest_'))) {
				keysToRemove.push(key);
			}
		}
		keysToRemove.forEach(key => localStorage.removeItem(key));
	}

	// Public methods
	async signUp(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username
					}
				}
			});

			if (error) {
				return { success: false, error: error.message };
			}

			return { success: true };
		} catch (error) {
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				return { success: false, error: error.message };
			}

			return { success: true };
		} catch (error) {
			return { success: false, error: 'An unexpected error occurred' };
		}
	}

	async signInAsGuest(username: string): Promise<{ success: boolean; error?: string }> {
		try {
			// Create a temporary guest user
			const mockUser: User = {
				id: `guest_${Date.now()}`,
				username: `Guest_${username}_${Date.now()}`,
				email: `guest_${Date.now()}@hackwwp.temp`,
				is_guest: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			this.setCurrentUser(mockUser, 'guest');
			
			// Set up cleanup for guest session
			this.setupGuestCleanup();
			
			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to create guest session' };
		}
	}

	async logout(): Promise<void> {
		try {
			if (this.currentSession.loginType === 'registered') {
				await supabase.auth.signOut();
			}
			this.clearSession();
			
			// Trigger a custom event to notify components that logout occurred
			window.dispatchEvent(new CustomEvent('user-logout'));
		} catch (error) {
			console.error('Error during logout:', error);
			this.clearSession(); // Clear session anyway
			
			// Still trigger the logout event even if there was an error
			window.dispatchEvent(new CustomEvent('user-logout'));
		}
	}

	getCurrentUser(): User | null {
		return this.currentSession.user;
	}

	isLoggedIn(): boolean {
		return this.currentSession.isLoggedIn && this.currentSession.user !== null;
	}

	isGuest(): boolean {
		return this.currentSession.user?.is_guest === true;
	}

	isRegistered(): boolean {
		return this.currentSession.loginType === 'registered';
	}

	getStoragePrefix(): string {
		const user = this.getCurrentUser();
		if (!user) return 'hackwwp:guest:';
		return `hackwwp:${user.id}:`;
	}

	async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return { success: false, error: 'No user logged in' };
		}

		if (currentUser.is_guest) {
			// Update local guest user data
			const updatedUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
			this.setCurrentUser(updatedUser, 'guest');
			return { success: true };
		}

		try {
			const { data, error } = await supabase
				.from('users')
				.update({
					...updates,
					updated_at: new Date().toISOString()
				})
				.eq('id', currentUser.id)
				.select()
				.single();

			if (error) {
				return { success: false, error: error.message };
			}

			if (data) {
				this.setCurrentUser(data, 'registered');
			}

			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to update profile' };
		}
	}

	// Cleanup guest data when window closes or page unloads
	setupGuestCleanup() {
		if (typeof window !== 'undefined' && this.isGuest()) {
			const cleanup = () => {
				// Clear any guest-specific data and session
				if (this.isGuest()) {
					const prefix = this.getStoragePrefix();
					for (let i = localStorage.length - 1; i >= 0; i--) {
						const key = localStorage.key(i);
						if (key && key.startsWith(prefix)) {
							localStorage.removeItem(key);
						}
					}
					// Clear the user session as well
					this.clearSession();
				}
			};

			// Clean up on beforeunload and on visibility change (when tab is closed)
			window.addEventListener('beforeunload', cleanup);
			window.addEventListener('pagehide', cleanup);
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'hidden' && this.isGuest()) {
					cleanup();
				}
			});

			return () => {
				window.removeEventListener('beforeunload', cleanup);
				window.removeEventListener('pagehide', cleanup);
			};
		}
	}
}

export const userService = new UserService();
export default userService;