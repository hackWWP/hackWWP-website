import { persisted } from './persisted.svelte.ts';
import { hackwwp_menu_config } from '🍎/configs/menu/hackwwp.menu.config';

const menu_configs = { hackwwp: hackwwp_menu_config };

export const should_show_notch = persisted('macos:setting:should-show-notch', false as boolean);

export const menubar_state = $state({
	menus: menu_configs.hackwwp,
	active: '' as string,
});
