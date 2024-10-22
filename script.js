//This is super messy

const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbolKeys = ["*", "/", "+", "-", "^", "(", ")"];
const curVal = document.querySelector("#currentValue");

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
    if (c == "=") {
        processEnterKey();
    }
    else if (c == "C") {
        curVal.textContent = "";
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
    else if (isValidKey(event.key)) {
        appendChar(event.key);
    }
}

function processEnterKey() {
    let result = evaluateInput(curVal.textContent);
    curVal.textContent = result;
}

//Expects a string, usually a single character
function appendChar(char) {
    curVal.textContent = curVal.textContent + char;
}

function isValidKey(key) {
    return numberKeys.includes(key) || symbolKeys.includes(key);
}