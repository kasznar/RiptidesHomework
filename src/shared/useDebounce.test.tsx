import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce"; // Adjust the import path as needed
import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("should return the initial value immediately", () => {
    const initialValue = "test";
    const { result } = renderHook(() => useDebounce(initialValue, 500));

    expect(result.current).toBe(initialValue);
  });

  test("should not update the value before the delay has passed", () => {
    const initialValue = "test";
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 500 } },
    );

    rerender({ value: "updated value", delay: 500 });
    expect(result.current).toBe(initialValue);

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe(initialValue);
  });

  test("should update the value after the delay has passed", () => {
    const initialValue = "test";
    const updatedValue = "updated value";
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 500 } },
    );

    rerender({ value: updatedValue, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(updatedValue);
  });

  test("should handle multiple rapid value changes", () => {
    const initialValue = "test";
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 500 } },
    );

    rerender({ value: "change 1", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "change 2", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "final change", delay: 500 });
    expect(result.current).toBe(initialValue);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("final change");
  });

  test("should use default delay when not specified", () => {
    const initialValue = "test";
    const updatedValue = "updated value";
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: initialValue },
    });

    rerender({ value: updatedValue });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe(initialValue);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(updatedValue);
  });

  test("should handle delay changes", () => {
    const initialValue = "test";
    const updatedValue = "updated value";
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialValue, delay: 500 } },
    );

    rerender({ value: updatedValue, delay: 800 });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current).toBe(initialValue);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(updatedValue);
  });

  test("should handle different value types", () => {
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 123, delay: 500 } },
    );

    numberRerender({ value: 456, delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(numberResult.current).toBe(456);

    const initialObj = { name: "John", age: 30 };
    const updatedObj = { name: "Jane", age: 25 };

    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 500 } },
    );

    objectRerender({ value: updatedObj, delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(objectResult.current).toEqual(updatedObj);
  });

  test("should clear timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

    const { unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 500 } },
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
