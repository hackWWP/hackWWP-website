import { create_menu_config } from '🍎/helpers/create-menu-config';

export const hackwwp_menu_config = create_menu_config({
	default: {
		title: 'hackWWP',
		menu: {
			'about-hackwwp': {
				title: 'About hackWWP',
			},
			'eventInfo': {
				title: 'Event Info',
			},
			'schedule': {
				title: 'Schedule',
			},
		},
	},

	hackathon: {
		title: 'Hackathon',
		menu: {
			'team-chat': {
				title: 'Team Chat',
			},
		},
	},

	tools: {
		title: 'Tools',
		menu: {
			'code-editor': {
				title: 'Code Editor',
			},
		},
	},
});