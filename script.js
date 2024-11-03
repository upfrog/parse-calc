const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "e"];
const symbolKeys = ["*", "/", "+", "-", "^", "(", ")"];
const binaryOperations = ["*", "/", "+", "-", "^"];
const unaryOperations = ["!", "sqrt", "sin", "cos", "tan", "ln", "+/-"]
const curValDisplay = document.querySelector("#currentValue");
const historyDisplay = document.querySelector("#history");
let inputHistory = [];
let outputHistory = [];
let curMode = "Standard"

let calc = document.querySelector(".controls");

document.addEventListener("keydown", (event) => {
    handleInput(event)
})

calc.addEventListener("click", (event) => {
    handleInput(event)
})

document.querySelector("#switch").addEventListener("click", () => {
    toggleModeVariable();
})

/**
 * Takes input in the form of button click or a keyboard key, and processes it.
 * 
 * @param {event} Some type of input event 
 */
function handleInput(event) {
    event.preventDefault();
    let val = (event.key == undefined) ?  event.target.textContent : event.key;
    
    if (val == "=" || val == "Enter") {
        processEnterOrEquals();
    }
    else if (val == "C") {
        setCurValDisplay("");
    }
    else if (val == "del" || val == "Backspace" || val == "Delete") {
        deleteChar();
    }
    else if (val == "CL") {
        clearHistory();
    }
    else if (val == "+/-") { 
        toggleNegativityOperation();
    }  
    else if (isValidKey(val)) {
        if (modeIsStandard()) {
            appendChar(val);
        }
        else {
            processInputRPN(val);
        }
    }
}

/**
 * Implements behavior of "=" button and Enter keys.
 * 
 * If in Standard mode, this evaluates the current expression and updates
 * history accordingly. If the mode is RPN, this simply pushes the current
 * expression to the history - which is itself a simpler operation in RPN. * 
 */
function processEnterOrEquals() {
    inputHistory.push(getCurVal());
    if (modeIsStandard()) {
        let result = evaluateInput(getCurVal());
        outputHistory.push(result);
        setCurValDisplay(result);
    }
    else {
        setCurValDisplay("");
    }
    updateHistoryDisplay();
}

/**
 * Builds and displays new a history entry for the most recent input.
 * 
 * This function only determines how to build the new entry, and refreshes
 * the scroll. The actual construction is outsourced.
 * 
 * An RPN calculator builds it's equations out of smaller building blocks, 
 * so there is rarely enough context available to cleanly display past
 * operations for reference. However, it's stack (which, in this 
 * implementation, is the same as it's history) is an integral part of
 * how it functions. This means that the two history displays serve
 * different needs, and so are implemented differently.* 
 */
function updateHistoryDisplay() {
    if (modeIsStandard()) {
        createHistoryEntryStandard(inputHistory.at(-1), outputHistory.at(-1));
    }
    else {
        createHistoryEntryRPN(inputHistory.at(-1));
    }
    historyDisplay.scrollTop = historyDisplay.scrollHeight;
}

/**
 * Builds and displays three divs to hold a Standard mode history entry.
 * @param {string} newInputEntry - The input value to be displayed.
 * @param {string} newOutputEntry - The output value to be displayed.
 */
function createHistoryEntryStandard(newInputEntry, newOutputEntry) {
    const originalEntry = createHistoryDiv(newInputEntry, "value");
    const equalsEntry = createHistoryDiv("=");
    const resultEntry = createHistoryDiv(newOutputEntry, "value");

    document.querySelector("#original").appendChild(originalEntry);
    document.querySelector("#equals").appendChild(equalsEntry);
    document.querySelector("#result").appendChild(resultEntry);
}


/**
 * Builds and displays one div to hold an RPN mode history entry.
 * @param {string} newEntry - The number to be displayed.
 */
function createHistoryEntryRPN(newEntry) {
    const entry = createHistoryDiv(newEntry, "historyEntry", "value");
    document.querySelector("#original").appendChild(entry);
}

/**
 * Creates a div with the provided content as text, and zero or more classes.
 * @param {string} content - The text content the div will display.
 * @param  {...any} classes - Zero or more classes to be added to the div.
 * @returns {node} A new div with the inputted content and classes. 
 */
function createHistoryDiv(content, ...classes) {
    const entry = document.createElement("div");
    entry.classList.add("historyEntry", ...classes);
    entry.textContent = content;
    addHistoryEntryEventListener(entry);
    return entry;
}

/**
 * Adds an event listener to the inputted node allowing for history recall.
 * @param {node} node
 */
function addHistoryEntryEventListener(node) {
    node.addEventListener("click", (event) => {
        setCurValDisplay(event.target.textContent);
    });
}

//Expects a string, usually a single character
function appendChar(char) {
    curValDisplay.textContent = curValDisplay.textContent + char;
}

function deleteChar() {
    let t = curValDisplay.textContent;
    curValDisplay.textContent = t.slice(0, -1);
}

function isValidKey(key) {
    return numberKeys.includes(key) || symbolKeys.includes(key) || binaryOperations.includes(key) || unaryOperations.includes(key);
}

function setCurValDisplay(val) {
    curValDisplay.textContent = val;
}

function getCurVal() {
    return curValDisplay.textContent;
}

function curValDisplayIsEmpty() {
    return (curValDisplay.textContent.length == 0);
}






function isBinaryOp(c) {
    return binaryOperations.includes(c);
}

function isUnaryOp(c) {
    return unaryOperations.includes(c);
}


/*
DISPLAY MODE FUNCTIONS
*/

/** Switches the current display mode, then calls helper function to rebuild display. */
function toggleModeVariable() {
    if (curMode === "Standard") {
        curMode = "RPN";
    }
    else if (curMode === "RPN") {
        curMode = "Standard";
    }
    updateDisplayMode();
}

function modeIsStandard() {
    return curMode === "Standard";
}

/**
 * Assumes that a change in the display mode has occurred, and updates DOM accordingly.
 * 
 * This should only be called from toggleModeVariable.
 */
function updateDisplayMode() {
    if (modeIsStandard()) {
        //Change the enter button back to equals
        document.querySelector("#op_equals").textContent = "=";
        
        //Turn the toggle negative button back to open paren
        let toggleNegativeBtn = document.querySelector("#op_toggle_negativity");
        toggleNegativeBtn.id = "misc_openParen"
        toggleNegativeBtn.textContent = "("
        toggleNegativeBtn.classList.remove("doubleWidthOperations");

        //Create new closeParen element
        let closeParen = document.createElement("button");
        closeParen.classList.add("button");
        closeParen.id = "misc_closeParen";
        closeParen.textContent = ")";
        //This inserts after toggleNegativeButton
        document.querySelector(".operations").insertBefore(closeParen, toggleNegativeBtn.nextSibling);
    }
    else {
        document.querySelector("#op_equals").textContent = "Enter";        
        document.querySelector("#misc_openParen").replaceWith(createToggleNegativeButton());
        document.querySelector("#misc_closeParen").replaceWith();
    }
    setCurValDisplay("");
    clearHistory();
}

function createToggleNegativeButton() {
    let toggleNegativeBtn = document.createElement("button");
    toggleNegativeBtn.classList.add("button");
    toggleNegativeBtn.classList.add("doubleWidthOperations");
    toggleNegativeBtn.id = "op_toggle_negativity";
    toggleNegativeBtn.textContent = "+/-"

    return toggleNegativeBtn;
}



/**
 * RPN input is either a number, in which case it gets pushed to the stack, or an operation, in
 * which case either something needs to be taken off the stack, the value in curValDisplay needs
 * to be used, or both.
 * 
 * @param {*} c 
 * @returns 
 */
function processInputRPN(c) {
    if (numberKeys.includes(c)) {
        appendChar(c);
    }
    else {
        let result = "";
        //If an operator is binary, we need 2 operands. If it is unary, we only need one.
        //If there is a value in the display, that will be one of our operands. Otherwise,
        //we will get all operands from the stack.
        if (isBinaryOp(c) && curValDisplayIsEmpty()) {
            result = evaluateInput(inputHistory.at(-2), inputHistory.at(-1), c);
            removeEntriesFromHistory(2);
        }
        else if (isBinaryOp(c) && !curValDisplayIsEmpty()) {
            result = evaluateInput(inputHistory.at(-1), curValDisplay.textContent, c);
            removeEntriesFromHistory(1);
        }
        else if (!isBinaryOp(c) && curValDisplayIsEmpty()) {
            result = evaluateInput(inputHistory.at(-1), c);
            removeEntriesFromHistory(1);
        }
        else {
            result = evaluateInput(curValDisplay.textContent, c);
        }
        curValDisplay.textContent = "";
        inputHistory.push(String(result));
        updateHistoryDisplay();
    }
}


function toggleNegativityOperation() {
    if (!(curValDisplayIsEmpty())) {
        setCurValDisplay(toggleNegativity(getCurVal()));
    }
    else if (inputHistory.length > 0) {
        let k = inputHistory.length - 1;
        let historyParent = document.querySelector("#original");
        inputHistory[k] = toggleNegativity(inputHistory[k]);
        historyParent.lastChild.textContent = toggleNegativity(historyParent.lastChild.textContent);
    }
    else {
        return; //does nothing. This will run if the user has not entered anything at all
    }
}

//This only works for RPN
function removeEntriesFromHistory(num) {
    inputHistory = inputHistory.slice(0, (num * (-1)));
    let parent = document.querySelector("#original"); //from .display#history
    while (num > 0) {
        parent.removeChild(parent.lastChild);
        --num;
    }
}

/**Returns the input with a toggled sign
 * 
 * @param {*} num 
 */
function toggleNegativity(num) {
    if (isNegative(num)) {
        return num.slice(1);
    }
    else {
        return ("-" + num);
    }
}

function isNegative(num) {
    return (num.slice(0,1) == "-")
}

function clearHistory() {
    clearHistoryDisplay();
    clearLogicalHistory();    
}

function clearHistoryDisplay() {
    document.querySelector("#original").replaceChildren();
    //Clearing these is unnecesarry for RPN mode
    document.querySelector("#equals").replaceChildren();
    document.querySelector("#result").replaceChildren();
}

function clearLogicalHistory() {
    inputHistory = [];
    outputHistory = [];
}



/*
High level. Am I better off:
1) doing some sort of elaborate re-write to use a different set of methods under
different circumstances?
2) burning everything down and re-writing this in an object-oriented way?
3) adding mode checks in my functions, and then making them behave accordingly?
    - I feel like this is the way.

1) produces something complicated, with lots of new writing. 2) also has
lots of re-writing, and I don't think I'll be able to reuse a huge amount. 3)
still has some re-writing to be done, but it's not as bad.


May want to decouple "send to backend" from "enter was pressed"

Maybe exploit the difference between an event with button text "=" vs "enter"?


*/