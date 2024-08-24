export default function calc(expression: string): number {
  const tokens = [];

  let currentToken = "";

  for (let i = 0; i < expression.length; ++i) {
    const char = expression[i];

    switch (char) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        currentToken += char;
        break;

      case "+":
        tokens.push({
          type: "number",
          value: currentToken,
        });
        tokens.push({
          type: "operator",
          value: "+",
        });
        currentToken = "";
        break;
    }
  }

  // Push the last token
  tokens.push({
    type: "number",
    value: currentToken,
  });

  let currentNode = null as Partial<BinaryNode> | null;

  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];

    if (currentNode === null) {
      // looking for a number
      if (token.type === "number") {
        const value = Number.parseInt(token.value, 10);
        currentNode = {
          type: "binary",
          left: {
            type: "number",
            value: value,
          },
        };
      }
    } else {
      // looking for an operator
      if (token.type === "operator") {
        // if it already has an operator, it's invalid
        if (currentNode.operator !== undefined) {
          throw new Error("Invalid expression");
        }

        if (currentNode.left === undefined) {
          throw new Error("Invalid expression");
        }

        currentNode.operator = token.value;
      }

      // looking for a number to complete the binary node
      if (token.type === "number") {
        currentNode.right = {
          type: "number",
          value: Number.parseInt(token.value, 10),
        };

        // this should be complete
        validateBinaryNode(currentNode);

        // if this is the last token, we're done
        if (i === tokens.length - 1) {
          break;
        }

        // move on
        currentNode = {
          type: "binary",
          left: currentNode as BinaryNode,
        };
      }
    }
  }

  if (currentNode === null) {
    throw new Error("Invalid expression");
  }

  // console.log(currentNode);

  return getValue(currentNode as BinaryNode);
}

function validateBinaryNode(
  node: Partial<BinaryNode>,
): asserts node is BinaryNode {
  if (typeof node !== "object") {
    throw new Error("Invalid node");
  }

  if (node === null) {
    throw new Error("Invalid node");
  }

  if (node.type !== "binary") {
    throw new Error("Invalid node");
  }

  if (node.left === undefined) {
    throw new Error("Invalid node");
  }

  if (node.right === undefined) {
    throw new Error("Invalid node");
  }

  if (node.operator === undefined) {
    throw new Error("Invalid node");
  }
}

function getValue(node: BinaryNode | LeaveNode): number {
  if (node.type === "number") {
    return node.value;
  }

  if (node.type === "binary") {
    switch (node.operator) {
      case "+":
        return getValue(node.left) + getValue(node.right);

      default:
        throw new Error("Invalid operator");
    }
  }

  return 0;
}

interface LeaveNode {
  type: "number";
  value: number;
}

interface BinaryNode {
  type: "binary";
  left: BinaryNode | LeaveNode;
  operator: string;
  right: BinaryNode | LeaveNode;
}
