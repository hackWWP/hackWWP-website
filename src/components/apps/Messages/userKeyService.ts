// Simple key storage for hackWWP Messages
// In a real implementation, this would be stored in a database

export interface UserKey {
	id: string;
	name: string;
	key: string;
	role: 'participant' | 'organizer';
	team?: string;
	createdAt: Date;
}

// In-memory storage (would be replaced with database in production)
const userKeys: UserKey[] = [];

export function generateUserKey(name: string, role: 'participant' | 'organizer' = 'participant', team?: string): UserKey {
	const key = `hackwwp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	const userKey: UserKey = {
		id: Math.random().toString(36).substr(2, 9),
		name,
		key,
		role,
		team,
		createdAt: new Date()
	};
	
	userKeys.push(userKey);
	
	// Store in localStorage for persistence across sessions
	localStorage.setItem('hackwwp_user_keys', JSON.stringify(userKeys));
	
	return userKey;
}

export function validateUserKey(key: string): UserKey | null {
	// Load from localStorage
	const stored = localStorage.getItem('hackwwp_user_keys');
	if (stored) {
		const keys: UserKey[] = JSON.parse(stored);
		userKeys.splice(0, userKeys.length, ...keys);
	}
	
	return userKeys.find(uk => uk.key === key) || null;
}

export function getAllUsers(): UserKey[] {
	const stored = localStorage.getItem('hackwwp_user_keys');
	if (stored) {
		const keys: UserKey[] = JSON.parse(stored);
		return keys;
	}
	return userKeys;
}

export function getUsersByTeam(team: string): UserKey[] {
	return getAllUsers().filter(user => user.team === team);
}

export function getOrganizers(): UserKey[] {
	return getAllUsers().filter(user => user.role === 'organizer');
}