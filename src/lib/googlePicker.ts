// Google Picker and Drive Integration Utility

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
].join(' ');

let tokenClient: any = null;
let accessToken: string | null = null;

export interface PickedGoogleFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
}

/**
 * Load Google API Client script library for Picker
 */
export function loadGooglePickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.gapi !== 'undefined' && window.gapi.load) {
      window.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Failed to load Google Picker API'))
      });
    } else {
      // Retry loading after brief wait
      const interval = setInterval(() => {
        if (typeof window.gapi !== 'undefined' && window.gapi.load) {
          clearInterval(interval);
          window.gapi.load('picker', {
            callback: () => resolve(),
            onerror: () => reject(new Error('Failed to load Google Picker API'))
          });
        }
      }, 300);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Timeout loading gapi'));
      }, 6000);
    }
  });
}

/**
 * Obtain Google OAuth Access Token using Google Identity Services (GIS)
 */
export function requestGoogleAccessToken(clientId?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (accessToken) {
      return resolve(accessToken);
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return reject(new Error('Google Identity Services script not loaded.'));
    }

    const effectiveClientId = clientId || '876596116902-abcdef.apps.googleusercontent.com';

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: effectiveClientId,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.error) {
          reject(response);
        } else {
          accessToken = response.access_token;
          resolve(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * List or search files directly from Google Drive REST API
 */
export async function listGoogleDriveFiles(query: string = "trashed = false", pageSize: number = 20): Promise<any[]> {
  try {
    const token = await requestGoogleAccessToken();
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=${pageSize}&fields=files(id,name,mimeType,webContentLink,webViewLink,thumbnailLink,size)`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Google Drive API responded with status ${response.status}`);
    }
    const data = await response.json();
    return data.files || [];
  } catch (err) {
    console.error('Failed to list Google Drive files:', err);
    throw err;
  }
}

/**
 * Open the Google Picker dialog to select APKs, images, or files from Google Drive
 */
export async function openGoogleFilePicker(options?: {
  clientId?: string;
  apiKey?: string;
  title?: string;
  mimeTypes?: string;
}): Promise<PickedGoogleFile | null> {
  try {
    await loadGooglePickerApi();
    const token = await requestGoogleAccessToken(options?.clientId);

    return new Promise((resolve) => {
      if (!window.google || !window.google.picker) {
        throw new Error('Google Picker API not ready');
      }

      const view = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false);

      if (options?.mimeTypes) {
        view.setMimeTypes(options.mimeTypes);
      }

      const pickerBuilder = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(token)
        .addView(view)
        .setTitle(options?.title || 'Select APK or Icon from Google Drive')
        .setCallback((data: any) => {
          if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            resolve({
              id: doc.id,
              name: doc.name,
              url: doc.url,
              mimeType: doc.mimeType,
              sizeBytes: doc.sizeBytes
            });
          } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
            resolve(null);
          }
        });

      if (options?.apiKey) {
        pickerBuilder.setDeveloperKey(options.apiKey);
      }

      const picker = pickerBuilder.build();
      picker.setVisible(true);
    });
  } catch (error) {
    console.error('Google Picker error:', error);
    throw error;
  }
}
