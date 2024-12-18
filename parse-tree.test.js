const calc = require("./parse-tree");

describe("Test binary operators", () => {
    test("Test addition", () => {
        expect(calc("4+2")).toBe(6);
    });

    test("Test subtraction", () => {
        expect(calc("4-2")).toBe(2);
    });

    test("Test multiplication", () => {
        expect(calc("4*2")).toBe(8);
    });

    test("Test division", () => {
        expect(calc("4/2")).toBe(2);
    });

    test("Test that subtraction to below 0 returns a negative number", () => {
        expect(calc("3-6")).toBe(-3);
    });

    test("Test parenthesis", () => {
        expect(calc("4*(1+1)")).toBe(8);
    });

    test("Test exponentiation with positive integers", () => {
        expect(calc("2^3")).toBe(8);
    });

    test("Test expression with large numbers", () => {
        expect(calc("1000000*1000")).toBe(1000000000);
    });

    test("Test that e can be added", () => {
        expect(calc("e+2")).toBe(Number((Math.E + 2).toFixed(8)));
    })
});

describe("Test unary prefix functions", () => {
    test("Test square root", () => {
        expect(calc("sqrt(9)")).toBe(3);
    })

    test("Test sin", () => {
        expect(calc("sin(9)")).toBe(Number(Math.sin(9).toFixed(8)));
    })

    test("Test cos", () => {
        expect(calc("cos(9)")).toBe(Number(Math.cos(9).toFixed(8)));
    })

    test("Test tan", () => {
        expect(calc("tan(9)")).toBe(Number(Math.tan(9).toFixed(8)));
    })

    test("Test that ln(e) is 1", () => {
        expect(calc("ln(e)")).toBe(1);
    })

    test("Test that successive operators evaluate correctly", () => {
        expect(calc("sqrtsqrt81")).toBe(3);
    })
});

describe("Test unary postfix functions", () => {
    test("Test factorial", () => {
        expect(calc("3!")).toBe(6);
    })

    test("Test factorial of 1", () => {
        expect(calc("1!")).toBe(1);
    })

    test("Test factorial of 0", () => {
        expect(calc("0!")).toBe(1);
    })

    test("Test stacked factorials", () => {
        expect(calc("3!!")).toBe(720);
    })

    test("Test factorial mixed with other operations", () => {
        expect(calc("3!+3^2")).toBe(15);
    })
});

describe("Edge cases", () => {
    test("Exponentiation with base zero returns zero", () => {
        expect(calc("0^5")).toBe(0);
    });

    test("Division by zero returns NaN", () => {
        //expect(() => calc("4/0")).toThrow("Cannot divide by zero");
        expect(calc("4/0")).toBe(NaN);
    });
    
    test("Positive single number input returns input", () => {
        expect(calc("42")).toBe(42);
    });
    
    test("Negative single number input returns input", () => {
        expect(calc("-42")).toBe(-42);
    });

    test("Negative single number in parentheses input returns input", () => {
        expect(calc("(-42)")).toBe(-42);
    });

    test("Zero divided by integer returns zero", () => {
        expect(calc("0/4")).toBe(0);
    });

    test("Numbers starting with decimal are rejected", () => {
        expect(calc("250.47/.65521")).toBe(382.27438531)
    })

});

describe("Test negativity interactions", () => {
    test("Multiplication of positive and negative returns negative", () => {
        expect(calc("-4*5")).toBe(-20);
    });

    test("Multiplication of two negatives returns positive", () => {
        expect(calc("-4*(-5)")).toBe(20);
    });

    test("Negative number to odd power returns negative", () => {
        expect(calc("-2^3")).toBe(-8);
    });
    
    test("Negative number to even power returns positive", () => {
        expect(calc("-2^2")).toBe(4);
    });
});

describe("Test order of operations", () => {
    test("Order of operations without parentheses evaluates correctly", () => {
        expect(calc("2+3*4")).toBe(14);
    });

    test("Order of operations with parentheses evaluates correctly", () => {
        expect(calc("(2+3)*4")).toBe(20);
    });

    test("Parentheses with addition and multiplication evaluates correctly", () => {
        expect(calc("(2+3)*4")).toBe(20);
    });
    
    test("Nested parentheses evaluate correctly", () => {
        expect(calc("(5-((2+3)*2))")).toBe(-5);
    });

    test("Complex expression with multiple operations evaluates correctly", () => {
        expect(calc("3+5*2-8/4")).toBe(11);
    });

    test("Exponentiation is right associative", () => {
        expect(calc("2^2^3")).toBe(256);
    });

    test("Factorial stacks with itself", () => {
        expect(calc("3!!")).toBe(720);
    });

    test("Factorial fits into order of operations", () => {
        expect(calc("3!^2")).toBe(36);
    });
})

describe("Test handling of improper input", () => {
    test("Rejects operator without numbers", () => {
        expect(calc("+")).toBe(NaN);
    });

    test("Rejects binary operator with no second operand", () => {
        expect(calc("1+")).toBe(NaN);
    });

    test("Rejects binary operator with no first operand", () => {
        expect(calc("+1")).toBe(NaN);
    });

    test("Rejects meaningless operator spam", () => {
        expect(calc("^+\\\)")).toBe(NaN);
    });

    test("Ignores white space", () => {
        expect(calc("7         *(3^ 2  )")).toBe(63);
    });

    test("Input with invalid characters returns NaN", () => {
        expect(calc("Three rings for the Elven kings")).toBe(NaN);
    });

    test("Input with some invalid characters returns NaN", () => {
        expect(calc("Three+5")).toBe(NaN);
    });

    test("Negative factorial returns NaN", () => {
        expect(calc("(-3)!")).toBe(NaN);
    })

    test("Factorial without proper operand returns NaN", () => {
        expect(calc(")!")).toBe(NaN);
    })
})


describe("Test binary operators in RPN", () => {

    test("Test addition", () => {
        expect(calc("4", "2", "+")).toBe(6);
    });

    test("Test subtraction", () => {
        expect(calc("4", "2", "-")).toBe(2);
    });

    test("Test multiplication", () => {
        expect(calc("4", "2", "*")).toBe(8);
    });

    test("Test division", () => {
        expect(calc("4", "2", "/")).toBe(2);
    });

    test("Test that subtraction to below 0 returns a negative number", () => {
        expect(calc("2", "4", "-")).toBe(-2);
    });

    test("Test exponentiation with positive integers", () => {
        expect(calc("2", "3", "^")).toBe(8);
    });

});

describe("Test unary operators in RPN", () => {
    test("Test square root", () => {
        expect(calc("9", "sqrt")).toBe(3);
    })

    test("Test sin", () => {
        expect(calc("9", "sin")).toBe(Number(Math.sin(9).toFixed(8)));
    })

    test("Test cos", () => {
        expect(calc("9", "cos")).toBe(Number(Math.cos(9).toFixed(8)));
    })

    test("Test tan", () => {
        expect(calc("9", "tan")).toBe(Number(Math.tan(9).toFixed(8)));
    })

    test("Test factorial", () => {
        expect(calc("3", "!")).toBe(6);
    })

    test("Test natural log", () => {
        expect(calc("e", "ln")).toBe(1);
    })
});

describe("Test handling of improper input in RPN", () => {
    test("Rejects operator without numbers", () => {
        expect(calc("+", "+")).toBe(NaN);
    });

    test("Rejects binary operator with no second operand", () => {
        expect(calc("1", "+")).toBe(NaN);
    });

    test("Rejects operator with no first operand", () => {
        expect(calc("+", "1")).toBe(NaN);
    });

    test("Rejects meaningless operator spam", () => {
        expect(calc("^+\\", "\*")).toBe(NaN);
    });

    test("Ignores white space", () => {
        expect(calc("7     ", "     5", "+")).toBe(12);
    });

    test("Input with invalid characters returns NaN", () => {
        expect(calc("Three rings for", "the Elven kings", "+")).toBe(NaN);
    });

    test("Input with some invalid characters returns NaN", () => {
        expect(calc("Three", "5", "+")).toBe(NaN);
    });

    test("Negative factorial returns NaN", () => {
        expect(calc("-3", "!")).toBe(NaN);
    })
})



















