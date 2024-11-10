Hosted at http://parsecalcbucket.s3-website-us-east-1.amazonaws.com/ until I get some DNS issues ironed out.

This is a not-completely-basic calculator webapp written in JavaScript. It uses a parse tree to correctly calculate complicated expressions. It also includes a reverse Polish notation mode.

Supported operations:
- Addition
- Subtraction
- Multiplication
- Division
- Exponentiation
- Grouping (parentheses)
- Factorial
- Natural Log
- Basic trig functions

Other features:
- reverse Polish notation mode
- Operation history with click-to-recall functionality
- Keyboard support

TODO:
- [X] Clean up parse functions a bit
- [X] Build in-order traversal
- [X] Make that traversal evaluate the tree
- [X] Build some test cases with the current tree structure
- [X] Fix any bugs
- [X] Build starter GUI
- [X] Deploy
- [X] More rigorous input validation
- [X] Add new features!
   - [X] Record history
   - [X] New operators
        - [X] Sqrt
            - [ ] May want a custom way to display it - "sqrt()" is a bit lame
        - [X]  Factorial
        - [X]  Natural log
        - [X]  e? (yes, e isn't really an operator)
        - [X]  Trig functions (*maybe*)
            - [ ]  Keep an eye on degrees vs radians
        - [ ]  Absolute Value
        - [X]  Some of these may be best handled by creating a new node type for unary 
            operators.
            - [ ]  For that matter, consider making a dedicated terminal node type
    - [X]  Make sure you can handle floating point math reasonably
    - [X]  RPN mode
        - [X]  Will be best served with a new, stack-based backend, which should be
            much easier to implement
        - [X]  Add highlighting to show which terms on the stack a given operation
            will effect!
    - [ ]  Multiple themes
    - [X]  Be able to recall elements from history
- [ ]  Somewhere along the way, make a much better GUI
