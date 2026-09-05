import { describe, test, expect, beforeEach, afterEach, setSystemTime } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Configure happy-dom to not load or evaluate external scripts
GlobalRegistrator.register({
    settings: {
        disableJavaScriptFileLoading: true,
        disableJavaScriptEvaluation: true,
        disableCSSFileLoading: true,
        disableIframePageLoading: true
    }
});

import { ensureGapiScriptLoaded } from "../googlePicker";

describe("ensureGapiScriptLoaded", () => {
  // Suppress "NotSupportedError: Failed to load script" logs from happy-dom during tests
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Reset global state
    delete (globalThis as any).window.gapi;
    document.head.innerHTML = "";

    // Stub console.error to ignore the specific error happy-dom throws when appending script
    console.error = (err) => {
      if (err?.name === "NotSupportedError" || (err?.message && err.message.includes("Failed to load script"))) {
         return;
      }
      originalConsoleError(err);
    };
  });

  afterEach(() => {
    setSystemTime(); // Reset to real time
    console.error = originalConsoleError;
  });

  test("resolves immediately if window.gapi is already defined", async () => {
    (globalThis as any).window.gapi = {};
    await expect(ensureGapiScriptLoaded()).resolves.toBeUndefined();
    expect(document.head.querySelector("script")).toBeNull();
  });

  test("injects script if not present and resolves when window.gapi becomes defined", async () => {
    const promise = ensureGapiScriptLoaded();

    const script = document.head.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.src).toBe("https://apis.google.com/js/api.js");
    expect(script?.async).toBe(true);
    expect(script?.defer).toBe(true);

    // Simulate script loading by setting window.gapi after a short delay
    setTimeout(() => {
      (globalThis as any).window.gapi = {};
    }, 50);

    await expect(promise).resolves.toBeUndefined();
  });

  test("does not inject multiple scripts if one already exists", async () => {
    const existingScript = document.createElement("script");
    existingScript.src = "https://apis.google.com/js/api.js";
    try {
      document.head.appendChild(existingScript);
    } catch(e) {} // happy-dom might throw

    const promise = ensureGapiScriptLoaded();

    const scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(1);

    setTimeout(() => {
      (globalThis as any).window.gapi = {};
    }, 50);

    await expect(promise).resolves.toBeUndefined();
  });

  test("rejects if script fails to load within timeout", async () => {
    let mockTime = Date.now();
    setSystemTime(new Date(mockTime));

    const promise = ensureGapiScriptLoaded();

    // Simulate time passing beyond the 10000ms threshold
    setTimeout(() => {
       mockTime += 10001; // Jump ahead in time
       setSystemTime(new Date(mockTime));
    }, 50);

    await expect(promise).rejects.toThrow('Failed to load Google API script (gapi)');
  });
});
