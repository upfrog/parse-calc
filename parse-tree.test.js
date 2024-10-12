const calc = require("./parse-tree");

describe("Basic function tests", () => {
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

    test("Test subtraction to below 0", () => {
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
});

describe("Edge cases", () => {
    test("Exponentiation with base zero returns zero", () => {
        expect(calc("0^5")).toBe(0);
    });

    test("Division by zero throws error", () => {
        expect(() => calc("4/0")).toThrow("Cannot divide by zero");
    });
    
    test("Positive single number input returns input", () => {
        expect(calc("42")).toBe(42);
    });
    
    test("Negative single number input returns input", () => {
        expect(calc("-42")).toBe(-42);
    });

    test("Zero divided by integer returns zero", () => {
        expect(calc("0/4")).toBe(0);
    });
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
    test("Order of operations without parentheses", () => {
        expect(calc("2+3*4")).toBe(14);
    });

    test("Order of operations with parentheses", () => {
        expect(calc("(2+3)*4")).toBe(20);
    });

    test("Parentheses with addition and multiplication", () => {
        expect(calc("(2+3)*4")).toBe(20);
    });
    
    test("Nested parentheses evaluate correctly", () => {
        expect(calc("((2+3)*2)")).toBe(10);
    });

    test("Complex expression with multiple operations", () => {
        expect(calc("3+5*2-8/4")).toBe(11);
    });
})






















