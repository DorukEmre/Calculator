const result = document.querySelector('.result');
const input = document.querySelector('.input');
const buttons = document.querySelectorAll('button');
let inputNumberString = "";
let firstNumber = "";
let secondNumber = "";
let midResult = "";
let operator = "";

function add(a, b) {
    return (a*10**12 + b*10**12) / 10**12
}
function subtract(a, b) {
    return (a*10**12 - b*10**12) / 10**12
}
function multiply(a, b) {
    return (a*10**10 * b*10**10) / 10**20
}
function divide(a, b) {
    return (b === 0) ? "Error / by 0" : (a*10**10 / b*10**10) / 10**20
}

function operate(operator, a, b) {
    return (operator === "add") ? add(a, b)
        : (operator === "subtract") ? subtract(a, b)
        : (operator === "multiply") ? multiply(a, b)
        : (operator === "divide") ? divide(a, b)
        : "ERROR 1";
}

function displayOperator(operator) {
    (operator === "add") ? inputDisplay("+")
    : (operator === "subtract") ? inputDisplay("-")
    : (operator === "multiply") ? inputDisplay("x")
    : (operator === "divide") ? inputDisplay("/")
    : inputDisplay("ERROR 2");
}

function inputDisplay(inputCharacter) {
    if (input.textContent.includes("ERROR") === true) {
        input.textContent = "";
    }
    let newText = input.textContent + inputCharacter;
    return input.textContent = newText.slice(-12)
}

function midResultDisplay(a) {
    result.textContent = "";
    result.textContent = a.toString().slice(0, 12);
}

function finalResultDisplay(a) {
    input.textContent = "";
    result.textContent = "";
    result.textContent = a.toString().slice(0, 12);
}

function clearAll() {
    inputNumberString = "";
    firstNumber = "";
    secondNumber = "";
    midResult = "";
    operator = "";
    input.textContent = "";
    result.textContent = "";
}

// Numbers
buttons.forEach((button) => {
    button.addEventListener('click', () => {

        if (result.textContent === "Error / by 0") { 
            clearAll();
        }
        if (button.className.includes("number") === true) {

            if (input.textContent === "" && result.textContent !== "") {
                clearAll();
            } 
            let inputNumber = button.className.slice(button.className.length-1)
            inputNumberString += inputNumber.toString()
            return inputDisplay(inputNumber);

        }
    });
});

// Operations
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        if (button.className.includes("operator") === true) {
                        
            // Don't allow two operators in a row
            if (input.textContent.slice(input.textContent.length-1) === "+"
                || input.textContent.slice(input.textContent.length-1) === "-"
                || input.textContent.slice(input.textContent.length-1) === "x"
                || input.textContent.slice(input.textContent.length-1) === "/"
                || inputNumberString === ".") {
                return
            
            //Don't allow operators besides "-" as first input
            } else if (inputNumberString === "" 
            && button.className.slice(9) !== "subtract" 
            && firstNumber === "") {
                return

            } else if (inputNumberString === "" 
            && button.className.slice(9) === "subtract" 
            && firstNumber === "") {
                inputNumberString = "-";
                return displayOperator("subtract");                 

            } else if (firstNumber !== "" && secondNumber === "" && input.textContent !== "") {
                
                if (inputNumberString.slice(inputNumberString.length-1) === ".") { 
                    inputNumberString = inputNumberString.slice(0, -1);
                    input.textContent = input.textContent.slice(0, -1);
                }
                
                secondNumber = inputNumberString;
                inputNumberString = "";
                midResult = operate(operator, Number(firstNumber), Number(secondNumber))
                firstNumber = midResult;
                secondNumber = "";
                midResultDisplay(midResult);
                if (midResult === "Error / by 0") { return }
                operator = button.className.slice(9);
                return displayOperator(operator);  
            
            } else if (firstNumber === "") {
                if (inputNumberString.slice(inputNumberString.length-1) === ".") { 
                    inputNumberString = inputNumberString.slice(0, -1);
                    input.textContent = input.textContent.slice(0, -1);
                }

                firstNumber = inputNumberString;
                inputNumberString = "";
                operator = button.className.slice(9);
                return displayOperator(operator);   

            //New operation after having returned result
            } else if (firstNumber !== "" && secondNumber === "" && input.textContent === "") {
                result.textContent = "";
                input.textContent = midResult.toString().slice(0, 11);;
                operator = button.className.slice(9);
                return displayOperator(operator);            
            }
        } 
    });
});

// Clear everything
const buttonClear = document.querySelector('.button-clear');
buttonClear.addEventListener('click', () => {
    clearAll();  
});

// Add decimal
const buttonDot = document.querySelector('.button-dot');
buttonDot.addEventListener('click', () => {
    
    if (inputNumberString.includes(".") === true) {
        return

    } else if (firstNumber !== "" && secondNumber === "" 
    && input.textContent === "" && firstNumber.toString().includes(".") === false) {
        inputNumberString = firstNumber;
        firstNumber = "";
        inputNumberString += ".";
        result.textContent = "";
        return inputDisplay(inputNumberString);

    } else if (firstNumber !== "" && secondNumber === "" 
    && input.textContent === "" && firstNumber.toString().includes(".") === true) {
        clearAll();
    }
    
    inputNumberString += "."
    return inputDisplay(".");
});


// Return result
const buttonEqual = document.querySelector('.button-equal');
buttonEqual.addEventListener('click', () => {
    let lastInput = input.textContent.slice(input.textContent.length-1);
    
    if (firstNumber === "") {
        return

    } else if (secondNumber !== "" && (lastInput === "+" || lastInput === "-" || lastInput === "x" || lastInput === "/")) {
        operator = "";
        return finalResultDisplay(midResult);
    
    } else if (firstNumber !== "" && secondNumber === "" && input.textContent === "") {
        return

    } else if (firstNumber !== "" && secondNumber === "") {
        if (inputNumberString === ".") {
            inputNumberString = 0
        }
        secondNumber = inputNumberString;
        inputNumberString = "";
        midResult = operate(operator, Number(firstNumber), Number(secondNumber))
        firstNumber = midResult;
        secondNumber = "";
        operator = "";
        return finalResultDisplay(midResult);
    
    } 
});

// Undo last input
const buttonUndo = document.querySelector('.button-undo');
buttonUndo.addEventListener('click', () => {
    let lastInput = input.textContent.slice(input.textContent.length-1);

    if (lastInput === "+" || lastInput === "-" ||lastInput === "x" || lastInput === "/" ) {
        return

    } else if (lastInput === "." 
        || (Number(lastInput) >= 0 && Number(lastInput) < 10)) {

        inputNumberString = inputNumberString.slice(0, -1);
        input.textContent = input.textContent.slice(0, -1);
        return
    } 
});
