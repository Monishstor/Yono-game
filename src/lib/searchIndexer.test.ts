import { describe, it, expect } from 'bun:test';
import { normalizeText } from './searchIndexer';

describe('normalizeText', () => {
  it('returns an empty string for null, undefined, or empty string', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
    expect(normalizeText('')).toBe('');
  });

  it('converts text to lowercase', () => {
    expect(normalizeText('Hello World')).toBe('hello world');
    expect(normalizeText('ALL CAPS')).toBe('all caps');
  });

  it('trims leading and trailing spaces', () => {
    expect(normalizeText('  spaces before and after  ')).toBe('spaces before and after');
  });

  it('reduces multiple spaces to a single space', () => {
    expect(normalizeText('too   many    spaces')).toBe('too many spaces');
  });

  it('replaces special characters and emojis with spaces', () => {
    const specialChars = '₹$€¥,.:;!?\'"()[]{}|/\\#*★🔥🎰⚡🚀👑💰🎁🃏✨+_-';
    // When passed through replace, each char becomes a space, then multiple spaces become one space, and then it's trimmed
    // So the result should be empty if it's only special characters
    expect(normalizeText(specialChars)).toBe('');

    // Mix with text
    expect(normalizeText('Win ₹500! 🔥')).toBe('win 500');
    expect(normalizeText('Play (Rummy) - Fast withdrawal')).toBe('play rummy fast withdrawal');
  });

  it('handles a complex combination of uppercase, special characters, and multiple spaces', () => {
    expect(normalizeText('  ★ PLAY now!  Win ₹1,000💰   FAST-withdrawal \n ')).toBe('play now win 1 000 fast withdrawal');
  });
});
