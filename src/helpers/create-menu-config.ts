const apple_menu = {
	title: 'apple',
	menu: {
		'about-this-mac': {
			title: 'About This Mac',
			breakAfter: true,
		},
		'app-store': {
			title: 'App Store...',
			breakAfter: true,
		},
		logout: {
			title: 'Log Out User...',
		},
	},
};

export const create_menu_config = <T extends {}>(et: T) => ({ apple: apple_menu, ...et });
