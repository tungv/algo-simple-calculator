import type { Token } from "./tokenize";

export interface LeafNode {
  type: "number";
  value: number;
}

interface IncompleteBinaryNode {
  type: "binary";
  left: BinaryNode | LeafNode;
  operator?: string;
  right?: IncompleteBinaryNode | LeafNode;
}

export interface BinaryNode {
  type: "binary";
  left: BinaryNode | LeafNode;
  operator: string;
  right: BinaryNode | LeafNode;
}

/* add a new node to the right of tree and return the tree and the new node
 * when we have a new operation that is higher or equal precedence than the current operation
 * we will always add it the rightmost node and replace the right node with a binary node
 * assumption: the rightmost node is always a leaf node
 *
 *    1 + 2 * 3
 *
 *    +      ->   +
 *  1   2       1   *
 *                2   3
 **/
function addDown(tree: BinaryNode, operator: string): IncompleteBinaryNode {
  let parentOfTheRightmostNode = tree;
  let rightmostNode = tree.right;

  while (rightmostNode.type === "binary") {
    parentOfTheRightmostNode = rightmostNode;
    rightmostNode = rightmostNode.right;
  }

  // replace the rightmost node with a binary node
  const newRight: IncompleteBinaryNode = {
    type: "binary",
    left: rightmostNode,
    operator: operator,
  };

  (parentOfTheRightmostNode as IncompleteBinaryNode).right = newRight;

  return newRight;
}

/* add a new node the right of the tree and return the new tree
 * when we have a new operation that is lower precedence than the current operation
 * we will always make a new root and assign the current tree to its left node
 *
 *
 *   1 * 2 + 3
 *
 *   *       ->        +
 * 1   2            *     3
 *                1   2
 */
function addUp(tree: BinaryNode, operator: string): IncompleteBinaryNode {
  return {
    type: "binary",
    left: tree,
    operator: operator,
  };
}

function getPrecedence(operator: string): number {
  switch (operator) {
    case "+":
    case "-":
      return 1;

    case "*":
    case "/":
      return 2;

    default:
      throw new Error("Invalid operator");
  }
}

export default function buildTree(tokens: Token[]) {
  // take the first 3 tokens and create a binary node
  const [n1, op, n2] = tokens;

  let root: BinaryNode = {
    type: "binary",
    left: {
      type: "number",
      value: Number.parseFloat(n1.value),
    },
    operator: op.value,
    right: {
      type: "number",
      value: Number.parseFloat(n2.value),
    },
  };

  let currentPrecedence = getPrecedence(op.value);
  let currentIncompleteNode: IncompleteBinaryNode = root;
  let pendingReRoot = false;

  // walk from the 4th token to the end
  for (let i = 3; i < tokens.length; ++i) {
    const token = tokens[i];

    switch (token.type) {
      case "operator": {
        const operator = token.value;
        const precedence = getPrecedence(operator);

        if (precedence > currentPrecedence) {
          // add down
          currentIncompleteNode = addDown(root, operator);
        } else {
          // add up
          currentIncompleteNode = addUp(root, operator);
          pendingReRoot = true;
        }
        currentPrecedence = precedence;
        break;
      }

      case "number": {
        const leaf: LeafNode = {
          type: "number",
          value: Number.parseFloat(token.value),
        };

        currentIncompleteNode.right = leaf;
        if (pendingReRoot) {
          root = currentIncompleteNode as BinaryNode;
          pendingReRoot = false;
        }
        break;
      }

      default:
        throw new Error("Invalid token");
    }
  }

  return root;
}
