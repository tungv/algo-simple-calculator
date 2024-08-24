import type { BinaryNode } from "./buildTree";

export default function validateRoot(
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
