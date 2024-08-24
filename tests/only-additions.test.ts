import { describe, expect, test } from "bun:test";
import calc from "..";

describe("only additions", () => {
  test("1+1", () => {
    expect(calc("1+1")).toBe(2);
  });

  test("multiple operators", () => {
    expect(calc("1+2+3")).toBe(6);
  });

  test("multiple digits", () => {
    expect(calc("1000+2000+4000")).toBe(7000);
  });
});
