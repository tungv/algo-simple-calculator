import { describe, test, expect } from "bun:test";
import calc from "..";

describe("division", () => {
  test("3 / 2", () => {
    expect(calc("3/2")).toBeCloseTo(1.5);
  });

  test("multiple operators", () => {
    expect(calc("7/2/3")).toBeCloseTo(1.1666666666666667);
  });

  test("multiple digits", () => {
    expect(calc("1000/2/4")).toBeCloseTo(125);
  });

  test("has spaces", () => {
    expect(calc("5 / 3")).toBeCloseTo(1.6666666666666667);
  });

  test("mixed operators", () => {
    expect(calc("1 / 3 + 2")).toBeCloseTo(2.333333333333333);
  });

  test("precedence", () => {
    expect(calc("1 + 3 / 2")).toBeCloseTo(2.5);
  });

  test("negative numbers", () => {
    expect(calc("3 / -3")).toBeCloseTo(-1);
  });
});
