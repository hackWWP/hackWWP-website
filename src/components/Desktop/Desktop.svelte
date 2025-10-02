<script>
	import { onMount } from 'svelte';
	import Dock from '../Dock/Dock.svelte';
	import TopBar from '../TopBar/TopBar.svelte';
	import Wallpaper from '../apps/WallpaperApp/Wallpaper.svelte';
	import BootupScreen from './BootupScreen.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import SystemUpdate from './SystemUpdate.svelte';
	import WindowsArea from './Window/WindowsArea.svelte';
	import StartupLogin from './StartupLogin.svelte';
	import { userService } from '../../services/userService';

	const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	if (!isMac) {
		Promise.all([
			import('@fontsource/inter/latin-ext-300.css'),
			import('@fontsource/inter/latin-ext-400.css'),
			import('@fontsource/inter/latin-ext-500.css'),
			import('@fontsource/inter/latin-ext-600.css'),
		]);
	}
	/** @type {HTMLElement} */
	let mainEl;
	let showStartupLogin = true;
	let isLoggedIn = false;

	onMount(() => {
		// Check if user is already logged in
		isLoggedIn = userService.isLoggedIn();
		if (isLoggedIn) {
			showStartupLogin = false;
		}

		// Listen for logout events
		const handleLogout = () => {
			showStartupLogin = true;
			isLoggedIn = false;
		};

		window.addEventListener('user-logout', handleLogout);

		// Cleanup event listener
		return () => {
			window.removeEventListener('user-logout', handleLogout);
		};
	});

	function handleLoginComplete(success) {
		if (success) {
			showStartupLogin = false;
			isLoggedIn = true;
		}
	}
</script>

<div bind:this={mainEl} class="container">
	{#if showStartupLogin}
		<StartupLogin onComplete={handleLoginComplete} />
	{:else}
		<main>
			<TopBar />
			<WindowsArea />
			<Dock />
		</main>

		<Wallpaper />
		<BootupScreen />
		<SystemUpdate />

		<ContextMenu target_element={mainEl} />
	{/if}
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
	}

	main {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
