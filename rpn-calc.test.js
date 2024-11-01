const calc = require("./rpn-calc");

console.log("Made it to the test!");

describe("Basic function tests", () => {
    test("Test addition", () => {
        expect(calc("4", "2", "+")).toBe(6);
    });
})