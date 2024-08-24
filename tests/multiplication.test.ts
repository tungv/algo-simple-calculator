import { describe, test, expect } from "bun:test";
import calc from "..";

describe("multiplication", () => {
  test("3 * 2", () => {
    expect(calc("3*2")).toBe(6);
  });

  test("multiple operators", () => {
    expect(calc("7*2*3")).toBe(42);
  });

  test("multiple digits", () => {
    expect(calc("1000*2*4")).toBe(8000);
  });

  test("has spaces", () => {
    expect(calc("5 * 3")).toBe(15);
  });

  test("mixed operators", () => {
    expect(calc("1 * 3 + 2")).toBe(5);
  });

  test("precedence", () => {
    expect(calc("1 + 3 * 2")).toBe(7);
  });
});
