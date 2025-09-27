import {describe, expect, it} from 'vitest';
import {formatNumber, formatNumberCompact, formatPercent} from './number';

describe('Format - Number', () => {
  describe('formatPercent', () => {
    it('formats 0.5 as 50% for en-US', () => {
      expect(formatPercent(0.5, {locale: 'en-US'})).toBe('50%');
    });
  });

  describe('formatNumber', () => {
    it('formats 1_000 as 1,000 for en-US', () => {
      expect(formatNumber(1_000, {locale: 'en-US'})).toBe('1,000');
    });

    it('formats 1_000 as 1 000 for fr-Fr', () => {
      expect(formatNumber(1_000, {locale: 'fr-FR'})).toBe('1\u202f000');
    });
  });

  describe('formatNumberCompact', () => {
    it('formats 1_000 as 1K for en-US', () => {
      expect(formatNumberCompact(1_000, {locale: 'en-US'})).toBe('1K');
    });

    it('formats 1_000_000 as 1M for en-US', () => {
      expect(formatNumberCompact(1_000_000, {locale: 'en-US'})).toBe('1M');
    });

    it('formats 1_000_000_000 as 1B for en-US', () => {
      expect(formatNumberCompact(1_000_000_000, {locale: 'en-US'})).toBe('1B');
    });

    it('format 10_000 as 1万 for zh-CN', () => {
      expect(formatNumberCompact(10_000, {locale: 'zh-CN'})).toBe('1万');
    });
  });
});
