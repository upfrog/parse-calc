const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbolKeys = ["*", "/", "+", "-", "^", "(", ")", "."];
const curValDisplay = document.querySelector("#currentValue");
const historyDisplay = document.querySelector("#history");
let inputHistory = [];
let outputHistory = [];

let calc = document.querySelector(".controls");
document.addEventListener("keydown", (event) => {
    handleKeyPress(event);
})

calc.addEventListener("click", (event) => {
    handleButtonClick(event);
})

/*
historyDisplay.addEventListener("click", (event) => {
    console.log(event.target.children);
    if (event.target.classList.includes("historyEntry")) {
        alert(event.target.textContent);
    }    
})
*/

//I'd kind of like to condense this and handleKeyPress(), but it's fine as is.
function handleButtonClick(event) {

    let c = event.target.textContent;
    if (event.target.className != "button") {
        return;
    }
    else if (c == "=") {
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
        appendChar(event.target.textContent);
    }

}

function handleKeyPress(event) {
    event.preventDefault(); // Prevents default form submission or other browser actions
    if (event.key == "Enter") {
        processEnterKey();
    }
    else if (
        event.key == "Backspace" || 
        event.key == "Delete") {
        deleteChar();
    }
    else if (isValidKey(event.key)) {
        appendChar(event.key);
    }
}

function processEnterKey() {
    /*
    let result = evaluateInput(curVal.textContent);
    curVal.textContent = result;
    */
    let result = evaluateInput(curValDisplay.textContent);
    let cur = curValDisplay.textContent;
    inputHistory.push(cur);
    outputHistory.push(result);
    curValDisplay.textContent = result;
    updateHistoryDisplay();
    
}

//Adds the most recent operation to the history display
function updateHistoryDisplay() {
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

function clearHistory() {
    inputHistory = [];
    outputHistory = [];
    document.querySelector("#original").replaceChildren();
    document.querySelector("#equals").replaceChildren();
    document.querySelector("#result").replaceChildren();
}

