
function main() {
    let tokens = []
    
    //test
    tokens = tokenizeInput("34 + 555 * (2.699998 - 8) + 2 / 4");
    //tokens = tokenizeInput("44+82");

    let p = new Parser(tokens);
    console.log(p);
    let root = p.generateParseTree(tokens);

    console.log(root);
    console.log(root.r);
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
    return tokens;

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






class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.curPos = 0;
        this.curToken = this.tokens != null ? this.tokens[this.curPos] : null;
    }

    advanceToken() {
        this.curPos++;
        if (this.curPos < this.tokens.length) {
            this.curToken = this.tokens[this.curPos];
        }
        else {
            this.curToken = null;
        }
        
    }
    
    generateParseTree() {
        let node = this.parseAddSub();
        return node;
    }
    
    
    
    parseAddSub() {
        let node = this.parseMultDiv();

        if (this.curToken == "+" || this.curToken == "-") {
            let opperator = this.curToken;
            this.advanceToken();

            let rightNode = this.parseMultDiv();

            let newNode = new Node(opperator, node, rightNode);
            node = newNode;
        }

        return node;
    }
    
    parseMultDiv() {
        let node = this.parseValParen();

        if (this.curToken == "*" || this.curToken == "\\") {
            let operation = this.curToken;
            this.advanceToken();

            let rightNode = this.parseValParen();

            node = new Node(operation, node, rightNode);
        }
        return node;
    }
    
    parseValParen() {
        if (this.curToken == "(") {
            this.advanceToken();
            let node = this.generateParseTree();
            if (this.curToken == ")") {
                this.advanceToken();
                return node; //maybe declare the node at the top level?
            }
            else {
                return null;
            }
        }
        else {
            let node = new Node();
            node.val = this.curToken;
            this.advanceToken();
            return node;
        }
    }

}



class Node {
    constructor(val = null, l = null, r = null) {
        this.val = val;
        this.l = l;
        this.r = r;

        return this;
    }
    

}

main();