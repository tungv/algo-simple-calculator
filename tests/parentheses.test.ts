import { describe, test, expect } from "bun:test";
import calc from "..";

describe("parentheses", () => {
  test("addition before multiplication", () => {
    expect(calc("2 * (3 + 4)")).toBe(14);
  });

  test("multiple parentheses", () => {
    expect(calc("(2 + 3) * (4 + 5)")).toBe(45);
  });

  test("nested parentheses", () => {
    expect(calc("2 * (3 + (4 * 5))")).toBe(46);
  });

  test("nested with negative", () => {
    //   2 * (3 + -4) + 21 / ((3 * 3) - 2)
    // = 2 *    -1    + 21 / (  9     - 2)
    // = 2 *    -1    + 21 /    7
    // = -2           + 3
    // = 1
    expect(calc("2 * (3 + -4) + 21 / ((3 * 3) - 2)")).toBe(1);
  });
});
