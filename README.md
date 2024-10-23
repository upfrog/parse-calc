This is a not-completely-basic calculator webapp written in JavaScript. It uses a parse tree to correctly calculate complicated expressions.

Supported operations:
- Addition
- Subtraction
- Multiplication
- Division
- Exponentiation
- Grouping (parentheses)


TODO:
- [X] Clean up parse functions a bit
- [X] Build in-order traversal
- [X] Make that traversal evaluate the tree
- [X] Build some test cases with the current tree structure
- [X] Fix any bugs
- [X] Build starter GUI
- [ ] Deploy
- [X] More rigorous input validation
- [ ] Add new features!
   - [X] Record history
   - [ ] New operators
        - [ ] Sqrt
            - [ ] May want a custom way to display it - "sqrt()" is a bit lame
        - [ ]  Factorial
        - [ ]  Natural log
        - [ ]  e? (yes, e isn't really an operator)
        - [ ]  Trig functions (*maybe*)
            - [ ]  Keep an eye on degrees vs radians
        - [ ]  Absolute Value
        - [ ]  Some of these may be best handled by creating a new node type for unary 
            operators.
            - [ ]  For that matter, consider making a dedicated terminal node type
    - [ ]  Make sure you can handle floating point math reasonably
    - [ ]  RPN mode
        - [ ]  Will be best served with a new, stack-based backend, which should be
            much easier to implement
        - [ ]  Add highlighting to show which terms on the stack a given operation
            will effect!
    - [ ]  Multiple themes
- [ ]  Somewhere along the way, make a much better GUI
