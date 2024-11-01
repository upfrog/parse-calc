/**
 * 
 * TODO:
 * 1) More rigorous testing
 * 2) This shares a lot of code with parse-tree.js. Try to make that more 
 * elegant.
 * 3) Actually integrate it with the front end!
 */

const DECIMAL_PLACES = 8;



function main() {
    console.log(evaluateInput(4,"sin"));
}


/**
 * 
 * Input could be handled in one of several ways.
 * 
 * It could be handled as in parse-tree, with an unbroken
 * string of calculations.
 * 
 * Alternatively, I could leverage the constraints of RPN
 * to hand off a better-defined set of operators and operands.
 * 
 * The custom set by parse-tree is that the backend handles
 * all parsing, which would suggest that I should follow
 * that custom here. But the natural dividing lines are not
 * the same now that I'm thinking in RPN. Replicating a bunch
 * of my work from parse-tree would defeat part of the point
 * of RPN; it's stack-based simplicity.
 * 
 * Currently: expects 2-3 inputs, the last of which will be
 * an operator.
 * 
 * @param {*} input 
 * @returns 
 */
function evaluateInput(val1, val2, op) {
    val1 = parseFloat(val1);
    try {
        if (arguments.length == 2) {
            //unary operator
            return roundResult(evalUnaryTerm(val1, val2))

        }
        else if (arguments.length == 3) {
            //binary operator
            val2 = parseFloat(val2);

            return roundResult(evalBinaryTerm(val1, val2, op));

        }
        else {
            return NaN;
        }
    } catch (Error) {
        return NaN;
    }    
}




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


main();
module.exports = evaluateInput;