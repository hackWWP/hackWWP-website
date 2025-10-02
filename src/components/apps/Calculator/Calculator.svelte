<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	let display = $state('0');
	let previousValue = $state<number | null>(null);
	let operation = $state<string | null>(null);
	let waitingForOperand = $state(false);

	function inputNumber(num: string) {
		if (waitingForOperand) {
			display = num;
			waitingForOperand = false;
		} else {
			display = display === '0' ? num : display + num;
		}
	}

	function inputOperation(nextOperation: string) {
		const inputValue = parseFloat(display);

		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);

			display = String(newValue);
			previousValue = newValue;
		}

		waitingForOperand = true;
		operation = nextOperation;
	}

	function calculate(firstValue: number, secondValue: number, operation: string): number {
		switch (operation) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '*':
				return firstValue * secondValue;
			case '/':
				return firstValue / secondValue;
			case '=':
				return secondValue;
			default:
				return secondValue;
		}
	}

	function performCalculation() {
		const inputValue = parseFloat(display);

		if (previousValue !== null && operation) {
			const newValue = calculate(previousValue, inputValue, operation);
			display = String(newValue);
			previousValue = null;
			operation = null;
			waitingForOperand = true;
		}
	}

	function allClear() {
		display = '0';
		previousValue = null;
		operation = null;
		waitingForOperand = false;
	}

	function toggleSign() {
		if (display !== '0') {
			display = display.startsWith('-') ? display.slice(1) : '-' + display;
		}
	}

	function percentage() {
		const value = parseFloat(display) / 100;
		display = String(value);
	}

	function inputDecimal() {
		if (waitingForOperand) {
			display = '0.';
			waitingForOperand = false;
		} else if (display.indexOf('.') === -1) {
			display += '.';
		}
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{display}</section>

	<section class="buttons-container">
		<button class="top-row-button" onclick={allClear}> AC </button>
		<button class="top-row-button" onclick={toggleSign}>
			<PlusMinus />
		</button>
		<button class="top-row-button" onclick={percentage}> % </button>
		<button class="operation-button" onclick={() => inputOperation('/')}>
			<Division />
		</button>
		<button class="number-button" onclick={() => inputNumber('7')}> 7 </button>
		<button class="number-button" onclick={() => inputNumber('8')}> 8 </button>
		<button class="number-button" onclick={() => inputNumber('9')}> 9 </button>
		<button class="operation-button" onclick={() => inputOperation('*')}>
			<Multiply />
		</button>
		<button class="number-button" onclick={() => inputNumber('4')}> 4 </button>
		<button class="number-button" onclick={() => inputNumber('5')}> 5 </button>
		<button class="number-button" onclick={() => inputNumber('6')}> 6 </button>
		<button class="operation-button" onclick={() => inputOperation('-')}>
			<Minus />
		</button>
		<button class="number-button" onclick={() => inputNumber('1')}> 1 </button>
		<button class="number-button" onclick={() => inputNumber('2')}> 2 </button>
		<button class="number-button" onclick={() => inputNumber('3')}> 3 </button>
		<button class="operation-button" onclick={() => inputOperation('+')}> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" onclick={() => inputNumber('0')}>
			0
		</button>
		<button class="number-button" onclick={inputDecimal}> . </button>
		<button class="operation-button curved-bottom-right-button" onclick={performCalculation}> <Equal /> </button>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}

		:global(svg) {
			font-size: 1.2rem;
		}
	}

	.top-row-button {
		background-color: hsla(240, 5%, 12%, 0.2);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
	}

	.curved-bottom-left-button {
		border-radius: 0 0 0 0.7rem;
	}

	.curved-bottom-right-button {
		border-radius: 0 0 0.7rem 0;
	}

	.show-area {
		font-size: 3rem;
		color: white;
		text-align: end;
		font-weight: 200;

		overflow: auto;

		padding: 0.5rem 1rem;
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
