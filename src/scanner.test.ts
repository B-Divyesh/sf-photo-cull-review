import { describe, expect, it } from 'vitest';
import { buildGroups } from './scanner';
import type { MediaAsset } from './types';

function asset(id: string, sha256: string, perceptualHash?: string, lastModified = 0): MediaAsset {
  return { id, name: `${id}.jpg`, path: `roll/${id}.jpg`, mediaType: 'image', mime: 'image/jpeg', size: 100, lastModified, sha256, perceptualHash, decision: 'undecided' };
}

describe('candidate grouping', () => {
  it('groups complete hash matches as exact', () => {
    const groups = buildGroups([asset('a', 'same'), asset('b', 'same'), asset('c', 'different')]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe('exact');
    expect(groups[0]?.assetIds).toEqual(['a', 'b']);
  });

  it('only suggests similar photos taken close together', () => {
    const groups = buildGroups([
      asset('a', 'one', '0000000000000000', 1_000),
      asset('b', 'two', '000000000000000f', 2_000),
      asset('c', 'three', '000000000000000f', 90_000),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe('similar');
    expect(groups[0]?.assetIds).toEqual(['a', 'b']);
  });
});
