/// <reference lib="dom" />
import { expect, test, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce hook", () => {
  test("should return initial value", () => {
    const { result } = renderHook(() => useDebounce("test", 150));
    expect(result.current).toBe("test");
  });

  test("should debounce the value", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "test1", delay: 150 },
      }
    );

    expect(result.current).toBe("test1");

    // Update value
    rerender({ value: "test2", delay: 150 });

    // Value should not update immediately
    expect(result.current).toBe("test1");

    // Wait for 100ms
    await act(async () => {
      await Bun.sleep(100);
    });
    expect(result.current).toBe("test1");

    // Wait for another 100ms (total 200ms)
    await act(async () => {
      await Bun.sleep(100);
    });
    expect(result.current).toBe("test2");
  });

  test("should reset the timeout if value changes again before delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "test1", delay: 150 },
      }
    );

    expect(result.current).toBe("test1");

    // First change
    rerender({ value: "test2", delay: 150 });
    expect(result.current).toBe("test1");

    // Wait for 100ms
    await act(async () => {
      await Bun.sleep(100);
    });
    expect(result.current).toBe("test1");

    // Second change before the original 150ms timeout is reached
    rerender({ value: "test3", delay: 150 });

    // Wait for another 100ms (total 200ms since first change, but only 100ms since second)
    await act(async () => {
      await Bun.sleep(100);
    });
    expect(result.current).toBe("test1"); // Should still be test1 because the second change reset the timer

    // Wait another 100ms (total 200ms since second change)
    await act(async () => {
      await Bun.sleep(100);
    });
    expect(result.current).toBe("test3");
  });
});
