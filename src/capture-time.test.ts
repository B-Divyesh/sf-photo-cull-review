import { describe, expect, it } from 'vitest';
import { parseJpegCaptureTimestamp } from './capture-time';

function jpegWithDateTimeOriginal(date: string, fraction = '1250'): Uint8Array {
  const encoder = new TextEncoder();
  const dateBytes = encoder.encode(`${date}\0`);
  const fractionBytes = encoder.encode(`${fraction}\0`);
  const tiff = new Uint8Array(256);
  const view = new DataView(tiff.buffer);
  tiff.set([0x4d, 0x4d]);
  view.setUint16(2, 42, false);
  view.setUint32(4, 8, false);
  view.setUint16(8, 1, false);
  view.setUint16(10, 0x8769, false); view.setUint16(12, 4, false); view.setUint32(14, 1, false); view.setUint32(18, 26, false);
  view.setUint32(22, 0, false);
  view.setUint16(26, 2, false);
  view.setUint16(28, 0x9003, false); view.setUint16(30, 2, false); view.setUint32(32, dateBytes.length, false); view.setUint32(36, 56, false);
  view.setUint16(40, 0x9291, false); view.setUint16(42, 2, false); view.setUint32(44, fractionBytes.length, false); view.setUint32(48, 56 + dateBytes.length, false);
  view.setUint32(52, 0, false);
  tiff.set(dateBytes, 56);
  tiff.set(fractionBytes, 56 + dateBytes.length);
  const payload = new Uint8Array(6 + 56 + dateBytes.length + fractionBytes.length);
  payload.set(encoder.encode('Exif\0\0'));
  payload.set(tiff.subarray(0, payload.length - 6), 6);
  const bytes = new Uint8Array(2 + 2 + 2 + payload.length + 2);
  bytes.set([0xff, 0xd8, 0xff, 0xe1]);
  new DataView(bytes.buffer).setUint16(4, payload.length + 2, false);
  bytes.set(payload, 6);
  bytes.set([0xff, 0xd9], 6 + payload.length);
  return bytes;
}

describe('JPEG capture metadata', () => {
  it('reads DateTimeOriginal and its fractional seconds from EXIF', () => {
    expect(parseJpegCaptureTimestamp(jpegWithDateTimeOriginal('2025:07:19 15:42:03'))).toBe(Date.UTC(2025, 6, 19, 15, 42, 3, 125));
  });

  it('does not invent a capture time when JPEG metadata is absent', () => {
    expect(parseJpegCaptureTimestamp(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]))).toBeUndefined();
  });
});
