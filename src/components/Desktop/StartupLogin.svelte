<script lang="ts">
	import { onMount } from 'svelte';
	import { quintInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import AppleIcon from '~icons/mdi/apple';
	import { elevation } from '🍎/actions';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { sleep } from '🍎/helpers/sleep';
	import { userService } from '../../services/userService';
	
	export let onComplete: (success: boolean) => void;

	let showLoginScreen = true;
	let loginMode: 'select' | 'login' | 'register' | 'guest' = 'select';
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let guestUsername = '';
	let errorMessage = '';
	let isLoading = false;
	let isBootSequence = true;
	let progress_val = tweened(100, { duration: 3000, easing: quintInOut });

	onMount(async () => {
		// Check if user is already logged in
		if (userService.isLoggedIn()) {
			onComplete(true);
			return;
		}

		// Start Mac-style boot sequence animation
		$progress_val = 0;
		await sleep(3000);
		isBootSequence = false;
	});

	async function handleLogin() {
		if (!email || !password) {
			errorMessage = 'Please enter your email and password.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const result = await userService.signIn(email, password);
			if (result.success) {
				onComplete(true);
			} else {
				errorMessage = result.error || 'Invalid email or password. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleRegister() {
		if (!username || !email || !password) {
			errorMessage = 'Please fill in all required fields.';
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		if (password.length < 6) {
			errorMessage = 'Password must be at least 6 characters long.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const result = await userService.signUp(email, password, username);
			if (result.success) {
				// For Supabase, user will need to verify email first
				// For now, automatically sign them in after registration
				const loginResult = await userService.signIn(email, password);
				if (loginResult.success) {
					onComplete(true);
				} else {
					errorMessage = 'Registration successful! Please sign in.';
					switchMode('login');
				}
			} else {
				errorMessage = result.error || 'Registration failed. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleGuest() {
		if (!guestUsername.trim()) {
			errorMessage = 'Please enter a username to continue as guest.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const result = await userService.signInAsGuest(guestUsername.trim());
			if (result.success) {
				onComplete(true);
			} else {
				errorMessage = result.error || 'Failed to continue as guest.';
			}
		} catch (error) {
			errorMessage = 'Failed to continue as guest. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		username = '';
		email = '';
		password = '';
		confirmPassword = '';
		guestUsername = '';
		errorMessage = '';
	}

	function switchMode(mode: typeof loginMode) {
		loginMode = mode;
		resetForm();
	}
</script>

{#if showLoginScreen}
	{#if isBootSequence}
		<!-- Mac Boot Sequence -->
		<div out:fade_out={{ duration: 500 }} class="splash-screen" use:elevation={'bootup-screen'}>
			<AppleIcon />

			<div
				class="progress"
				role="progressbar"
				aria-valuenow={100 - $progress_val}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuetext="Loading up macOS Web"
			>
				<div class="indicator" style:translate="-{$progress_val}% 0"></div>
			</div>
		</div>
	{:else}
		<!-- Login Screen -->
		<div class="startup-screen">
			<div class="login-container">
				{#if loginMode === 'select'}
					<div class="login-content">
						<div class="welcome-section">
							<h1>hackWWP</h1>
						</div>

						<div class="login-options">
							<button class="login-option primary" on:click={() => switchMode('login')}>
								<div class="option-text">
									<div class="option-title">Sign In</div>
								</div>
							</button>

							<button class="login-option" on:click={() => switchMode('register')}>
								<div class="option-text">
									<div class="option-title">Create Account</div>
								</div>
							</button>

							<button class="login-option" on:click={() => switchMode('guest')}>
								<div class="option-text">
									<div class="option-title">Continue as Guest</div>
								</div>
							</button>
						</div>
					</div>

				{:else if loginMode === 'login'}
					<div class="login-form">
						<h2>Sign In</h2>
						
						<form on:submit|preventDefault={handleLogin}>
							<div class="form-group">
								<input 
									type="email" 
									bind:value={email}
									placeholder="Email"
									disabled={isLoading}
									required
								/>
							</div>

							<div class="form-group">
								<input 
									type="password" 
									bind:value={password}
									placeholder="Password"
									disabled={isLoading}
									required
								/>
							</div>

							{#if errorMessage}
								<div class="error-message">{errorMessage}</div>
							{/if}

							<div class="form-actions">
								<button type="button" class="btn-back" on:click={() => switchMode('select')} disabled={isLoading}>
									← Back
								</button>
								<button type="submit" class="btn-primary" disabled={isLoading}>
									{isLoading ? 'Signing In...' : 'Sign In'}
								</button>
							</div>
						</form>
					</div>

				{:else if loginMode === 'register'}
					<div class="register-form">
						<h2>Create Account</h2>
						
						<form on:submit|preventDefault={handleRegister}>
							<div class="form-group">
								<input 
									type="text" 
									bind:value={username}
									placeholder="Full Name"
									disabled={isLoading}
									required
								/>
							</div>

							<div class="form-group">
								<input 
									type="email" 
									bind:value={email}
									placeholder="Email"
									disabled={isLoading}
									required
								/>
							</div>

							<div class="form-group">
								<input 
									type="password" 
									bind:value={password}
									placeholder="Password"
									disabled={isLoading}
									required
								/>
							</div>

							<div class="form-group">
								<input 
									type="password" 
									bind:value={confirmPassword}
									placeholder="Confirm Password"
									disabled={isLoading}
									required
								/>
							</div>

							{#if errorMessage}
								<div class="error-message">{errorMessage}</div>
							{/if}

							<div class="form-actions">
								<button type="button" class="btn-back" on:click={() => switchMode('select')} disabled={isLoading}>
									← Back
								</button>
								<button type="submit" class="btn-primary" disabled={isLoading}>
									{isLoading ? 'Creating Account...' : 'Create Account'}
								</button>
							</div>
						</form>
					</div>

				{:else if loginMode === 'guest'}
					<div class="guest-form">
						<h2>Continue as Guest</h2>
						<p class="guest-description">Enter a username to continue without creating an account. Your data will not be saved.</p>
						
						<form on:submit|preventDefault={handleGuest}>
							<div class="form-group">
								<input 
									type="text" 
									bind:value={guestUsername}
									placeholder="Enter a username"
									disabled={isLoading}
									required
								/>
							</div>

							{#if errorMessage}
								<div class="error-message">{errorMessage}</div>
							{/if}

							<div class="form-actions">
								<button type="button" class="btn-back" on:click={() => switchMode('select')} disabled={isLoading}>
									← Back
								</button>
								<button type="submit" class="btn-primary" disabled={isLoading}>
									{isLoading ? 'Starting...' : 'Continue'}
								</button>
							</div>
						</form>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/if}

<!-- iframe => firefox support: will always make sound available on start or F5 -->
<iframe id="audio" src="/sounds/mac-startup-sound.mp3" allow="autoplay" title="Mac Startup Sound"></iframe>

<style>
	/* Mac Boot Sequence Styles */
	.splash-screen {
		position: fixed;
		top: 0;
		bottom: 0;

		height: 100vh;
		width: 100vw;

		cursor: none;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		animation-fill-mode: forwards;

		background-color: #000;

		:global(svg) {
			font-size: 100px;
			color: white;
		}
	}

	.progress {
		border-radius: 50px;

		height: 4px;
		width: 150px;

		overflow-x: hidden;

		background-color: var(--system-color-grey-800);
	}

	.indicator {
		background-color: var(--system-color-grey-100);

		border-radius: inherit;

		width: 100%;
		height: 100%;

		transform: translateX(-0%);
	}

	/* Login Screen Styles */
	.startup-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
		z-index: 9999;
	}

	.login-container {
		background: rgba(25, 25, 25, 0.95);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		padding: 30px;
		min-width: 350px;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
	}

	.welcome-section {
		text-align: center;
		margin-bottom: 30px;
	}

	.mac-logo {
		margin-bottom: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70px;
		filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
	}

	.welcome-section h1 {
		color: #ffffff;
		font-size: 2rem;
		font-weight: 300;
		margin: 0;
		letter-spacing: -0.02em;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.login-options {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.login-option {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 15px;
		padding: 12px 20px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #ffffff;
		text-align: center;
		width: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.login-option:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-1px);
	}

	.login-option.primary {
		background: rgba(0, 122, 255, 0.2);
		border-color: rgba(0, 122, 255, 0.4);
	}

	.login-option.primary:hover {
		background: rgba(0, 122, 255, 0.3);
		border-color: rgba(0, 122, 255, 0.6);
	}

	.option-title {
		font-size: 1rem;
		font-weight: 500;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	/* Form Styles */
	.login-form, .register-form, .guest-form {
		color: #ffffff;
	}

	.login-form h2, .register-form h2, .guest-form h2 {
		text-align: center;
		margin: 0 0 30px 0;
		font-size: 1.8rem;
		font-weight: 400;
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.guest-description {
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 30px 0;
		font-size: 0.95rem;
		line-height: 1.4;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group input {
		width: 100%;
		padding: 16px 20px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		color: #ffffff;
		font-size: 1rem;
		transition: all 0.3s ease;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.form-group input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.form-group input:focus {
		outline: none;
		border-color: #007AFF;
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
	}

	.form-group input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-message {
		background: rgba(255, 59, 48, 0.2);
		border: 1px solid rgba(255, 59, 48, 0.4);
		color: #ff3b30;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		margin-bottom: 20px;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.form-actions {
		display: flex;
		gap: 15px;
		margin-top: 30px;
	}

	.btn-back {
		flex: 1;
		padding: 14px 20px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		color: #ffffff;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.btn-back:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.btn-primary {
		flex: 2;
		padding: 14px 20px;
		background: #007AFF;
		border: 1px solid #007AFF;
		border-radius: 10px;
		color: #ffffff;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0056cc;
		border-color: #0056cc;
	}

	.btn-back:disabled, .btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	#audio {
		position: absolute;
		z-index: -9999;
		display: none;
	}
</style>