import { test, expect, mock } from "bun:test";

mock.module("firebase/app", () => ({
  initializeApp: () => ({}),
}));

const mockOnSnapshot = mock((col, onNext, onError) => {
  // immediately call onError
  onError(new Error("Test Firebase Error"));
  return () => {};
});

mock.module("firebase/firestore", () => ({
  getFirestore: () => ({}),
  collection: () => ({}),
  doc: () => ({}),
  onSnapshot: mockOnSnapshot,
  setDoc: () => {},
  deleteDoc: () => {},
}));

test("startAppsSync calls onError when onSnapshot throws or returns error", async () => {
  // We must import dynamically AFTER the mock modules are defined because bun:test
  // does not hoist mock.module declarations.
  const { startAppsSync } = await import("./firebaseSync");

  // Use fake timers to avoid slow testing for the 1200ms setTimeout
  const originalSetTimeout = global.setTimeout;
  let timerCallback: Function | null = null;
  global.setTimeout = ((fn: Function, ms: number) => {
    timerCallback = fn;
    return 1 as any;
  }) as any;

  let errorReceived: Error | null = null;
  const onError = (e: any) => {
    errorReceived = e;
  };

  startAppsSync(() => {}, onError);

  // Execute the deferred callback immediately
  if (timerCallback) {
    await timerCallback();
  }

  expect(mockOnSnapshot).toHaveBeenCalled();
  expect(errorReceived).not.toBeNull();
  expect(errorReceived?.message).toBe("Test Firebase Error");

  // Restore global setTimeout
  global.setTimeout = originalSetTimeout;
});
