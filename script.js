//This is super messy

const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbolKeys = ["*", "/", "+", "-", "^", "(", ")"];
const curValDisplay = document.querySelector("#currentValue");
const historyDisplay = document.querySelector("#history");
let history = [];

let calc = document.querySelector(".controls");
calc.addEventListener("keydown", (event) => {
    handleKeyPress(event);
})

calc.addEventListener("click", (event) => {
    handleButtonClick(event);
})

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
        event.key == "Delete" ||
        event.code == "NumpadDecimal") {
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
    history.push(cur);
    curValDisplay.textContent = result;
    updateHistoryDisplay();
    
}


function updateHistoryDisplay() {
    console.log(history);
    historyDisplay.replaceChildren();
    for (let i in history) {
        let historyEntry = document.createElement("div");
        historyEntry.setAttribute("class", "historyElement");
        
        //Have result on same line
        //historyEntry.textContent = history[i] + " = " + curValDisplay.textContent;
        //historyEntry.appendChild(document.createElement("br"));

        //Have result on next line
        historyEntry.textContent = history[i];
        historyEntry.appendChild(document.createElement("br"));
        
        let resultEntry = document.createElement("div");
        resultEntry.setAttribute("class", "historyElement");
        resultEntry.textContent = curValDisplay.textContent;
        resultEntry.appendChild(document.createElement("br"));
        
        historyDisplay.appendChild(historyEntry);
        historyDisplay.appendChild(resultEntry);
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


