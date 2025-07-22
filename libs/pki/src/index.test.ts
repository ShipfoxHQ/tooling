import {describe, expect, it} from 'vitest';
import {generateCA} from './index';

describe('generateCA', () => {
  it('should generate a CA', () => {
    const {privateKey, publicKey, certificate} = generateCA();

    expect(privateKey).toBeDefined();
    expect(publicKey).toBeDefined();
    expect(certificate).toBeDefined();
  });
});
