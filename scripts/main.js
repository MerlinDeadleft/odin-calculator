const MAX_CHAR_COUNT = 11;

const buttonsContainer = document.querySelector(".buttons-container");
const display = document.querySelector(".display-text");

let operand1 = null;
let operand2 = null;
let operator = null;
let displayText = "0";

//main

updateDisplay();
buttonsContainer.addEventListener("click", handleButtonCliked);

//functions
function updateDisplay() {
    if(displayText.length > 1 && displayText[0] == 0) {
        displayText = displayText.slice(1);
    }
    display.textContent = displayText;
}

function handleButtonCliked(clickEvent) {
    switch(clickEvent.target.id) {
        case "clear":
            clear();
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            typeNumber(clickEvent.target.id);
            break;
        case "add":
            break;
        case "subtract":
            break;
        case "multiply":
            break;
        case "divide":
            break;
        case "equal":
            break;
        case "decimal":
            break;
        case "negate":
            negate();
            break;
    }
}

function clear() {
    operand1 = null;
    operand2 = null;
    operator = null;
    displayText = "0";
    updateDisplay();
}

function typeNumber(number) {
    if(displayText.replace(/-?/, "").length == MAX_CHAR_COUNT) {
        return;
    }

    if(operator === null) {
        operand1 ??= "";
        operand1 += number;
        displayText = operand1;
    } else {
        operand2 ??= "";
        operand2 += number;
        displayText = operand2
    }

    updateDisplay();
}

function negate() {
    if(operator === null) {
        operand1 ??= "0";
        operand1 *= -1;
        displayText = operand1.toString();
    } else {
        operand2 ??= "0";
        operand2 *= -1;
        displayText = operand2.toString();
    }

    updateDisplay();
}