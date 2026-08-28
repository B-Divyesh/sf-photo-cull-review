import { hammingDistance, hashFile } from './hash';
import type { MediaAsset, ReviewGroup } from './types';

const SUPPORTED_IMAGES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']);
const SUPPORTED_VIDEOS = new Set(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v']);
export const FREE_FILE_LIMIT = 750;

export interface ScanResult {
  assets: MediaAsset[];
  groups: ReviewGroup[];
  skipped: number;
  failures: string[];
  rootName: string;
}

export async function scanFiles(
  incoming: File[],
  paid: boolean,
  onProgress: (complete: number, total: number, name: string) => void,
): Promise<ScanResult> {
  const media = incoming.filter((file) => SUPPORTED_IMAGES.has(file.type) || SUPPORTED_VIDEOS.has(file.type));
  const skipped = incoming.length - media.length;
  if (!media.length) throw new Error('No supported photos or videos were found. Choose a folder containing JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, or WebM files.');
  if (!paid && media.length > FREE_FILE_LIMIT) {
    throw new Error(`This folder contains ${media.length.toLocaleString()} supported files. The free archive desk scans up to ${FREE_FILE_LIMIT}; choose a smaller folder or unlock unlimited scans.`);
  }

  const assets: MediaAsset[] = [];
  const failures: string[] = [];
  for (let index = 0; index < media.length; index += 1) {
    const file = media[index];
    if (!file) continue;
    onProgress(index, media.length, file.name);
    try {
      const path = file.webkitRelativePath || file.name;
      const isImage = SUPPORTED_IMAGES.has(file.type);
      const sha256 = await hashFile(file);
      let visual: Pick<MediaAsset, 'thumbnail' | 'perceptualHash'> = {};
      if (isImage) {
        try { visual = await readVisual(file); }
        catch { /* Exact matching remains available when a browser cannot decode a preview. */ }
      }
      assets.push({
        id: stableId(path, file.size, file.lastModified),
        name: file.name,
        path,
        mediaType: isImage ? 'image' : 'video',
        mime: file.type,
        size: file.size,
        lastModified: file.lastModified,
        sha256,
        ...visual,
        decision: 'undecided',
      });
    } catch {
      failures.push(file.name);
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  onProgress(media.length, media.length, 'Grouping candidates');
  const rootPath = assets[0]?.path ?? media[0]?.name ?? 'Selected folder';
  return {
    assets,
    groups: buildGroups(assets),
    skipped,
    failures,
    rootName: rootPath.includes('/') ? rootPath.split('/')[0] ?? 'Selected folder' : 'Selected files',
  };
}

export function buildGroups(assets: MediaAsset[]): ReviewGroup[] {
  const groups: ReviewGroup[] = [];
  const byHash = new Map<string, MediaAsset[]>();
  for (const asset of assets) {
    const list = byHash.get(asset.sha256) ?? [];
    list.push(asset);
    byHash.set(asset.sha256, list);
  }
  const exactIds = new Set<string>();
  for (const [hash, matches] of byHash) {
    if (matches.length < 2) continue;
    matches.forEach((asset) => exactIds.add(asset.id));
    groups.push({
      id: `exact-${hash.slice(0, 12)}`,
      kind: 'exact',
      assetIds: matches.map((asset) => asset.id),
      explanation: `Same file size and complete SHA-256 hash (${hash.slice(0, 10)}…). These files are byte-for-byte identical.`,
    });
  }

  const candidates = assets
    .filter((asset) => asset.mediaType === 'image' && asset.perceptualHash && !exactIds.has(asset.id))
    .sort((a, b) => a.lastModified - b.lastModified);
  const parent = candidates.map((_, index) => index);
  const find = (value: number): number => parent[value] === value ? value : (parent[value] = find(parent[value] ?? value));
  const union = (a: number, b: number): void => { const ra = find(a); const rb = find(b); if (ra !== rb) parent[rb] = ra; };
  for (let i = 0; i < candidates.length; i += 1) {
    const first = candidates[i];
    if (!first?.perceptualHash) continue;
    for (let j = i + 1; j < Math.min(candidates.length, i + 12); j += 1) {
      const second = candidates[j];
      if (!second?.perceptualHash) continue;
      const elapsed = Math.abs(first.lastModified - second.lastModified);
      if (elapsed > 30_000) break;
      if (hammingDistance(first.perceptualHash, second.perceptualHash) <= 10) union(i, j);
    }
  }
  const clusters = new Map<number, MediaAsset[]>();
  candidates.forEach((asset, index) => {
    const list = clusters.get(find(index)) ?? [];
    list.push(asset);
    clusters.set(find(index), list);
  });
  for (const matches of clusters.values()) {
    if (matches.length < 2) continue;
    groups.push({
      id: `similar-${matches[0]?.id ?? groups.length}`,
      kind: 'similar',
      assetIds: matches.map((asset) => asset.id),
      explanation: 'Made within 30 seconds and visually close by a 64-bit difference hash. This suggests a burst—it does not prove the photos are duplicates.',
    });
  }
  return groups.sort((a, b) => a.kind.localeCompare(b.kind));
}

function stableId(path: string, size: number, modified: number): string {
  let hash = 2166136261;
  const source = `${path}:${size}:${modified}`;
  for (let i = 0; i < source.length; i += 1) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
  return `asset-${(hash >>> 0).toString(16)}`;
}

async function readVisual(file: File): Promise<Pick<MediaAsset, 'thumbnail' | 'perceptualHash'>> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const hashCanvas = document.createElement('canvas');
    hashCanvas.width = 9; hashCanvas.height = 8;
    const hashContext = hashCanvas.getContext('2d', { willReadFrequently: true });
    if (!hashContext) throw new Error('Canvas is unavailable.');
    hashContext.drawImage(bitmap, 0, 0, 9, 8);
    const pixels = hashContext.getImageData(0, 0, 9, 8).data;
    let bits = '';
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) bits += luminance(pixels, y * 9 + x) > luminance(pixels, y * 9 + x + 1) ? '1' : '0';
    }
    let perceptualHash = '';
    for (let i = 0; i < bits.length; i += 4) perceptualHash += parseInt(bits.slice(i, i + 4), 2).toString(16);

    const scale = Math.min(1, 320 / bitmap.width, 220 / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = width; thumbCanvas.height = height;
    const context = thumbCanvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable.');
    context.drawImage(bitmap, 0, 0, width, height);
    return { perceptualHash, thumbnail: thumbCanvas.toDataURL('image/webp', 0.72) };
  } finally {
    bitmap.close();
  }
}

function luminance(pixels: Uint8ClampedArray, index: number): number {
  const offset = index * 4;
  return (pixels[offset] ?? 0) * 0.299 + (pixels[offset + 1] ?? 0) * 0.587 + (pixels[offset + 2] ?? 0) * 0.114;
}
