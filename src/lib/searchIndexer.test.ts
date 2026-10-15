import { expect, describe, test } from "bun:test";
import { levenshtein } from "./searchIndexer";

describe("levenshtein", () => {
  test("returns 0 for exact match", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
    expect(levenshtein("", "")).toBe(0);
  });

  test("handles empty strings", () => {
    expect(levenshtein("", "test")).toBe(4);
    expect(levenshtein("test", "")).toBe(4);
  });

  test("calculates single character substitution", () => {
    expect(levenshtein("test", "tent")).toBe(1);
    expect(levenshtein("cat", "bat")).toBe(1);
  });

  test("calculates single character insertion", () => {
    expect(levenshtein("test", "tests")).toBe(1);
    expect(levenshtein("cat", "cart")).toBe(1);
  });

  test("calculates single character deletion", () => {
    expect(levenshtein("tests", "test")).toBe(1);
    expect(levenshtein("cart", "cat")).toBe(1);
  });

  test("handles case sensitivity", () => {
    expect(levenshtein("Test", "test")).toBe(1);
    expect(levenshtein("A", "a")).toBe(1);
  });

  test("calculates distance for multiple edits", () => {
    // "kitten" to "sitten" (sub k->s)
    // "sitten" to "sittin" (sub e->i)
    // "sittin" to "sitting" (insert g)
    // Total = 3
    expect(levenshtein("kitten", "sitting")).toBe(3);

    // "flaw" to "lawn" (delete f, insert n)
    // Total = 2
    expect(levenshtein("flaw", "lawn")).toBe(2);
  });

  test("calculates transposition as two substitutions", () => {
    // standard Levenshtein counts transposition as 2 ops (sub + sub or delete + insert)
    expect(levenshtein("ab", "ba")).toBe(2);
  });
});
