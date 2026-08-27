// Google Contacts (People API) Integration Utility

export interface GoogleContact {
  resourceName: string;
  etag: string;
  name: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  company?: string;
}

const CONTACT_SCOPES = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/user.phonenumbers.read',
  'https://www.googleapis.com/auth/contacts.other.readonly'
].join(' ');

let cachedContactsToken: string | null = null;
let tokenClient: any = null;

/**
 * Ensure Google Identity Services (GIS) script is loaded and ready
 */
export function ensureGsiLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      return resolve();
    }
    
    // Inject script if missing
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > 10000) {
        clearInterval(interval);
        reject(new Error('Google Identity Services script failed to initialize. Please check your network connection.'));
      }
    }, 150);
  });
}

/**
 * Check if contacts token is currently cached/active
 */
export function hasActiveContactsSession(): boolean {
  return !!cachedContactsToken;
}

/**
 * Clear cached contacts token
 */
export function disconnectContactsSession(): void {
  cachedContactsToken = null;
  tokenClient = null;
}

/**
 * Request OAuth Access Token for Google Contacts using Google Identity Services (GIS)
 */
export async function requestContactsAccessToken(clientId?: string): Promise<string> {
  if (cachedContactsToken) {
    return cachedContactsToken;
  }

  await ensureGsiLoaded();

  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return reject(new Error('Google Identity Services script is not available.'));
    }

    const effectiveClientId = clientId || '876596116902-abcdef.apps.googleusercontent.com';

    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: effectiveClientId,
      scope: CONTACT_SCOPES,
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error || 'Failed to authenticate with Google'));
        } else {
          cachedContactsToken = response.access_token;
          resolve(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * Fetch contacts list from Google People API
 */
export async function getGoogleContacts(pageSize: number = 100): Promise<{ contacts: GoogleContact[]; totalPeople: number }> {
  try {
    const token = await requestContactsAccessToken();
    const response = await fetch(
      `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos,organizations&pageSize=${pageSize}&sortOrder=FIRST_NAME_ASCENDING`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        cachedContactsToken = null;
      }
      throw new Error(`Google People API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const connections = data.connections || [];

    const contacts: GoogleContact[] = connections.map((person: any) => {
      const primaryName = person.names?.[0];
      const primaryEmail = person.emailAddresses?.[0]?.value;
      const primaryPhone = person.phoneNumbers?.[0]?.value;
      const photoUrl = person.photos?.[0]?.url;
      const company = person.organizations?.[0]?.name;

      return {
        resourceName: person.resourceName,
        etag: person.etag,
        name: primaryName?.displayName || primaryName?.givenName || 'Unnamed Contact',
        givenName: primaryName?.givenName,
        familyName: primaryName?.familyName,
        email: primaryEmail,
        phone: primaryPhone,
        photoUrl: photoUrl,
        company: company,
      };
    });

    return {
      contacts,
      totalPeople: data.totalPeople || contacts.length,
    };
  } catch (error) {
    console.error('Failed to get Google Contacts:', error);
    throw error;
  }
}

/**
 * Add a new contact to Google Contacts (User Confirmation Required)
 */
export async function createGoogleContact(contact: {
  givenName: string;
  familyName?: string;
  email?: string;
  phone?: string;
}): Promise<GoogleContact> {
  const token = await requestContactsAccessToken();

  const body: any = {
    names: [
      {
        givenName: contact.givenName,
        familyName: contact.familyName || '',
      }
    ],
  };

  if (contact.email) {
    body.emailAddresses = [{ value: contact.email, type: 'home' }];
  }
  if (contact.phone) {
    body.phoneNumbers = [{ value: contact.phone, type: 'mobile' }];
  }

  const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    resourceName: data.resourceName,
    etag: data.etag,
    name: data.names?.[0]?.displayName || contact.givenName,
    givenName: contact.givenName,
    familyName: contact.familyName,
    email: contact.email,
    phone: contact.phone,
    photoUrl: data.photos?.[0]?.url,
  };
}

/**
 * Delete a contact from Google Contacts (Requires Explicit Confirmation)
 */
export async function deleteGoogleContact(resourceName: string): Promise<boolean> {
  const token = await requestContactsAccessToken();
  const response = await fetch(`https://people.googleapis.com/v1/${resourceName}:deleteContact`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }

  return true;
}
