import { create_app_config } from '🍎/helpers/create-app-config.ts';

const wallpapers = create_app_config({
	title: 'Wallpapers',
	resizable: true,

	height: 600,
	width: 800,

	dock_breaks_before: true,
});

const calculator = create_app_config({
	title: 'Calculator',

	expandable: true,
	resizable: false,

	height: 250 * 1.414,
	width: 250,
});

const calendar = create_app_config({
	title: 'Calendar',
	resizable: true,
});

// VSCode app removed

const messages = create_app_config({
	title: 'Messages',
	resizable: true,
	height: 600,
	width: 800,
});

const appstore = create_app_config({
	title: 'App Store',
	resizable: true,
	height: 600,
	width: 800,
});

// Music app removed

const photos = create_app_config({
	title: 'Photos',
	resizable: true,
	height: 600,
	width: 800,
});

const notes = create_app_config({
	title: 'Notes',
	resizable: true,
	height: 600,
	width: 600,
});

const eventInfo = create_app_config({
	title: 'Event Info',
	icon: '/app-icons/eventInfo/256.png',
	resizable: true,
	height: 600,
	width: 600,
});

export const apps_config = {
	wallpapers,
	calculator,
	calendar,
	messages,
	appstore,
	photos,
	notes,
	eventInfo,
};
