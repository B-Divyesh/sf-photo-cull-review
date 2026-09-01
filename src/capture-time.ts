const EXIF_SCAN_BYTES = 256 * 1024;

/**
 * Reads the JPEG DateTimeOriginal EXIF value when it is available. Capture
 * time has no timezone field in EXIF, so the value is kept in a stable UTC
 * representation; we only use it to compare elapsed time between photos.
 */
export async function readCaptureTimestamp(file: File): Promise<number | undefined> {
  if (file.type !== 'image/jpeg') return undefined;
  try {
    const bytes = new Uint8Array(await file.slice(0, EXIF_SCAN_BYTES).arrayBuffer());
    return parseJpegCaptureTimestamp(bytes);
  } catch {
    return undefined;
  }
}

export function parseJpegCaptureTimestamp(bytes: Uint8Array): number | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return undefined;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset] ?? 0;
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) return undefined;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = readUint16(bytes, offset, false);
    if (!length || length < 2) return undefined;
    const dataStart = offset + 2;
    const dataEnd = offset + length;
    if (dataEnd > bytes.length) return undefined;
    if (marker === 0xe1) {
      const timestamp = parseExifTimestamp(bytes.subarray(dataStart, dataEnd));
      if (timestamp !== undefined) return timestamp;
    }
    offset = dataEnd;
  }
  return undefined;
}

function parseExifTimestamp(payload: Uint8Array): number | undefined {
  if (payload.length < 14 || String.fromCharCode(...payload.subarray(0, 6)) !== 'Exif\0\0') return undefined;
  const tiff = payload.subarray(6);
  const littleEndian = tiff[0] === 0x49 && tiff[1] === 0x49;
  const bigEndian = tiff[0] === 0x4d && tiff[1] === 0x4d;
  if (!littleEndian && !bigEndian || readUint16(tiff, 2, littleEndian) !== 42) return undefined;
  const ifd0Offset = readUint32(tiff, 4, littleEndian);
  if (ifd0Offset === undefined) return undefined;
  const exifOffset = entryValue(tiff, ifd0Offset, littleEndian, 0x8769);
  if (exifOffset === undefined) return undefined;
  const date = entryAsciiValue(tiff, exifOffset, littleEndian, 0x9003);
  if (!date) return undefined;
  const fraction = entryAsciiValue(tiff, exifOffset, littleEndian, 0x9291);
  return parseExifDate(date, fraction);
}

function entryValue(bytes: Uint8Array, directoryOffset: number, littleEndian: boolean, tag: number): number | undefined {
  const entry = findEntry(bytes, directoryOffset, littleEndian, tag);
  return entry === undefined ? undefined : readUint32(bytes, entry + 8, littleEndian);
}

function entryAsciiValue(bytes: Uint8Array, directoryOffset: number, littleEndian: boolean, tag: number): string | undefined {
  const entry = findEntry(bytes, directoryOffset, littleEndian, tag);
  if (entry === undefined || readUint16(bytes, entry + 2, littleEndian) !== 2) return undefined;
  const count = readUint32(bytes, entry + 4, littleEndian);
  if (!count || count < 2) return undefined;
  const start = count <= 4 ? entry + 8 : readUint32(bytes, entry + 8, littleEndian);
  if (start === undefined || start + count > bytes.length) return undefined;
  return new TextDecoder().decode(bytes.subarray(start, start + count)).replace(/\0+$/, '');
}

function findEntry(bytes: Uint8Array, directoryOffset: number, littleEndian: boolean, tag: number): number | undefined {
  const count = readUint16(bytes, directoryOffset, littleEndian);
  if (count === undefined || directoryOffset + 2 + count * 12 > bytes.length) return undefined;
  for (let index = 0; index < count; index += 1) {
    const entry = directoryOffset + 2 + index * 12;
    if (readUint16(bytes, entry, littleEndian) === tag) return entry;
  }
  return undefined;
}

function parseExifDate(value: string, fraction?: string): number | undefined {
  const match = /^(\d{4}):(\d{2}):(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return undefined;
  const [, year, month, day, hour, minute, second] = match.map(Number);
  if ([year, month, day, hour, minute, second].some((part) => !Number.isFinite(part))) return undefined;
  const milliseconds = Number.parseInt((fraction?.match(/^\d+/)?.[0] ?? '').padEnd(3, '0').slice(0, 3), 10) || 0;
  const timestamp = Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 0, hour ?? 0, minute ?? 0, second ?? 0, milliseconds);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year || date.getUTCMonth() !== (month ?? 1) - 1 || date.getUTCDate() !== day
    || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second
  ) return undefined;
  return timestamp;
}

function readUint16(bytes: Uint8Array, offset: number, littleEndian: boolean): number | undefined {
  if (offset < 0 || offset + 2 > bytes.length) return undefined;
  return littleEndian
    ? (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8)
    : ((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0);
}

function readUint32(bytes: Uint8Array, offset: number, littleEndian: boolean): number | undefined {
  if (offset < 0 || offset + 4 > bytes.length) return undefined;
  return littleEndian
    ? ((bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8) | ((bytes[offset + 2] ?? 0) << 16) | ((bytes[offset + 3] ?? 0) << 24)) >>> 0
    : (((bytes[offset] ?? 0) << 24) | ((bytes[offset + 1] ?? 0) << 16) | ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0)) >>> 0;
}
