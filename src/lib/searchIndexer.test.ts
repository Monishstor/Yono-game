import { expect, test, describe } from "bun:test";
import { tokenize } from "./searchIndexer";

describe("tokenize", () => {
  test("returns an empty array for null, undefined, or empty string", () => {
    expect(tokenize(null)).toEqual([]);
    expect(tokenize(undefined)).toEqual([]);
    expect(tokenize("")).toEqual([]);
  });

  test("tokenizes a simple string", () => {
    expect(tokenize("hello world")).toEqual(["hello", "world"]);
  });

  test("removes duplicate words", () => {
    expect(tokenize("hello world hello")).toEqual(["hello", "world"]);
  });

  test("handles multiple spaces and trims properly", () => {
    expect(tokenize("  hello   world  ")).toEqual(["hello", "world"]);
  });

  test("handles special characters and punctuation", () => {
    expect(tokenize("hello, world! This is a test...")).toEqual(["hello", "world", "this", "is", "a", "test"]);
  });

  test("is case-insensitive", () => {
    expect(tokenize("Hello WORLD HeLLo")).toEqual(["hello", "world"]);
  });
});
