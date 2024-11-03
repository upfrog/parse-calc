const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const symbolKeys = ["*", "/", "+", "-", "^", "(", ")"];
const curValDisplay = document.querySelector("#currentValue");
const historyDisplay = document.querySelector("#history");
let inputHistory = [];
let outputHistory = [];
let curMode = "Standard"

let calc = document.querySelector(".controls");

document.addEventListener("keydown", (event) => {
    handleKeyPress(event);
})


calc.addEventListener("click", (event) => {
    handleButtonClick(event);
})

document.querySelector("#switch").addEventListener("click", (event) => {
    toggleModeVariable();
    updateDisplayMode();
})


historyDisplay.addEventListener("click", (event) => {
    console.log(event.target.children);
    if (event.target.classList.includes("historyEntry")) {
        alert(event.target.textContent);
    }    
})


//I'd kind of like to condense this and handleKeyPress(), but it's fine as is.
function handleButtonClick(event) {

    let c = event.target.textContent;
    if (!(event.target.classList.contains("button"))) {
        return;
    }
    else if (c == "=" || c == "Enter") {
        processEnterKey();
    }
    else if (c == "C") {
        curValDisplay.textContent = "";
    }
    else if (c=="del") {
        deleteChar();
    }
    else if (c=="CL") {
        clearHistory();
        curValDisplay.textContent = "";
    }
    else {
        if (modeIsStandard()) {
            appendChar(c);
        }
        else {
            processInputRPN(c);
        }
    }

}

function handleKeyPress(event) {
    event.preventDefault(); // Prevents default form submission or other browser actions
    if (event.key == "Backspace" || event.key == "Delete") {
        deleteChar();
    }
    else if (event.key == "Enter") {
        processEnterKey();
    }
    else if (isValidKey(event.key)) {
        if (modeIsStandard()) {
            appendChar(event.key);
        }
        else {
            processInputRPN(event.key);
        }
    }
}

function processEnterKey() {
    if (modeIsStandard()) {
        let result = evaluateInput(curValDisplay.textContent);
        let cur = curValDisplay.textContent;
        inputHistory.push(cur);
        outputHistory.push(result);
        curValDisplay.textContent = result;
        updateHistoryDisplay();
    }
    else if (modeIsRPN()) {
        let cur = curValDisplay.textContent;
        inputHistory.push(cur);
        curValDisplay.textContent = "";
        updateHistoryDisplay();
    }
    
}

//Adds the most recent operation to the history display
//This is sooooo repetitive.
function updateHistoryDisplay() {
    if (modeIsStandard()) {
        createHistoryEntryStandard(inputHistory.at(-1), outputHistory.at(-1));
    }
    else {
        createHistoryEntryRPN(inputHistory.at(-1));
    }
    historyDisplay.scrollTop = historyDisplay.scrollHeight;
}


function createHistoryEntryStandard(newInputEntry, newOutputEntry) {
    const originalEntry = createHistoryEntry(newInputEntry, "value");
    const equalsEntry = createHistoryEntry("=");
    const resultEntry = createHistoryEntry(newOutputEntry, "value");

    document.querySelector("#original").appendChild(originalEntry);
    document.querySelector("#equals").appendChild(equalsEntry);
    document.querySelector("#result").appendChild(resultEntry);
}

function createHistoryEntry(content, ...classes) {
    const entry = document.createElement("div");
    entry.classList.add("historyEntry", ...classes);
    entry.textContent = content;
    addHistoryElementEventListeners(entry);
    return entry;
}

function addHistoryElementEventListeners(node) {
    node.addEventListener("click", (event) => {
        setCurValDisplay(event.target.textContent);
    });
}

/**
 * Creates a new div, adds the historyEntry class, adds an event listener for
 * history recall, set the text, and appends it.
 * 
 * @param {*} newEntry 
 */
function createHistoryEntryRPN(newEntry) {
    const entry = createHistoryEntry(newEntry, "historyEntry", "value");
    addHistoryElementEventListeners(entry);
    document.querySelector("#original").appendChild(entry);
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
    return numberKeys.includes(key) || symbolKeys.includes(key);
}

function setCurValDisplay(val) {
    curValDisplay.textContent = val;
}


/**
 * These functions are a bit unnecesary, but I want to spend as little time
 * as possible manually working with strings.
 * 
 */
function toggleModeVariable() {
    if (curMode === "Standard") {
        curMode = "RPN";
    }
    else if (curMode === "RPN") {
        curMode = "Standard";
    }
}

function modeIsRPN() {
    return curMode === "RPN";
}


function modeIsStandard() {
    return curMode === "Standard";
}

//Assumes that the DOM needs to be changed to match the current curMode
function updateDisplayMode() {
    if (modeIsStandard()) {
        document.querySelector("#op_equals").textContent = "=";
        
        let toggleNegativeBtn = document.querySelector("#op_toggle_negativity");
        toggleNegativeBtn.id = "misc_openParen"
        toggleNegativeBtn.textContent = "("
        toggleNegativeBtn.classList.remove("doubleWidthOperations");

        let closeParen = document.createElement("button");
        closeParen.classList.add("button");
        closeParen.id = "misc_closeParen";
        closeParen.textContent = ")";
        document.querySelector(".operations").insertBefore(closeParen, toggleNegativeBtn.nextSibling);
    }
    else {
        document.querySelector("#op_equals").textContent = "Enter";
        let openParen = document.querySelector("#misc_openParen");
        
        openParen.replaceWith(createToggleNegativeButton());
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


function processInputRPN(c) {
    if (numberKeys.includes(c)) {
        appendChar(c);
    }
    else {
        let result = "";
        let historyParent = document.querySelector("#original")
        //Check if it's a binary operation
        if (["+", "-", "*", "/", "^"].includes(c)) {
            //If there is a number currently being entered, assume it is an operand
            if (curValDisplay.textContent == "") {
                result = evaluateInput(inputHistory.at(-2), inputHistory.at(-1), c);
            
                historyParent.removeChild(historyParent.lastChild);
                historyParent.removeChild(historyParent.lastChild);
                inputHistory = inputHistory.slice(0, -2);
            }
            else {
                result = evaluateInput(inputHistory.at(-1), curValDisplay.textContent, c);
            
                historyParent.removeChild(historyParent.lastChild);
                inputHistory = inputHistory.slice(0, -1);
            }
            
            curValDisplay.textContent = "";
            inputHistory.push(result);
            updateHistoryDisplay();
        }
        else if (c == "+/-") {            
            if (curValDisplay.textContent.length > 0) {
                alert("changing cur val")
                curValDisplay.textContent = toggleNegativity(curValDisplay.textContent);
            }
            else if (inputHistory.length > 0) {
                alert("changing history")
                inputHistory[inputHistory.length-1] = toggleNegativity(inputHistory[inputHistory.length-1]);
                historyParent.lastChild.textContent = toggleNegativity(historyParent.lastChild.textContent);
            }
            else {
                alert("in else")
                return; //does nothing. This will run if the user has not entered anythign at all
            }

        }
        else {
            if (curValDisplay.textContent == "") {
                result = evaluateInput(inputHistory.at(-1), c);
            
                historyParent.removeChild(historyParent.lastChild);
                inputHistory = inputHistory.slice(0, -1);
                
            }
            else {
                result = evaluateInput(curValDisplay.textContent, c);
            }
            curValDisplay.textContent = "";
            inputHistory.push(result);
            updateHistoryDisplay();
            
        }

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