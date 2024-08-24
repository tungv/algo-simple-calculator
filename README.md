# Simple Calculator in TypeScript

this is an exercise to create a simple calculator in TypeScript that supports

1. Addition
2. Subtraction
3. Multiplication
4. Division
5. Parentheses

Example inputs:

```js
// two operands
calc("1 + 2"); // 3
calc("3 * 2"); // 6
calc("3 - 1"); // 2
calc("3 / 2"); // 1.5

// decimal numbers
calc("3.5 + 2.5"); // 6

// multiple operators
calc("11 + 222 + 3333 + 44444"); // 46810

// mixed precedence
calc("3 + 2 * 2"); // 7
calc("3 + 8/2"); // 7

// parentheses
calc("1 + 2 * (3 - 4)"); // -1

// nested parentheses
calc("2 * (3 + -4) + 21 / ((3 * 3) - 2)"); // 1
```

## How to run test

```bash
bun install
bun test
```

The result should look like this:

```bash
bun test v1.1.24 (85a32991)

tests/division.test.ts:
✓ division > 3 / 2 [0.13ms]
✓ division > multiple operators [0.17ms]
✓ division > multiple digits [0.01ms]
✓ division > has spaces [0.01ms]
✓ division > mixed operators
✓ division > precedence
✓ division > negative numbers

tests/multiplication.test.ts:
✓ multiplication > 3 * 2
✓ multiplication > multiple operators
✓ multiplication > multiple digits [0.02ms]
✓ multiplication > has spaces [0.01ms]
✓ multiplication > mixed operators [0.03ms]
✓ multiplication > precedence [0.03ms]
✓ multiplication > negative numbers [0.01ms]

tests/subtraction.test.ts:
✓ subtraction > 3 - 1
✓ subtraction > multiple operators [0.07ms]
✓ subtraction > multiple digits
✓ subtraction > has spaces [0.02ms]
✓ subtraction > negative result [0.01ms]
✓ subtraction > mixed operators [0.01ms]
✓ subtraction > negative numbers [0.01ms]

tests/parentheses.test.ts:
✓ parentheses > addition before multiplication [0.09ms]
✓ parentheses > multiple parentheses [0.03ms]
✓ parentheses > nested parentheses [0.02ms]
✓ parentheses > nested with negative [0.03ms]

tests/only-additions.test.ts:
✓ only additions > 1+1
✓ only additions > multiple operators [0.15ms]
✓ only additions > multiple digits [0.03ms]
✓ only additions > has spaces [0.01ms]
✓ only additions > decimal numbers [0.01ms]

 30 pass
 0 fail
 24 expect() calls
Ran 30 tests across 5 files. [21.00ms]
```

## The algorithm behind the calculator

Since this problem is similar to writing a parser, we will take common algorithm:

1. Tokenize the input string
2. Parse the tokens into an Abstract Syntax Tree (AST)
3. Evaluate the AST

### Tokenize

We will for-loop through the input string and create tokens for each character. We will have the following tokens:

1. Number
   Any sequence of digits and a single dot. We also want to look for negative numbers. Simplest way is to keep a flag to see if negative number is expected (at the beginning of the expression, after a closing parenthesis or when an operator is found).
   **TODO**: detect invalid numbers like `1.2.3`

2. Operator
   Any of the following: `+`, `-`, `*`, `/`

3. Parentheses
   Any of the following: `(`, `)`

For example, the input string `1 + 2 * (3 - 4)` will be tokenized into:

```
[1, +, 2, *, (, 3, -, 4, )]
```

and `2 * (3 + -4) + 21 / ((3 * 3) - 2)`

```
[2, *, (, 3, +, -4, ), +, 21, /, (, (, 3, *, 3, ), -, 2, )]
```

### Parse into AST

It is essential to use a binary tree to represent the expression since we can easily model the precedence of the operators.

There are many ways to parse the tokens into an AST. We will add the next node to the rightmost position of the tree.
There are 2 types of adding node.

1. **"Adding down"**: when we encounter an operator with the same of lower precedence than the current node,
   we will add it the the rightmost branch of the tree.

   ```

       1 + 2 * 3

       +      ->   +
     1   2       1   *
                   2   3

   ```

2. **"Adding up"**: when we encounter an operator with higher precedence, we will create a new root and add the current root the left.

   ```

       1 * 2 + 3

      *       ->        +
    1   2            *     3
                   1   2
   ```

For parentheses, we will recursively build sub-trees and replace the parentheses with the root of the sub-tree.

```
  a * (b + c)

      *                ->      *
  a   (parse(b + c))        a     +
                                b   c
```

### Evaluate the AST

This is the most straightforward part. We will recursively evaluate the tree by evaluating the left and right branches and applying the operator.

### End-to-end Example:

input: `"2 * (3 + -4) + 21 / ((3 * 3) - 2)"`

tokens: `[2, *, (, 3, +, -4, ), +, 21, /, (, (, 3, *, 3, ), -, 2, )]`

AST:

```js
{
  type: "binary",
  left: {
    type: "binary",
    left: {
      type: "number",
      value: 2,
    },
    operator: "*",
    right: {
      type: "binary",
      left: {
        type: "number",
        value: 3,
      },
      operator: "+",
      right: {
        type: "number",
        value: -4,
      },
    },
  },
  operator: "+",
  right: {
    type: "binary",
    left: {
      type: "number",
      value: 21,
    },
    operator: "/",
    right: {
      type: "binary",
      left: {
        type: "binary",
        left: {
          type: "number",
          value: 3,
        },
        operator: "*",
        right: {
          type: "number",
          value: 3,
        },
      },
      operator: "-",
      right: {
        type: "number",
        value: 2,
      },
    },
  },
}
```
