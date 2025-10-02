<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';

	const {
		app_id,
		is_being_dragged,
	}: {
		app_id: AppID;
		is_being_dragged: boolean;
	} = $props();
</script>

{#if app_id === 'calendar'}
	{#await import('./Calendar/Calendar.svelte') then { default: Calendar }}
		<Calendar />
	{/await}
{:else if app_id === 'calculator'}
	{#await import('./Calculator/Calculator.svelte') then { default: Calculator }}
		<Calculator />
	{/await}
{:else if app_id === 'wallpapers'}
	{#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}
		<WallpaperSelector />
	{/await}
{:else if app_id === 'messages'}
	{#await import('./Messages/MessagesNew.svelte') then { default: Messages }}
		<Messages />
	{/await}
{:else if app_id === 'photos'}
	{#await import('./Photos/Photos.svelte') then { default: Photos }}
		<Photos />
	{/await}
{:else if app_id === 'notes'}
	{#await import('./Notes/Notes.svelte') then { default: Notes }}
		<Notes />
	{/await}
{:else if app_id === 'event-info'}
	{#await import('./EventInfo/EventInfoTerminal.svelte') then { default: EventInfo }}
		<EventInfo />
	{/await}
{:else if app_id === 'team-info'}
	{#await import('./TeamInfo/TeamInfoTerminal.svelte') then { default: TeamInfo }}
		<TeamInfo />
	{/await}
{:else}
	{#await import('./AppStore/AppStorePlaceholder.svelte') then { default: AppStorePlaceholder }}
		<AppStorePlaceholder />
	{/await}
{/if}
