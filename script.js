const numbers = [];
const operators = [];
let currentNumber = "";
let currentOperator = "";

// onclick="clearDisplay()" on AC
function clearDisplay() {
    const display = document.querySelector("#display");
    const errorDisplay = document.querySelector("#errorDisplay");

    errorDisplay.style.visibility = "hidden";
    display.textContent = "";
    numbers.length = 0;
    operators.length = 0;
    currentNumber = "";
    currentOperator = "";
}

function back() {
    const display = document.querySelector("#display");

    if (currentNumber) {
        currentNumber = currentNumber.slice(0, currentNumber.length - 1);
    } else if (currentOperator) {
        currentOperator = "";
        currentNumber = numbers.pop()
    }
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
}

// onclick="clickedNum(this)" on all numbers
function clickedNum(numBtn) {
    const display = document.querySelector("#display");
    const errorDisplay = document.querySelector("#errorDisplay");

    errorDisplay.style.visibility = "hidden";

    display.textContent += numBtn.textContent;

    currentNumber += numBtn.textContent;

    if (currentOperator) {
        operators.push(currentOperator);
        currentOperator = "";
    }
}

// onclick="clickedOp(this)" on all operands
function clickedOp(opBtn) {
    const display = document.querySelector("#display");
    const errorDisplay = document.querySelector("#errorDisplay");

    if (currentOperator) { 
        currentOperator = opBtn.textContent;
        display.textContent = display.textContent.slice(0, display.textContent.length - 1);
        display.textContent += currentOperator;
        return;
    }

    errorDisplay.style.visibility = "hidden";

    display.textContent += opBtn.textContent;

    if (currentNumber) {
        numbers.push(currentNumber);
    }
    
    currentNumber = "";
    currentOperator = opBtn.textContent;
}

// onclick="Equal()" on equal button
// TODO: Solve *, / before +, -
function clickedEqual() {
    if (currentNumber) {
        numbers.push(currentNumber);
    } else {
        showError("Did you forget a number?");
        return;
    }
        
    if (!operators.length) {
        showError("No operator given.")
        return;
    }

    const display = document.querySelector("#display");

    let result;

    for (let i = 0; i < numbers.length - 1; i++) {
        if (i === 0) {
            result = operate(operators[i], parseInt(numbers[i]), parseInt(numbers[i+1]));
        } else {
            result = operate(operators[i], result, parseInt(numbers[i+1]));
        }
    }
    numbers.length = 0;
    operators.length = 0;
    currentNumber = result.toString();
    currentOperator = "";

    display.textContent = result;
}

function showError(text) {
    const errorDisplay = document.querySelector("#errorDisplay");
    errorDisplay.textContent = text;
    errorDisplay.style.visibility = "visible";
}

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
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}