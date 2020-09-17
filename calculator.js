//initalizes default objects
const defaultValue = '0'
const buttons = document.querySelector('#calculator-buttons')
const display = document.querySelector('#calculator-results')
const calculator = document.querySelector('#calculator')

//Main Event Listener for the calculator buttons
buttons.addEventListener('click', e => {
	if(e.target.matches('button')) {
		const btn = e.target
		const action = btn.dataset.action
		const btnContent = btn.textContent
		const displayValue = display.value
		const previousBtnType = calculator.dataset.previousBtnType

		//resets depressed buttons for operators
		Array.from(btn.parentNode.children).forEach(x => undepressBtn(x))

		//checks if the button pressed is a number
		if(!action){
			if (displayValue === '0' || previousBtnType === 'operator' || previousBtnType === 'equal'){
				if (previousBtnType === 'equal'){
					calculator.dataset.firstValue = calculator.dataset.secondValue
				}
				display.value = btnContent
				calculator.dataset.previousBtnType = 'repeating'
			} else {
				display.value = displayValue + btnContent
				calculator.dataset.previousBtnType = 'number'
			}
		}
		//controls the AC / C Wording on the clear button
		if (action !== 'ac'){
			const clearButton = calculator.querySelector('[data-action=ac]')
			clearButton.textContent = 'C'
		}
		//Controls operators, such as add, subtract, etc..
		if (action ==='add' || action ==='subtract' || action ==='multiply' || action ==='divide'){
			const firstValue = calculator.dataset.firstValue
			const operator = calculator.dataset.operator
			const secondValue = displayValue

			//check if we can do a consecutive calculations based on the values of previous calculation.
			if (firstValue && operator && previousBtnType !== 'operator' && previousBtnType !== 'equal' && previousBtnType !== "number"){
				const result = calculate(firstValue, operator, secondValue)
				display.value = result
				calculator.dataset.firstValue = result
			} else {
				calculator.dataset.firstValue = displayValue
			}
			
			depressBtn(btn)
			calculator.dataset.previousBtnType  = 'operator'
			calculator.dataset.operator = action
		}
		//Controls decimal functionality
		if(action === 'decimal'){
			if (!displayValue.includes('.')){
				if (previousBtnType === 'operator' || previousBtnType === 'equal') {
					display.value = '0.'
				} else {
					display.value = displayValue + '.'
				}
			} else if (previousBtnType === 'operator' || previousBtnType === 'equal'){
				display.value = '0.'
			}

			calculator.dataset.previousBtnType = 'decimal'
		}
		//converts numbers to percents.
		if(action === 'percent'){
			display.value = percent(displayValue)
			calculator.dataset.previousBtnType = 'operator'
		}
		//converts numbers to negative/positive
		if(action === 'negative'){
			display.value = negative(displayValue)
			calculator.dataset.previousBtnType = 'negative'
		}
		//Clears all values
		if(action === 'ac'){
			if (btn.textContent !== 'AC'){
				btn.textContent = 'AC'
			}
			//clears all dataset fields
			calculator.dataset.firstValue = ''
			calculator.dataset.secondValue = ''
			calculator.dataset.auxValue = ''
			calculator.dataset.operator = ''
			calculator.dataset.previousBtnType = ''

			display.value = defaultValue
			calculator.dataset.previousBtnType = 'ac'
		}
		if(action === 'equal'){
			let firstValue = calculator.dataset.firstValue
			let secondValue = displayValue
			const operator = calculator.dataset.operator
			//checks if first value exists before calculation
			if (firstValue) {
				//check if it will be a repeating calcuation
				if (previousBtnType === 'equal'){
					firstValue = displayValue
					secondValue = calculator.dataset.auxValue
				}
				display.value = calculate(firstValue, operator, secondValue)
			}
			//stores second value as auxillary value in case for a repeating operation
			calculator.dataset.auxValue = secondValue
			
			calculator.dataset.secondValue = ''
			calculator.dataset.previousBtnType = 'equal'
		}
	}
})

//generic calculate functionality
const calculate=(x, y, z) => {
	let result = ''
	x = parseFloat(x)
	z = parseFloat(z)

	if (y ==='add'){
		result = x + z
	} else if (y === 'subtract') {
		result = x - z
	} else if (y === 'multiply') {
		result = x * z
	} else if (y === 'divide') {
		result = x / z
	}
	
	return result
}

//negative/positive functionality
const negative=(x) => {
	let result = ''
	x = parseFloat(x)
	if (Math.sign(x) === 1){
		result = -Math.abs(x)
	} else if (Math.sign(x) === -1){
		result = Math.abs(x)
	} else {
		result = x
	}
	return result
}

//percent functionality
const percent=(x) => {
	let result = ''
	result = parseFloat(x / 100)
	return result
}

//depresses buttons
const depressBtn=(btn) =>{
	btn.classList.remove('bg-orange-500', 'hover:bg-orange-400')
	btn.classList.add('bg-white', 'text-orange-500')
}

//un-depresses buttons
const undepressBtn=(btn) =>{
	const action = btn.dataset.action
	if (action ==='add' || action ==='subtract' || action==='multiply' || action ==='divide'){
		btn.classList.remove('bg-white', 'text-orange-500')
		btn.classList.add('bg-orange-500', 'hover:bg-orange-400')
	}
}