//TODO: Add calculation history

// Array to store all numbers for current calculation
const numbers = [];
// Array to store all operators for current calculation
const operators = [];
// String of the current number being entered
let currentNumber = "";
// String of the current operator being entered
let currentOperator = "";

// Calculator display to show current input. Shows result after hitting equal button
const display = document.querySelector("#display");

// Error display hint. Shows error messages to the right of the calculator.
const errorDisplay = document.querySelector("#errorDisplay");



// Plays button press sound
function playButtonSound() {
    document.querySelector("#buttonPressed").currentTime = 0;
    document.querySelector("#buttonPressed").play();
}

// Plays error sound
function playErrorSound() {
    document.querySelector("#errorSound").currentTime = 0;
    document.querySelector("#errorSound").play();
}

// Hides error display
function hideErrorDisplay() {
    errorDisplay.style.visibility = "hidden";
}

// Clears all previous calculations from memory and resets display. (Delete button on keyboard and AC button on calculator)
function allClear() {
    playButtonSound();
    hideErrorDisplay();
    
    // Clear display
    display.textContent = "";
    // Empty arrays
    numbers.length = 0;
    operators.length = 0;
    // Clear current number and operator
    currentNumber = "";
    currentOperator = "";
}

// Removes last character of the input
function back() {
    playButtonSound();
    hideErrorDisplay();

    if (currentNumber) {
        currentNumber = currentNumber.slice(0, currentNumber.length - 1);
    } else {
        currentOperator = operators.pop();
        currentOperator = "";
        if (numbers.length >= 1) {
            currentNumber = numbers.pop();
        } else {
            currentNumber = "";
        }
        
    }
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
}

// Any number or comma has been clicked
function clickedNum(numBtn) {
    playButtonSound();
    hideErrorDisplay();

    // Show error if comma is already in use
    if (numBtn.id === "num_dot" && currentNumber.includes(".")) {
        showError("Comma already in use.");
        return;
    }

    display.textContent += numBtn.textContent;
    currentNumber += numBtn.textContent;

    // If an operator was the last character in the input, push it into operators array
    if (currentOperator) {
        operators.push(currentOperator);
        currentOperator = "";
    }
}

// onclick="clickedOp(this)" on all operands
function clickedOp(opBtn) {
    playButtonSound();
    hideErrorDisplay();

    // Give error if no number was entered yet
    if (!numbers.length && !operators.length && !currentNumber) {
        showError("You need to enter a number first");
        return;
    }

    // If an operator is already the last character of the calculation, exchange it with newly clicked one
    if (currentOperator) { 
        currentOperator = opBtn.textContent;
        display.textContent = display.textContent.slice(0, display.textContent.length - 1);
        display.textContent += currentOperator;
        return;
    } else {
        currentOperator = opBtn.textContent;
    }

    // Push current number into numbers array
    numbers.push(currentNumber);
    currentNumber = "";

    display.textContent += opBtn.textContent;
}

// onclick="clickedEqual()" on equal button
function clickedEqual() {
    playButtonSound();

    // Give error if input is completely empty
    if (!currentNumber && !currentOperator && !numbers.length && !operators.length) {
        showError("No calculation to solve.")
        return;
    }
    
    // Give error if no operator is present in input
    if (!operators.length && !currentOperator) {
        showError("Operator is missing.")
        return;
    }

    // Give error if input is ending with an operator
    if (currentOperator) {
        showError("Calculation should end with a number.")
        return;
    }

    // Push currentNumber from input into numbers array
    numbers.push(currentNumber);

    // Calculate

    // First calculate all * and / pairs , store their result in numbers, until none are left
    while (operators.includes("\xD7") || operators.includes("\xF7")) {
        mIndex = operators.indexOf("\xD7");
        
        if (mIndex >= 0) {
            numbers[mIndex] = operate(operators[mIndex], numbers[mIndex], numbers[mIndex + 1]);
            numbers.splice(mIndex + 1, 1);
            operators.splice(mIndex, 1);
        }
        
        dIndex = operators.indexOf("\xF7");
        
        if (dIndex >= 0) {
            numbers[dIndex] = operate(operators[dIndex], numbers[dIndex], numbers[dIndex + 1]);
            numbers.splice(dIndex + 1, 1);
            operators.splice(dIndex, 1);
        }
    }

    // Calculate rest of +/- calculations
    let result;

    if (numbers.length > 1) {
        for (let i = 0; i < numbers.length - 1; i++) {
            if (i === 0) {
                result = operate(operators[i], parseFloat(numbers[i]), parseFloat(numbers[i+1]));
            } else {
                result = operate(operators[i], result, parseInt(numbers[i+1]));
            }
        }
    } else {
        result = numbers[0];
    }

    // Reset variables
    numbers.length = 0;
    operators.length = 0;
    currentOperator = "";

    // Keep result in currentNumber for further calculations
    currentNumber = result.toString();

    display.textContent = result;
}

// Reverse plus/minus on the current single number
function clickedPlusMinus() {
    playButtonSound();

    if (numbers.length) {
        showError("Can only use negation on a single number.")
        return;
    }

    if (currentNumber) {
        if (currentNumber.split("")[0] == "-") {
            currentNumber = currentNumber.slice(1);
            display.textContent = display.textContent.slice(1);
        } else {
            currentNumber = "-" + currentNumber;
            display.textContent = "-" + display.textContent;
        }
    }
}

// Shows an error message on the right of the calculator
function showError(errorText) {
    playErrorSound();
    errorDisplay.textContent = errorText;
    errorDisplay.style.visibility = "visible";
}


// Calculator functions
function operate(operand, num1, num2) {
    if (operand === "+") return add(num1, num2);
    else if (operand === "-") return substract(num1, num2);
    else if (operand === "\xD7") return multiply(num1, num2);
    else if (operand === "\xF7") return divide(num1, num2);
}
  
function add(num1, num2) {
    return num1 + num2;
}

function substract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    result = num1 * num2;
    if (result % 1 === 0) {
        return result;
    } else {
        return result.toFixed(3);
    }
}

// TODO: Add funny message when dividing by 0
function divide(num1, num2) {
    if (num1 % num2 === 0) {
        return num1 / num2;
    } else {
        return (num1 / num2).toFixed(3);
    }
}

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    console.log(e.keyCode);
    // numbers 0-9 (including numpad)
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 110) {
        numberButton = e.key.toString();
        clickedNum(document.querySelector(`[data-num="${numberButton}"]`));
    // Backspace
    } else if (e.keyCode === 8){
        back();
    // Enter
    } else if (e.keyCode === 13) {
        clickedEqual();
    // Delete
    } else if (e.keyCode === 46) {
        allClear();
    // Operators
    } else if (e.keyCode === 106 || e.keyCode === 107 || e.keyCode === 109 || e.keyCode === 111) {
        opButton = e.key;
        clickedOp(document.querySelector(`[data-op="${opButton}"]`));
    }
});