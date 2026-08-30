import { describe, expect, it } from 'vitest';
import { buildGroups, scanFiles } from './scanner';
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

  it('@claim:similar-suggestions only suggests similar photos taken close together', () => {
    const groups = buildGroups([
      asset('a', 'one', '0000000000000000', 1_000),
      asset('b', 'two', '000000000000000f', 2_000),
      asset('c', 'three', '000000000000000f', 90_000),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe('similar');
    expect(groups[0]?.assetIds).toEqual(['a', 'b']);
  });

  it('@claim:free-limit accepts 750 supported files and rejects 751 before scanning', async () => {
    const files = Array.from({ length: 751 }, (_, index) => new File([String(index)], `clip-${index}.mp4`, { type: 'video/mp4' }));
    const accepted = await scanFiles(files.slice(0, 750), false, () => undefined);
    expect(accepted.assets).toHaveLength(750);
    await expect(scanFiles(files, false, () => undefined)).rejects.toThrow('free archive desk scans up to 750');
  });
});
