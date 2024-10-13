//This is super messy

let curVal = document.querySelector("#currentValue");
console.log("made it here");


for (let i = 0; i < 10; i++) {
    let selector = "#num_" + i;
    let numBtn = document.querySelector(selector);
    numBtn.addEventListener("click", () => {
        appendChar(i);
    })
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


function appendChar(char) {
    curVal.textContent = curVal.textContent + char;
}

let equals = document.querySelector("#op_equals");
equals.addEventListener("click", () => {
    curVal.textContent = (evaluateInput(curVal.textContent));
})