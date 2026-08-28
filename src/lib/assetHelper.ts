/**
 * Safely resolves an asset or image URL for all environments
 * (Handles Local Dev, Root Domain, and Subpath Deployments like GitHub Pages /Yono-game/).
 */
export function resolveAssetUrl(url?: string): string {
  if (!url) return '';

  // If already absolute or embedded data URI
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Remove any leading slashes to prevent absolute domain root resolution on subpath hosts
  const cleanPath = url.replace(/^\/+/, '');

  // Vite injects import.meta.env.BASE_URL based on vite.config.ts base
  const base = ((import.meta as any).env?.BASE_URL as string) || './';

  if (base.endsWith('/')) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}
