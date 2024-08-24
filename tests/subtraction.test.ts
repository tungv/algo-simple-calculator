import { describe, test, expect } from "bun:test";
import calc from "..";
describe("subtraction", () => {
  test("3 - 1", () => {
    expect(calc("3-1")).toBe(2);
  });

  test("multiple operators", () => {
    expect(calc("7-2-1")).toBe(4);
  });

  test("multiple digits", () => {
    expect(calc("1000-200-400")).toBe(400);
  });

  test("has spaces", () => {
    expect(calc("5 - 3")).toBe(2);
  });

  test("negative result", () => {
    expect(calc("1 - 3")).toBe(-2);
  });

  test("mixed operators", () => {
    expect(calc("1 - 3 + 2")).toBe(0);
  });

  test("negative numbers", () => {
    expect(calc("-1 - 3")).toBe(-4);
  });
});
