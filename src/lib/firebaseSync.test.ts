import { expect, test, mock, describe, beforeEach, afterEach, spyOn } from 'bun:test';
import { startSettingsSync } from './firebaseSync';

const mockOnSnapshot = mock(() => () => {});

mock.module('firebase/app', () => ({
  initializeApp: mock(() => ({})),
}));

mock.module('firebase/firestore', () => ({
  getFirestore: mock(() => ({})),
  collection: mock(() => ({})),
  doc: mock(() => ({})),
  onSnapshot: mockOnSnapshot,
  setDoc: mock(() => Promise.resolve()),
  deleteDoc: mock(() => Promise.resolve()),
}));

mock.module('../../firebase-applet-config.json', () => ({
  default: { firestoreDatabaseId: 'test-db' }
}));

describe('startSettingsSync', () => {
  let originalSetTimeout: typeof globalThis.setTimeout;
  let consoleWarnSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mockOnSnapshot.mockClear();
    originalSetTimeout = globalThis.setTimeout;
    consoleWarnSpy = spyOn(console, 'warn').mockImplementation(() => {});

    // Override setTimeout to run immediately and return a dummy timer ID
    globalThis.setTimeout = ((cb: (...args: any[]) => void) => {
      cb();
      return 1 as unknown as NodeJS.Timeout;
    }) as any;
  });

  afterEach(() => {
    globalThis.setTimeout = originalSetTimeout;
    consoleWarnSpy.mockRestore();
  });

  test('calls onError when onSnapshot triggers an error', async () => {
    const errorMsg = 'Mock Firebase Error';
    const mockError = new Error(errorMsg);

    // Set up the mock onSnapshot to immediately call the error callback (3rd argument)
    mockOnSnapshot.mockImplementation((ref: any, onNext: any, onError: any) => {
      if (onError) {
        onError(mockError);
      }
      return () => {}; // return unsubscribe function
    });

    const onErrorSpy = mock(() => {});
    const onSettingsUpdatedSpy = mock(() => {});

    // Call the function
    const unsubscribe = startSettingsSync(onSettingsUpdatedSpy, onErrorSpy);

    // Because getFirebaseInstances uses async imports, we need to wait a tick
    // for the promises to resolve and the onSnapshot callback to be invoked.
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);

    expect(mockOnSnapshot).toHaveBeenCalled();
    expect(onErrorSpy).toHaveBeenCalled();
    expect(onErrorSpy).toHaveBeenCalledWith(mockError);
    expect(onSettingsUpdatedSpy).not.toHaveBeenCalled();

    unsubscribe();
  });
});
