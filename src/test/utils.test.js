import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuthenticated } from '../utils/auth.js';
import formatDate from '../utils/formatDate.js';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when no token is stored', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns true when a token is stored', () => {
    localStorage.setItem('userToken', 'some-token');
    expect(isAuthenticated()).toBe(true);
  });
});

describe('formatDate utility', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('formats a numeric timestamp correctly (fr-FR locale)', () => {
    // Use a known date: March 15, 2024
    const timestamp = new Date(2024, 2, 15).getTime();
    const result = formatDate(timestamp);
    expect(result).toContain('15');
    expect(result).toContain('03');
    expect(result).toContain('2024');
  });

  it('formats a date string correctly', () => {
    const dateStr = '2024-12-25T10:30:00Z';
    const result = formatDate(dateStr);
    expect(result).toContain('25');
    expect(result).toContain('12');
    expect(result).toContain('2024');
  });
});
