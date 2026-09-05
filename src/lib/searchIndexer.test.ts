import { describe, test, expect } from 'bun:test';
import { cleanContinuous } from './searchIndexer';

describe('cleanContinuous', () => {
  test('handles null, undefined, and empty string', () => {
    expect(cleanContinuous(null)).toBe('');
    expect(cleanContinuous(undefined)).toBe('');
    expect(cleanContinuous('')).toBe('');
  });

  test('converts text to lowercase', () => {
    expect(cleanContinuous('HELLO')).toBe('hello');
    expect(cleanContinuous('MixEd')).toBe('mixed');
  });

  test('removes spaces', () => {
    expect(cleanContinuous('bet 213')).toBe('bet213');
    expect(cleanContinuous('  spaces around  ')).toBe('spacesaround');
    expect(cleanContinuous('multiple   spaces')).toBe('multiplespaces');
  });

  test('removes standard punctuation and symbols', () => {
    expect(cleanContinuous('Yono-Games')).toBe('yonogames');
    expect(cleanContinuous('test_string.123')).toBe('teststring123');
    expect(cleanContinuous('a:b,c/d(e)f')).toBe('abcdef');
  });

  test('removes emojis and currency signs', () => {
    expect(cleanContinuous('win#★🔥🎰⚡🚀👑💰🎁🃏✨')).toBe('win');
    expect(cleanContinuous('₹$€¥+')).toBe('');
  });

  test('handles complex combinations', () => {
    expect(cleanContinuous('★ BET 213 🔥')).toBe('bet213');
    expect(cleanContinuous('  #Yono-Games (100% ₹) + 💰 ')).toBe('yonogames100%');
    expect(cleanContinuous('https://example.com/yono-777?id=123')).toBe('httpsexamplecomyono777?id=123'); // Note: '?', '=', '%' are not in the regex, so they remain.
  });
});
