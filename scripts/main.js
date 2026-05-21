const MAX_CHAR_COUNT = 11;

const buttonsContainer = document.querySelector(".buttons-container");
const display = document.querySelector(".display-text");
const historyEntryContainer = document.querySelector("#history-entry-container");
const clearHistoryButton = document.querySelector("#clear-history");

const buttons = {};
const queryResult = [...document.querySelectorAll(".buttons-container button")];
for(const element of queryResult) {
    buttons[element.id] = element;
}

let operand1 = null;
let operand2 = null;
let operator = null;
let nextNumberInputClears = false;

//main

updateDisplay("0");
buttonsContainer.addEventListener("click", handleButtonCliked);
document.addEventListener("keydown", handleKeydown);
clearHistoryButton.addEventListener("click", handleClearHistoryClicked);

//functions
function updateDisplay(displayText) {
    displayText = removeLeadingZero(displayText);
    display.textContent = displayText;
}

function removeLeadingZero(text) {
    if(text.length > 1 && text[0] === "0" && text[1] !== ".") {
        text = text.slice(1);
    }

    return text;
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
            typeDecimal();
            break;
        case "negate":
            negate();
            break;
        case "backspace":
            deleteLastCharacter();
            break;
    }
}

function handleKeydown(keyboardEvent) {
    if(keyboardEvent.repeat) {
        return;
    }
    
    switch(keyboardEvent.key) {
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
            setButtonActive(keyboardEvent.key);
            typeNumber(keyboardEvent.key);
            break;
        case "+":
            setButtonActive("add");
            typeOperator("add");
            break;
        case "-":
            setButtonActive("subtract");
            typeOperator("subtract");
            break;
        case "*":
            setButtonActive("multiply");
            typeOperator("multiply");
            break;
        case "/":
            setButtonActive("divide");
            typeOperator("divide");
            break;
        case "Enter":
            setButtonActive("equal");
            operate();
            break;
        case ",":
        case ".":
            setButtonActive("decimal");
            typeDecimal();
            break;
        case "Backspace":
            setButtonActive("backspace");
            deleteLastCharacter();
            break;
        case "Escape":
            setButtonActive("clear");
            clear();
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

    if(isDisplayingMaxCharacters()) {
        return;
    }

    if(operator === null) {
        operand1 ??= "";
        operand1 += number;
        operand1 = removeLeadingZero(operand1);
        updateDisplay(operand1);
    } else {
        operand2 ??= "";
        operand2 += number;
        operand2 = removeLeadingZero(operand2);
        updateDisplay(operand2);
    }

}

function typeDecimal() {
    if(display.textContent.includes('.')  && (operator === null || operand2 !== null)) {
        return;
    }

    if(nextNumberInputClears) {
        clear();
    }

    if(isDisplayingMaxCharacters()) {
        //can't enter any more digits so decimal point should not show up now
        return;
    }

    if(operator === null) {
        operand1 ??= "0";
        operand1 += ".";
        updateDisplay(operand1);
    } else {
        operand2 ??= "0";
        operand2 += ".";
        updateDisplay(operand2);
    }
}

function isDisplayingMaxCharacters() {
    const replaced = display.textContent.replace(/[-.]?/g, "");
    return replaced.length >= MAX_CHAR_COUNT && (operator === null || operand2 !== null);
}

function negate() {
    if(operator === null) {
        operand1 ??= "0";
        operand1 = (operand1 * -1).toString();
        updateDisplay(operand1.toString());
    } else {
        operand2 ??= "0";
        operand2 = (operand2 * -1).toString();
        updateDisplay(operand2);
    }
}

function typeOperator(newOperator) {
    if(operand2 !== null) {
        operate();
    }
    
    if(nextNumberInputClears) {
        nextNumberInputClears = false;
    }
    
    operand1 ??= "0";
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

    if(result.toString().replace(/[-.]?/g, "").length > MAX_CHAR_COUNT) {
        //convert number to exponential if too long for display
        result = result.toExponential(3);
    }
    result = result.toString();

    addHistoryEntry(operand1, operand2, operator, result);
    operand1 = result;
    operand2 = null;
    operator = null;
    nextNumberInputClears = true;
    updateDisplay(operand1);
}

function deleteLastCharacter() {
    if(operator === null) {
        if(operand1 === null) {
            return;
        }
        
        operand1 = operand1.slice(0, operand1.length - 1);
        if(operand1.length === 0) {
            operand1 = "0";
        }
        updateDisplay(operand1);
    } else {
        if(operand2 === null) {
            return;
        }
        
        operand2 = operand2.slice(0, operand2.length - 1);
        if(operand2.length === 0) {
            operand2 = "0";
        }
        updateDisplay(operand2);
    }
}

function setButtonActive(id) {
    const button = buttons[id];
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 100);
}

function addHistoryEntry(operand1, operand2, operator, result) {
    const historyEntry = document.createElement("div");
    let operatorSymbol;
    switch(operator) {
        case "add":
            operatorSymbol = "+";
            break;
        case "subtract":
            operatorSymbol = "\u2212";
            break;
        case "multiply":
            operatorSymbol = "\u00d7";
            break;
        case "divide":
            operatorSymbol = "÷";
            break;
    }
    historyEntry.textContent = `${removeLeadingZero(operand1)} ${operatorSymbol} ${removeLeadingZero(operand2)} = ${result}`;
    historyEntry.classList.add("history-entry");
    historyEntryContainer.appendChild(historyEntry);
}

function handleClearHistoryClicked() {
    historyEntryContainer.replaceChildren();
}