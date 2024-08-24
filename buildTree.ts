import type { Token } from "./tokenize";

export interface LeafNode {
  type: "number";
  value: number;
}

interface IncompleteBinaryNode {
  type: "binary";
  left?: IncompleteBinaryNode | LeafNode;
  operator?: string;
  right?: IncompleteBinaryNode | LeafNode;
}

// validate the root node
function validateRoot(node: IncompleteBinaryNode): asserts node is BinaryNode {
  try {
    if (typeof node !== "object") {
      throw new Error("Invalid node. Expected object");
    }

    if (node === null) {
      throw new Error("Invalid node. Expected non-null");
    }

    if (node.type !== "binary") {
      throw new Error("Invalid node. Expected binary node");
    }

    if (node.left === undefined) {
      throw new Error("Invalid node. Expected left node");
    }

    if (node.right === undefined) {
      throw new Error("Invalid node. Expected right node");
    }

    if (node.operator === undefined) {
      throw new Error("Invalid node. Expected operator");
    }
  } catch (ex) {
    console.log("failed to validate node", node);
    throw ex;
  }
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
 *
 *    1 + 2 * 3
 *
 *    +      ->   +
 *  1   2       1   *
 *                2   3
 **/
function addDown(
  tree: IncompleteBinaryNode,
  operator: string,
): IncompleteBinaryNode {
  let parentOfTheRightmostNode = tree;
  let rightmostNode = tree.right;

  while (rightmostNode && rightmostNode.type === "binary") {
    parentOfTheRightmostNode = rightmostNode;
    rightmostNode = rightmostNode.right;
  }

  if (!rightmostNode) {
    parentOfTheRightmostNode.operator = operator;
    return parentOfTheRightmostNode;
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
function addUp(
  tree: IncompleteBinaryNode,
  operator: string,
): IncompleteBinaryNode {
  if (!tree.operator) {
    tree.operator = operator;
    return tree;
  }

  validateRoot(tree);

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

export default function buildTree(tokens: Token[]): BinaryNode {
  const { root, i } = buildSubTree(tokens, 0, "");

  if (i !== tokens.length - 1) {
    throw new Error("Invalid expression");
  }

  validateRoot(root);

  return root;
}

function buildSubTree(tokens: Token[], start: number, endWhen: string) {
  // console.log(
  //   "sub tree tokens",
  //   tokens.slice(start).map((t) => t.value),
  // );
  let incompleteRoot: IncompleteBinaryNode = {
    type: "binary",
  };

  let currentPrecedence = 0;
  let currentIncompleteNode: IncompleteBinaryNode = incompleteRoot;
  let pendingReRoot = false;

  // walk from the 4th token to the end
  for (let i = start; i < tokens.length; ++i) {
    const token = tokens[i];

    if (token.type === "parenthesis" && token.value === endWhen) {
      return { root: incompleteRoot, i };
    }

    switch (token.type) {
      case "operator": {
        const operator = token.value;
        const precedence = getPrecedence(operator);

        if (precedence > currentPrecedence) {
          // add down
          currentIncompleteNode = addDown(incompleteRoot, operator);
        } else {
          // add up
          currentIncompleteNode = addUp(incompleteRoot, operator);
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

        if (!currentIncompleteNode.left) {
          currentIncompleteNode.left = leaf;
          continue;
        }

        currentIncompleteNode.right = leaf;
        if (pendingReRoot) {
          incompleteRoot = currentIncompleteNode as BinaryNode;
          pendingReRoot = false;
        }
        break;
      }

      case "parenthesis": {
        if (token.value === "(") {
          const { root: subRoot, i: newI } = buildSubTree(tokens, i + 1, ")");
          i = newI;

          // console.log(
          //   "the rest",
          //   tokens.slice(i).map((t) => t.value),
          // );

          if (!currentIncompleteNode.left) {
            currentIncompleteNode.left = subRoot;
          } else {
            currentIncompleteNode.right = subRoot;
          }
        }
        break;
      }

      default:
        throw new Error("Invalid token");
    }
  }

  validateRoot(incompleteRoot);

  return { root: incompleteRoot, i: tokens.length - 1 };
}
