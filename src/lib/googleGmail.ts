// Google Gmail API Integration Utility

import { ensureGsiLoaded } from './googleContacts';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  unread?: boolean;
  labelIds?: string[];
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyHtml?: string;
  bodyText?: string;
}

const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly'
].join(' ');

let cachedGmailToken: string | null = null;
let gmailTokenClient: any = null;

/**
 * Check if Gmail token is currently active
 */
export function hasActiveGmailSession(): boolean {
  return !!cachedGmailToken;
}

/**
 * Clear cached Gmail token
 */
export function disconnectGmailSession(): void {
  cachedGmailToken = null;
  gmailTokenClient = null;
}

/**
 * Request OAuth Access Token for Gmail using Google Identity Services (GIS)
 */
export async function requestGmailAccessToken(clientId?: string): Promise<string> {
  if (cachedGmailToken) {
    return cachedGmailToken;
  }

  await ensureGsiLoaded();

  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return reject(new Error('Google Identity Services script is not available.'));
    }

    const effectiveClientId = clientId || '876596116902-abcdef.apps.googleusercontent.com';

    gmailTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: effectiveClientId,
      scope: GMAIL_SCOPES,
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error || 'Failed to authenticate with Gmail'));
        } else {
          cachedGmailToken = response.access_token;
          resolve(response.access_token);
        }
      },
    });

    gmailTokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * Fetch list of messages from Gmail
 */
export async function listGmailMessages(
  query: string = '',
  maxResults: number = 20,
  labelIds: string[] = ['INBOX']
): Promise<GmailMessageSummary[]> {
  const token = await requestGmailAccessToken();

  let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }
  if (labelIds && labelIds.length > 0 && !query) {
    url += `&labelIds=${labelIds.join(',')}`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedGmailToken = null;
    }
    throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawList: { id: string; threadId: string }[] = data.messages || [];

  // Fetch metadata headers for each message concurrently
  const details = await Promise.all(
    rawList.slice(0, maxResults).map(async (msg) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!msgRes.ok) return { id: msg.id, threadId: msg.threadId };
        const msgData = await msgRes.json();

        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
        const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
        const unread = msgData.labelIds?.includes('UNREAD');

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: msgData.snippet,
          subject,
          from,
          to,
          date,
          unread,
          labelIds: msgData.labelIds || []
        };
      } catch (err) {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return details;
}

/**
 * Fetch full details of a specific message
 */
export async function getGmailMessage(messageId: string): Promise<GmailMessageDetail> {
  const token = await requestGmailAccessToken();

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load message: ${response.statusText}`);
  }

  const data = await response.json();
  const headers = data.payload?.headers || [];
  const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
  const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
  const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
  const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

  // Parse body text and HTML
  let bodyHtml = '';
  let bodyText = '';

  const parseParts = (part: any) => {
    if (!part) return;
    if (part.mimeType === 'text/plain' && part.body?.data) {
      bodyText = decodeBase64Url(part.body.data);
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      bodyHtml = decodeBase64Url(part.body.data);
    }
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(parseParts);
    }
  };

  if (data.payload) {
    if (data.payload.body?.data) {
      if (data.payload.mimeType === 'text/html') {
        bodyHtml = decodeBase64Url(data.payload.body.data);
      } else {
        bodyText = decodeBase64Url(data.payload.body.data);
      }
    }
    if (data.payload.parts) {
      data.payload.parts.forEach(parseParts);
    }
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    subject,
    from,
    to,
    date,
    unread: data.labelIds?.includes('UNREAD'),
    labelIds: data.labelIds || [],
    bodyHtml: bodyHtml || undefined,
    bodyText: bodyText || data.snippet || ''
  };
}

/**
 * Send an Email via Gmail API (Requires Explicit User Confirmation)
 */
export async function sendGmailEmail(options: {
  to: string;
  subject: string;
  messageText: string;
  cc?: string;
  bcc?: string;
}): Promise<any> {
  const token = await requestGmailAccessToken();

  // Create RFC 2822 standard email format
  const lines = [
    `To: ${options.to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(options.subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    options.messageText
  ];

  if (options.cc) {
    lines.splice(1, 0, `Cc: ${options.cc}`);
  }
  if (options.bcc) {
    lines.splice(1, 0, `Bcc: ${options.bcc}`);
  }

  const rawMessage = lines.join('\r\n');
  const base64Encoded = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: base64Encoded })
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Trash a Gmail Message (Requires Confirmation)
 */
export async function trashGmailMessage(messageId: string): Promise<boolean> {
  const token = await requestGmailAccessToken();
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Failed to trash message: ${response.statusText}`);
  }

  return true;
}

/**
 * Helper to decode base64url encoded string from Gmail API
 */
function decodeBase64Url(base64Url: string): string {
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    try {
      return atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      return '';
    }
  }
}
