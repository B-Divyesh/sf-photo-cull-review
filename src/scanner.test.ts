import { describe, expect, it } from 'vitest';
import { buildGroups, scanFiles, selectMediaFiles } from './scanner';
import type { MediaAsset } from './types';

function asset(id: string, sha256: string, perceptualHash?: string, lastModified = 0, captureTimestamp?: number): MediaAsset {
  return { id, name: `${id}.jpg`, path: `roll/${id}.jpg`, mediaType: 'image', mime: 'image/jpeg', size: 100, lastModified, captureTimestamp, sha256, perceptualHash, decision: 'undecided' };
}

function streamedVideo(name: string, chunks: string[]): File {
  const encoder = new TextEncoder();
  const encoded = chunks.map((chunk) => encoder.encode(chunk));
  return {
    name,
    type: 'video/mp4',
    size: encoded.reduce((total, chunk) => total + chunk.byteLength, 0),
    lastModified: 1,
    webkitRelativePath: `Videos/${name}`,
    arrayBuffer: async () => { throw new Error('A video should not be loaded as one buffer.'); },
    stream: () => {
      let index = 0;
      return new ReadableStream<Uint8Array>({
        pull(controller) {
          const chunk = encoded[index++];
          if (chunk) controller.enqueue(chunk);
          else controller.close();
        },
      });
    },
  } as unknown as File;
}

describe('candidate grouping', () => {
  it('groups complete hash matches as exact', () => {
    const groups = buildGroups([asset('a', 'same'), asset('b', 'same'), asset('c', 'different')]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe('exact');
    expect(groups[0]?.assetIds).toEqual(['a', 'b']);
  });

  it('@claim:similar-suggestions includes photos exactly 30 seconds apart and excludes photos 31 seconds apart', () => {
    const groups = buildGroups([
      asset('a', 'one', '0000000000000000', 1_000, 1_000),
      asset('b', 'two', '000000000000000f', 2_000, 31_000),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.kind).toBe('similar');
    expect(groups[0]?.assetIds).toEqual(['a', 'b']);
    expect(groups[0]?.explanation).toContain('suggests a burst');
    expect(groups[0]?.explanation).toContain('does not prove');
    expect(buildGroups([
      asset('c', 'three', '0000000000000000', 1_000, 1_000),
      asset('d', 'four', '000000000000000f', 2_000, 32_000),
    ])).toEqual([]);
  });

  it('@claim:capture-time uses embedded camera time and never file modification time for burst timing', () => {
    const visuallyCloseButCapturedFiveMinutesApart = buildGroups([
      asset('a', 'one', '0000000000000000', 1_000, 1_000),
      asset('b', 'two', '000000000000000f', 2_000, 301_000),
    ]);
    expect(visuallyCloseButCapturedFiveMinutesApart).toEqual([]);

    const capturedSecondsApartAfterFilesWereCopiedLater = buildGroups([
      asset('c', 'three', '0000000000000000', 1_000, 1_000),
      asset('d', 'four', '000000000000000f', 301_000, 2_000),
    ]);
    expect(capturedSecondsApartAfterFilesWereCopiedLater).toHaveLength(1);
    expect(capturedSecondsApartAfterFilesWereCopiedLater[0]?.explanation).toContain('embedded camera metadata');
  });

  it('@claim:free-limit accepts 750 supported files and rejects 751 before scanning', () => {
    const files = Array.from({ length: 751 }, (_, index) => new File([String(index)], `clip-${index}.mp4`, { type: 'video/mp4' }));
    expect(selectMediaFiles(files.slice(0, 750), false).media).toHaveLength(750);
    expect(() => selectMediaFiles(files, false)).toThrow('free product scans up to 750');
  });

  it('@regression:archive-pass-limit accepts folders above the free limit before any file read', () => {
    const files = Array.from({ length: 751 }, (_, index) => new File([String(index)], `clip-${index}.mp4`, { type: 'video/mp4' }));
    expect(selectMediaFiles(files, true).media).toHaveLength(751);
  });

  it('@claim:video-streaming hashes videos as streams for exact matching without preview decoding', async () => {
    const result = await scanFiles([
      streamedVideo('clip-a.mp4', ['frame-', 'bytes']),
      streamedVideo('clip-b.mp4', ['frame-', 'bytes']),
    ], true, () => undefined);

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]).toMatchObject({ kind: 'exact' });
    expect(result.groups[0]?.assetIds).toHaveLength(2);
    expect(result.assets.every((item) => item.thumbnail === undefined && item.perceptualHash === undefined)).toBe(true);
  });

  it('@claim:supported-formats accepts every documented input type and rejects unsupported files', () => {
    const inputs = [
      new File(['x'], 'photo.jpg', { type: 'image/jpeg' }),
      new File(['x'], 'photo.png', { type: 'image/png' }),
      new File(['x'], 'photo.webp', { type: 'image/webp' }),
      new File(['x'], 'photo.gif', { type: 'image/gif' }),
      new File(['x'], 'photo.bmp', { type: 'image/bmp' }),
      new File(['x'], 'clip.mp4', { type: 'video/mp4' }),
      new File(['x'], 'clip.mov', { type: 'video/quicktime' }),
      new File(['x'], 'clip.m4v', { type: 'video/x-m4v' }),
      new File(['x'], 'clip.webm', { type: 'video/webm' }),
      new File(['x'], 'note.txt', { type: 'text/plain' }),
    ];
    const result = selectMediaFiles(inputs, false);
    expect(result.media.map((file) => file.type)).toEqual([
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp',
      'video/mp4', 'video/quicktime', 'video/x-m4v', 'video/webm',
    ]);
    expect(result.skipped).toBe(1);
  });
});
