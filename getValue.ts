import type { BinaryNode, LeafNode } from "./buildTree";

export default function getValue(node: BinaryNode | LeafNode): number {
  if (node.type === "number") {
    return node.value;
  }

  if (node.type === "binary") {
    switch (node.operator) {
      case "+":
        return getValue(node.left) + getValue(node.right);

      case "-":
        return getValue(node.left) - getValue(node.right);

      case "*":
        return getValue(node.left) * getValue(node.right);

      case "/":
        return getValue(node.left) / getValue(node.right);

      default:
        throw new Error("Invalid operator");
    }
  }

  return 0;
}
