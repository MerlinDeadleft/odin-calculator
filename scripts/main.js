const MAX_CHAR_COUNT = 11;

const buttonsContainer = document.querySelector(".buttons-container");
const display = document.querySelector(".display-text");

let operand1 = null;
let operand2 = null;
let operator = null;
let nextNumberInputClears = false;

//main

updateDisplay("0");
buttonsContainer.addEventListener("click", handleButtonCliked);

//functions
function updateDisplay(displayText) {
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
        case "subtract":
        case "multiply":
        case "divide":
            typeOperator(clickEvent.target.id);
            break;
        case "equal":
            operate();
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
    nextNumberInputClears = false;
    updateDisplay("0");
}

function typeNumber(number) {
    if(nextNumberInputClears) {
        clear();
    }

    if(display.textContent.replace(/[-.]?/, "").length == MAX_CHAR_COUNT && (operator === null || operand2 !== null)) {
        return;
    }

    if(operator === null) {
        operand1 ??= "";
        operand1 += number;
        updateDisplay(operand1);
    } else {
        operand2 ??= "";
        operand2 += number;
        updateDisplay(operand2);
    }

}

function negate() {
    if(operator === null) {
        operand1 ??= "0";
        operand1 *= -1;
        updateDisplay(operand1.toString());
    } else {
        operand2 ??= "0";
        operand2 *= -1;
        updateDisplay(operand2.toString());
    }

}

function typeOperator(newOperator) {
    if(operand2 !== null) {
        operate();
    }

    if(nextNumberInputClears) {
        nextNumberInputClears = false;
    }

    operator = newOperator;
}

function operate() {
    if(operator === null || operand2 === null) {
        return;
    }

    let result;

    switch(operator) {
        case "add":
            result = parseFloat(operand1) + parseFloat(operand2);
            break;
        case "subtract":
            result = parseFloat(operand1) - parseFloat(operand2);
            break;
        case "multiply":
            result = parseFloat(operand1) * parseFloat(operand2);
            break;
        case "divide":
            if(operand2 == 0) {
                result = "ERR";
                break;
            }
            result = parseFloat(operand1) / parseFloat(operand2);
            break;
    }

    operand1 = result.toString();
    let length = operand1.replace(/[-.]?/, "").length;
    if(operand1.replace(/[-.]?/, "").length > MAX_CHAR_COUNT) {
        //Make sure negative sign and decimal point are not included in count when slicing.
        //Negative sign has its own reserved position and decimal point has no width in used font
        let occurences = operand1.replace(/[^-.]/g, "").length;
        operand1 = operand1.slice(0, MAX_CHAR_COUNT + occurences);
    }

    operand2 = null;
    operator = null;
    nextNumberInputClears = true;
    updateDisplay(operand1);
}