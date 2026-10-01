import { describe, it, expect, mock, beforeEach, spyOn, afterEach } from 'bun:test';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { AiErrorBoundary } from './components/AiErrorBoundary';
import { ThemeProvider } from './lib/theme';

// Mock the Firebase sync (global app fetching) BEFORE importing the component
mock.module('./lib/firebaseSync', () => ({
  startAppsSync: mock(() => () => {}),
  startSettingsSync: mock(() => () => {}),
  saveAppToFirestore: mock(),
  deleteAppFromFirestore: mock(),
  saveSettingsToFirestore: mock(),
}));

// Provide a mock for IntersectionObserver which is often needed in jsdom/happy-dom
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

describe('Root Component Error State', () => {
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    localStorage.clear();
    // Suppress console.error during tests to keep output clean,
    // since we intentionally throw errors to test the Error Boundary.
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('displays error boundary UI when global app fetching throws an error', async () => {
    // Dynamically import App AFTER the mock is registered
    const { default: App } = await import('./App');

    // Mock the global app fetching to throw an error, simulating a failure
    const { startAppsSync } = await import('./lib/firebaseSync');
    (startAppsSync as import('bun:test').Mock<any>).mockImplementation(() => {
      throw new Error('Failed to initialize app');
    });

    await act(async () => {
      render(
        <AiErrorBoundary>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AiErrorBoundary>
      );
    });

    // Verify that the error boundary caught the error and rendered the fallback UI
    const errorHeading = await screen.findByText(/Card Load Me Dikkat Aayi/i);
    expect(errorHeading).toBeDefined();

    // Verify the specific error message is passed to the error state
    const errorMessage = await screen.findByText(/Failed to initialize app/i);
    expect(errorMessage).toBeDefined();
  });
});
