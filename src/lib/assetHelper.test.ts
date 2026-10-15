import { describe, expect, it, afterEach } from 'bun:test';
import { resolveAssetUrl } from './assetHelper';

describe('resolveAssetUrl', () => {
  const originalBaseUrl = process.env.BASE_URL;

  afterEach(() => {
    process.env.BASE_URL = originalBaseUrl;
  });

  it('handles empty inputs', () => {
    expect(resolveAssetUrl()).toBe('');
    expect(resolveAssetUrl('')).toBe('');
  });

  it('leaves absolute HTTP/HTTPS URLs untouched', () => {
    expect(resolveAssetUrl('http://example.com/image.png')).toBe('http://example.com/image.png');
    expect(resolveAssetUrl('https://example.com/image.png')).toBe('https://example.com/image.png');
  });

  it('leaves data and blob URIs untouched', () => {
    expect(resolveAssetUrl('data:image/png;base64,iVBORw0KGgo...')).toBe('data:image/png;base64,iVBORw0KGgo...');
    expect(resolveAssetUrl('blob:http://localhost/1234-5678')).toBe('blob:http://localhost/1234-5678');
  });

  it('resolves relative paths with default base URL (./)', () => {
    delete process.env.BASE_URL;
    expect(resolveAssetUrl('image.png')).toBe('./image.png');
    expect(resolveAssetUrl('/image.png')).toBe('./image.png'); // strips leading slash
    expect(resolveAssetUrl('///image.png')).toBe('./image.png');
  });

  it('resolves relative paths with custom BASE_URL that ends with slash', () => {
    process.env.BASE_URL = '/app/';
    expect(resolveAssetUrl('image.png')).toBe('/app/image.png');
    expect(resolveAssetUrl('/image.png')).toBe('/app/image.png');
  });

  it('resolves relative paths with custom BASE_URL that does not end with slash', () => {
    process.env.BASE_URL = '/app';
    expect(resolveAssetUrl('image.png')).toBe('/app/image.png');
    expect(resolveAssetUrl('/image.png')).toBe('/app/image.png');
  });
});
