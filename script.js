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
    //alert(event.target);
})

document.querySelector("#switch").addEventListener("click", (event) => {
    //alert("current mode: " + curMode);
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
    if (event.target.className != "button") {
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
    //event.preventDefault(); // Prevents default form submission or other browser actions
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
        let originalEntry = document.createElement("div");
        let equalsEntry = document.createElement("div");
        let resultEntry = document.createElement("div");

        originalEntry.classList.add("historyEntry");
        equalsEntry.classList.add("historyEntry");
        resultEntry.classList.add("historyEntry");

        originalEntry.addEventListener("click", (event) => {
            
            setCurValDisplay(event.target.textContent);
            
        })

        resultEntry.addEventListener("click", (event) => {
            setCurValDisplay(event.target.textContent);
        })
        
        originalEntry.textContent = inputHistory.at(-1);
        equalsEntry.textContent = "=";
        resultEntry.textContent = outputHistory.at(-1);

        document.querySelector("#original").appendChild(originalEntry);
        document.querySelector("#equals").appendChild(equalsEntry);
        document.querySelector("#result").appendChild(resultEntry);
        historyDisplay.scrollTop = historyDisplay.scrollHeight;
    }
    else {
        let entry = document.createElement("div");
        entry.classList.add("historyEntry");
        
        entry.addEventListener("click", (event) => {
            setCurValDisplay(event.target.textContent);
        });

        entry.textContent = inputHistory.at(-1);
        document.querySelector("#original").appendChild(entry);
        historyDisplay.scrollTop = historyDisplay.scrollHeight;
    }
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
    }
    else {
        document.querySelector("#op_equals").textContent = "Enter";
    }
    setCurValDisplay("");
    clearHistory();
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
            //should check if there is an un-entered number in the display
            //Handling that will require some parsing here - ew!
            result = evaluateInput(inputHistory.at(-2), inputHistory.at(-1), c);
            
            historyParent.removeChild(historyParent.lastChild);
            historyParent.removeChild(historyParent.lastChild);
            inputHistory = inputHistory.slice(0, -2);
            
            inputHistory.push(result);
            updateHistoryDisplay();
        }
        else {
            result = evaluateInput(inputHistory.at(-1), c);
            
            historyParent.removeChild(historyParent.lastChild);
            inputHistory = inputHistory.slice(0, -1);
            inputHistory.push(result);
            updateHistoryDisplay();
        }

    }
}



function clearHistory() {
    inputHistory = [];
    outputHistory = [];
    document.querySelector("#original").replaceChildren();
    //Clearing these is unnecesarry for RPN mode
    document.querySelector("#equals").replaceChildren();
    document.querySelector("#result").replaceChildren();
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