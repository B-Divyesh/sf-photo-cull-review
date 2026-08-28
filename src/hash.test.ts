import { describe, expect, it } from 'vitest';
import { hammingDistance, Sha256 } from './hash';

describe('streaming SHA-256', () => {
  it('matches the published digest for abc', () => {
    const digest = new Sha256().update(new TextEncoder().encode('abc')).digest();
    expect(digest).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('produces the same digest across chunk boundaries', () => {
    const one = new Sha256().update(new TextEncoder().encode('a'.repeat(10_000))).digest();
    const split = new Sha256();
    for (let i = 0; i < 10_000; i += 37) split.update(new TextEncoder().encode('a'.repeat(Math.min(37, 10_000 - i))));
    expect(split.digest()).toBe(one);
  });
});

describe('perceptual distance', () => {
  it('counts differing bits', () => {
    expect(hammingDistance('0000', '000f')).toBe(4);
    expect(hammingDistance('ffff', 'ffff')).toBe(0);
  });
});
