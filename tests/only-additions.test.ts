import { describe, expect, test } from "bun:test";
import calc from "..";

describe("only additions", () => {
  test("1+1", () => {
    expect(calc("1+1")).toBe(2);
  });
});
