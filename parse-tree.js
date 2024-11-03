const DECIMAL_PLACES = 8;
const prefixUnaryOperations = ["sqrt", "sin", "cos", "tan", "ln"];


/** 
 * Takes some set of calculator inputs, evaluates them, and returns the result.
 * 
 * This is the only part of parse-tree.js which should be called from outside.
 * 
 * Takes up to three parameters, with the quantity of parameters determining
 * whether the input should be evaluated infix (standard) or postfix (Reverse
 * Polish Notation - RPN).
 * 
 * @param {String} val1     One of at most two operands, or a complete 
 *                          mathematical expression.
 * @param {String} val2     The second of two operands, or a unary operator
 *                          to be applied to val1. Optional.
 * @param {String} op       A binary operator to be applied to val1 and val2. Optional.
 * @returns The result of the entered mathematical expression as a Number.
 */
function evaluateInput(val1, val2, op) {
    //If there is 1 argument, it's a string containing an expression
    try {
        if (arguments.length == 1) {
            let tokenized = tokenizeInput(val1);
            let parser = new Parser(tokenized);
            let root = parser.generateParseTree(tokenized);

            let result = root.evalTree();
            return roundResult(result);
        } 
        //If there are more arguments, then it was parsed by RPN mode
        else {
            if (val1 === "e") {
                val1 = Math.E;
            }
            val1 = parseFloat(val1); 
            if (arguments.length == 2) {
                //unary operator
                return roundResult(evalUnaryTerm(val1, val2))
            }
            else if (arguments.length == 3) {
                //binary operator
                if (val2 === "e") {
                    val2 = Math.E;
                }
                val2 = parseFloat(val2);
                return roundResult(evalBinaryTerm(val1, val2, op));
            }
            else {
                return NaN;
            }
        }
    }
    catch (Error) {
        return NaN;
    }
}

//RPN FUNCTIONS

function evalBinaryTerm(left, right, op) {
    switch (op) {
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
    return NaN;
}


function evalUnaryTerm(val, op) {
    switch (op) {
        case "!":
            return factorialize(val);
        case "sin":
            return Number(Math.sin(val).toFixed(DECIMAL_PLACES));
        case "cos":
            return Number(Math.cos(val).toFixed(DECIMAL_PLACES));
        case "tan":
            return Number(Math.tan(val).toFixed(DECIMAL_PLACES));
        case "sqrt":
            return Number(Math.sqrt(val).toFixed(DECIMAL_PLACES));
        case "ln":
            return Number(Math.log(val).toFixed(DECIMAL_PLACES));
    }
    return NaN;

}



/**
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
        else if (!isNaN((inArr[i])) || inArr[i] == ".") {
            let end = getNumEnd(inArr, i);
            tokens.push(inArr.slice(i, end).join(""))
            i = end;
        }
        else if (isSingleCharOpp(inArr[i])) {
            tokens.push(inArr[i]);
            ++i;
        }
        //I think this creates a vulnerability for just putting in "s", then ending input?
        //Also, these are messy, and should be condensed.


        //This seriously needs condensing!
        else if ((inArr.slice(i, i+4)).join("") == "sqrt") {
            tokens.push("sqrt");
            i += 4;
        }
        else if ((inArr.slice(i, i+3)).join("") == "sin") {
            tokens.push("sin");
            i += 3;
        }
        else if ((inArr.slice(i, i+3)).join("") == "cos") {
            tokens.push("cos");
            i += 3;
        }
        else if ((inArr.slice(i, i+3)).join("") == "tan") {
            tokens.push("tan");
            i += 3;
        }
        else if ((inArr.slice(i, i+2)).join("") == "ln") {
            tokens.push("ln");
            i += 2;
        }
        else if ((inArr[i] == "e")) {
            tokens.push("e");
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
    const singleCharOpps = ["+","-","*","^","/","!"];
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
        let node = this.parsePrefixUnary();
        while (this.curToken == "^" || this.curToken == "sqrt") {
            if (this.curToken == "^") {
                let operation = this.curToken;
                this.advanceToken();
                node = new Node(operation, node, this.parseMultDiv());
            }
        }
        return node;
    }

    parsePrefixUnary() {
        while (prefixUnaryOperations.includes(this.curToken)) {
            let operation = this.curToken;
            this.advanceToken();
            return new UniNode(operation, this.parsePrefixUnary());
        }
        return this.parseTerm();
    }

    parseTerm() {
        let node;

        if (this.curToken == "(") {
            this.advanceToken();
            node = this.generateParseTree();
            if (this.curToken == ")") {
                this.advanceToken();
            } 
            else {
                throw new Error("Mismatched parentheses");
            }
        } 
        else if (!(isNaN(parseFloat(this.curToken))) || this.curToken == "e") {
            node = new Node();
            node.val = this.curToken;
            this.advanceToken();
        }

        return this.parsePostfixUnary(node);
    }

    parsePostfixUnary(node) {
        while (this.curToken == "!") {
            let operation = this.curToken;
            this.advanceToken();
            node = new UniNode(operation, node);
        }
        return node;
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
        if (this.l && this.r) {
            let left = this.l.evalTree();
            let right = this.r.evalTree();
            return this.evalTerm(left, this.val, right);
        }
        else {
            if (this.val == "e") {
                return Math.E;
            }
            else {
                return Number(this.val);
            }
        }
    }

    evalTerm(left, operator, right) {
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
}

//Alternative node class for unary operators
class UniNode {
    constructor(val = null, child = null) {
        this.val = val;
        this.child = child;

        return this;
    }

    evalTree() {
        if (this.child) {
            let k = this.child.evalTree();
            return this.evalTerm(this.val, k);
        }
        else {
            throw new Error("Unary operator must have a target");
        }
    }

    evalTerm(operator, child) {
        switch (operator) {
            case "!":
                return factorialize(child);
            case "sin":
                return Number(Math.sin(child).toFixed(DECIMAL_PLACES));
            case "cos":
                return Number(Math.cos(child).toFixed(DECIMAL_PLACES));
            case "tan":
                return Number(Math.tan(child).toFixed(DECIMAL_PLACES));
            case "sqrt":
                return Number(Math.sqrt(child).toFixed(DECIMAL_PLACES));
            case "ln":
                return Number(Math.log(child).toFixed(DECIMAL_PLACES));
        }
    }
}

function factorialize(value) {
    if (value < 0) {
        return NaN;
    }
    else {
        let sum = 1;
        while (value > 0) {
            sum = sum * value;
            value--;
        }
        return sum;
    }
}

function roundResult(result) {
    if (String(result).includes(".")) {
        let resultStr = result.toFixed(DECIMAL_PLACES);
        let i = resultStr.length - 1;
        while (i > -1) {
            if (resultStr[i] != "0" && resultStr[i] != ".") {
                break;
            }
            --i;        
        }
        return parseFloat(resultStr.slice(0, i+1));
    }
    else {
        return result;
    }
}

module.exports = evaluateInput;