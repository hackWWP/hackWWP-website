import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

export const apps = $state({
	open: {
		wallpapers: false,
		calculator: false,
		calendar: false,
		messages: false,
		appstore: false,
		photos: false,
		notes: false,
		'event-info': false,
		'team-info': false,
	} as Record<AppID, boolean>,

	active: 'wallpapers' satisfies AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: {
		wallpapers: 0,
		calculator: 0,
		calendar: 0,
		messages: 0,
		appstore: 0,
		photos: 0,
		notes: 0,
		'event-info': 0,
		'team-info': 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		wallpapers: false,
		calculator: false,
		calendar: false,
		messages: false,
		appstore: false,
		photos: false,
		notes: false,
		'event-info': false,
		'team-info': false,
	} as Record<AppID, boolean>,
});
