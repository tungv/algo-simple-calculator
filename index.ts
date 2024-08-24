import buildTree, { type BinaryNode, type LeafNode } from "./buildTree";
import getValue from "./getValue";
import tokenize from "./tokenize";

export default function calc(expression: string): number {
  const tokens = tokenize(expression);

  // if there's only one token, it's a number
  if (tokens.length === 1) {
    return Number.parseInt(tokens[0].value, 10);
  }

  // if there are 2 tokens, it's invalid
  if (tokens.length === 2) {
    throw new Error("Invalid expression");
  }

  const root = buildTree(tokens);
  return getValue(root);
}
