/*

*/

/*
Commented out because I'll be using it later for adding new features.
function main() {
    let tokens = []

    tokens = tokenizeInput("3^(5+2/1)");
    tokens = tokenizeInput("2^3^4^5");
    tokens = tokenizeInput("2^(1+1)");

    let p = new Parser(tokens);
    console.log(p);
    let root = p.generateParseTree(tokens);

    console.log(root);
    console.log(root.r);
    console.log("=======================")
    console.log("=======================")
    console.log(root.evalTree());



}
*/

function evaluateInput(input) {
    try {
        let tokenized = tokenizeInput(input);
        let parser = new Parser(tokenized);
        let root = parser.generateParseTree(tokenized);
        
        try {
            return root.evalTree();
        } catch (Error) {
            return NaN;
        }
    } catch (Error) {
        return NaN;
    }
    
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
        else if (inArr[i] == "-" && (i == 0 || inArr[i-1] == "(")) {
            let end = getNumEnd(inArr, i+1);
            tokens.push(inArr.slice(i, end).join(""))
            i = end;
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
        else {
            throw new Error("Invalid input");
        }
    }
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
    
    /**
     * This is more to help me get this clear in my head.
     * 
     * These functions work by pushing precedence down.
     * 
     * What do I mean by that? This builds a tree, which will later be evaluated.
     * It will generally be evaluated by combining a root node, and it's two branches. In
     * order to evaluate such an expression, both of the child nodes must be constants. If
     * they are instead operators, then we need to traverse that side of the tree until we
     * can turn it into a constant. This means that operations which are buried deeper in
     * the tree are evaluated first; earlier nodes may be traversed over, but the operation
     * they serve as input to cannot be evaluated yet.
     *  
     * This is why each function first tries to parse the next-highest level of precedence.
     * The expression is entered with parseAddSub(), which will keep on looping until there
     * is a non + - operation, or until the expression is over. If there is a non + - 
     * operation, then the next level of precedence is called, and that will continue until
     * the appropriate level is found. That level will then loop if needed, and then ascend
     * to a higher level.
     * 
     * Key to this is that each function can 1) repeat it's own operation indefinitely, 2)
     * go to a higher level of precedence, and 3) be returned to by a lower level of
     * precedence.
     * 
     * The right node is always generated by parsing the next layer of precedence up, and
     * that parsing has to complete before the current level can be finished. If, in the
     * process of parsing to generate a right node, the program finds something of lower
     * precedence, it will not parse it. Instead it will return up the call stack (which
     * is down the chain of precedence) until it reaches the appropriate function.
     * 
     * 
     */

    parseAddSub() {
        let node = this.parseMultDiv();
        while (this.curToken == "+" || this.curToken == "-") {
            let operation = this.curToken;
            this.advanceToken();
            node = new Node(operation, node, this.parseMultDiv());
        }
        return node;
    }

    parseMultDiv() {
        let node = this.parseExp();
        while (this.curToken == "*" || this.curToken == "/") {
            let operation = this.curToken;
            this.advanceToken();
            node = new Node(operation, node, this.parseMultDiv());
        }
        return node;
    }

    parseExp() {
        let node = this.parseTerm();
        while (this.curToken == "^") {
            let operation = this.curToken;
            this.advanceToken();
            node = new Node(operation, node, this.parseMultDiv());
        }
        return node;
    }

    parseTerm() {
        if (this.curToken == "(") {
            this.advanceToken();
            let node = this.generateParseTree();
            if (this.curToken == ")") {
                this.advanceToken();
            } 
            else {
                throw new Error("Mismatched parentheses");
            }
            return node;
        } 
        else if (!(isNaN(parseInt(this.curToken)))) {
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

    evalTree() {
        //It seems that FOR NOW every node has either 2 or 0 children... Is this true?
        if (this.l && this.r) {
            let left = this.l.evalTree();
            let right = this.r.evalTree();
            return evalTerm(left, this.val, right);
        }
        else {
            return Number(this.val);
        }
    }
}

function evalTerm(left, operator, right) {
    switch (operator) {
        case "+":
            return (left + right);
        case "-": 
            return (left - right);
        case "*":
            return (left * right);
        case "/":
            if (right == 0) {
                throw new Error("Cannot divide by zero");
            }
            return (left / right);
        case "^":
            return (left ** right);
    }
}


//class 

module.exports = evaluateInput;