//This is super messy

let curVal = document.querySelector("#currentValue");
console.log("made it here");



//This is way too many event listeners. Bubble up!
for (let i = 0; i < 10; i++) {
    let selector = "#num_" + i;
    let numBtn = document.querySelector(selector);4
    numBtn.addEventListener("click", () => {
        appendChar(i);
    });
}


let add = document.querySelector("#op_plus");
add.addEventListener("click", () => {
    appendChar("+");
});



let minus = document.querySelector("#op_minus");
minus.addEventListener("click", () => {
    appendChar("-");
});

let mult = document.querySelector("#op_mult");
mult.addEventListener("click", () => {
    appendChar("*");
});

let div = document.querySelector("#op_div");
div.addEventListener("click", () => {
    appendChar(`/`);
});


let clear = document.querySelector("#op_clear");
clear.addEventListener("click", () => {
    curVal.textContent = "";
})

let exp = document.querySelector("#op_exp");
exp.addEventListener("click", () => {
    appendChar("^");
});

let openParen = document.querySelector("#misc_openParen");
openParen.addEventListener("click", () => {
    appendChar("(");
})

let closeParen = document.querySelector("#misc_closeParen");
closeParen.addEventListener("click", () => {
    appendChar(")");
})




let equals = document.querySelector("#op_equals");
equals.addEventListener("click", () => {
    curVal.textContent = (evaluateInput(curVal.textContent));
})




let calc = document.querySelector(".controls");
calc.addEventListener("keydown", (event) => {
    if (isValidKey(event.key)) {
        appendChar(event.key);
    }
})



function appendChar(char) {
    curVal.textContent = curVal.textContent + char;
}


//This not only checks validity, but also handles Enter. Split it up!
function isValidKey(key) {
    const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const symbolKeys = ["*", "/", "+", "-", "^", "(", ")"];


    if (numberKeys.includes(key) || symbolKeys.includes(key)) {
        return true;
    }
    else if (key == "Enter"){
        curVal.textContent = (evaluateInput(curVal.textContent));
        return false;

    }
    else {
        console.log(key);
        return false;
    }
}
