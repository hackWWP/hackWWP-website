<script lang="ts">
	import { onMount } from 'svelte';
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
	let bootProgress = 0;

	onMount(() => {
		// Check if user is already logged in
		if (userService.isLoggedIn()) {
			onComplete(true);
			return;
		}

		// Start boot sequence animation
		startBootSequence();
	});

	function startBootSequence() {
		const interval = setInterval(() => {
			bootProgress += Math.random() * 15 + 5;
			if (bootProgress >= 100) {
				bootProgress = 100;
				clearInterval(interval);
				setTimeout(() => {
					isBootSequence = false;
				}, 500);
			}
		}, 200);
	}

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
		<div class="boot-screen">
			<div class="boot-content">
				<div class="apple-logo">
					<svg width="80" height="80" viewBox="0 0 256 315" fill="none">
						<path d="M213.803 167.03c-.442-47.58 39.002-70.286 40.81-71.427-22.236-32.439-56.905-36.899-69.226-37.378-29.566-2.956-57.676 17.355-72.718 17.355-15.042 0-38.313-16.933-62.925-16.464-32.36.469-62.188 18.766-78.847 47.693-33.645 58.362-8.611 144.849 24.197 192.389 16.043 23.288 35.19 49.446 60.337 48.506 24.708-.939 34.05-15.99 63.947-15.99 29.896 0 38.768 15.99 63.417 15.52 26.118-.47 42.634-23.986 58.676-47.274 18.506-26.586 26.118-52.744 26.587-54.056-.47-.469-51.081-19.704-51.55-78.24zM174.24 50.199c13.336-16.464 22.322-39.058 19.835-61.652-19.366.938-42.635 12.815-56.44 28.81-12.346 14.051-23.288 36.645-20.331 58.362 21.853 1.877 44.447-10.938 57.012-25.52h-.076z" fill="white"/>
					</svg>
				</div>
				
				<div class="loading-container">
					<div class="loading-bar">
						<div class="loading-progress" style="width: {bootProgress}%"></div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Login Screen -->
		<div class="startup-screen">
			<div class="login-container">
				{#if loginMode === 'select'}
					<div class="login-content">
						<div class="welcome-section">
							<div class="mac-logo">
								<svg width="60" height="60" viewBox="0 0 256 315" fill="none">
									<path d="M213.803 167.03c-.442-47.58 39.002-70.286 40.81-71.427-22.236-32.439-56.905-36.899-69.226-37.378-29.566-2.956-57.676 17.355-72.718 17.355-15.042 0-38.313-16.933-62.925-16.464-32.36.469-62.188 18.766-78.847 47.693-33.645 58.362-8.611 144.849 24.197 192.389 16.043 23.288 35.19 49.446 60.337 48.506 24.708-.939 34.05-15.99 63.947-15.99 29.896 0 38.768 15.99 63.417 15.52 26.118-.47 42.634-23.986 58.676-47.274 18.506-26.586 26.118-52.744 26.587-54.056-.47-.469-51.081-19.704-51.55-78.24zM174.24 50.199c13.336-16.464 22.322-39.058 19.835-61.652-19.366.938-42.635 12.815-56.44 28.81-12.346 14.051-23.288 36.645-20.331 58.362 21.853 1.877 44.447-10.938 57.012-25.52h-.076z" fill="white"/>
								</svg>
							</div>
							<h1>macOS</h1>
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

<style>
	/* Boot Sequence Styles */
	.boot-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000000;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.boot-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 60px;
	}

	.apple-logo {
		filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
	}

	.loading-container {
		width: 300px;
	}

	.loading-bar {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		overflow: hidden;
	}

	.loading-progress {
		height: 100%;
		background: #ffffff;
		border-radius: 2px;
		transition: width 0.3s ease;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
		filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
	}

	.welcome-section h1 {
		color: #ffffff;
		font-size: 2rem;
		font-weight: 300;
		margin: 0;
		letter-spacing: -0.02em;
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
	}

	.guest-description {
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 30px 0;
		font-size: 0.95rem;
		line-height: 1.4;
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
	}

	.btn-primary:hover:not(:disabled) {
		background: #0056cc;
		border-color: #0056cc;
	}

	.btn-back:disabled, .btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>