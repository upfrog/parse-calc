
function main() {
    let tokens = []
    
    //test
    tokens = tokenizeInput("34 + 555 * (2.699998 - 8) ^ 2 / 4");
    tokens = tokenizeInput("44+82");
}


/**
 * 
 * Should I have a separate tokenization step, or should I parse the raw input?
 * 
 * I think I should separate them. The downside is that tokenization may be of limited use. It will
 *  be important for numbers, where many digits may only relate to a single number data type, but 
 * it may be less important for other forms of input, which will mean that in many cases the 
 * tokenization brings no benefit.
 * 
 * However, it will also give me a seperate place for input validation, and it will help cover me
 * for the future. I haven't decided exactly what operations to support, but in the long run, 
 * separating tokenization into it's own function, and having the parse function focus on, well,
 * parsing will probably make the code more expandable.
 * 
 * 
 * 
 * What do I need to tokenize and combine?
 *  -numbers (multi-digit, negative)
 *  -numbers (imaginary?)
 *  -numbers (e)??
 *  -exponents
 * 
 * 
 * 
 * 
 * @param {*} input 
 * @param {*} tokens 
 * @param {*} input_i 
 * @param {*} tokens_i 
 */
function tokenizeInput(input) {

    let inArr = [...input];
    let tokens = [];

    let i = 0;

    while (i < inArr.length) {
        if (inArr[i] == " ") {
            ++i;
        }
        else if (inArr[i] == "(" || inArr[i] == ")") {
            tokens.push(inArr[i]);
            ++i;
        }
        else if (!isNaN((inArr[i]))) {
            let end = getNumEnd(inArr, i);
            tokens.push(inArr.slice(i, end).join(""))
            i = end;
        }
        else if (isSingleCharOpp(inArr[i])) {
            tokens.push(inArr[i]);
            ++i;
        }
    }

    //For debugging
    console.log(tokens);
    console.log(tokens.join(""));

}

function getNumEnd(input, i) {
    while (i < input.length && (!isNaN(parseInt(input[i]))) || input[i] == "." ) {
        ++i;
    }
    return i;
}

function isSingleCharOpp(elem) {
    const singleCharOpps = ["+","-","*","^","/"];
    return singleCharOpps.includes(elem);
}

function parseEquation(tree) {

}

class parseTree {
    constructor(val = null, l = null, r = null) {
        this.val = val;
        this.l = l;
        this.r = r;
    }


}

main();