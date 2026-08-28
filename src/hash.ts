const K = new Uint32Array([
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
]);

export class Sha256 {
  private state = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
  private buffer = new Uint8Array(64);
  private buffered = 0;
  private bytes = 0;

  update(input: Uint8Array): this {
    this.bytes += input.byteLength;
    let offset = 0;
    if (this.buffered) {
      const take = Math.min(64 - this.buffered, input.byteLength);
      this.buffer.set(input.subarray(0, take), this.buffered);
      this.buffered += take;
      offset = take;
      if (this.buffered === 64) { this.compress(this.buffer); this.buffered = 0; }
    }
    while (offset + 64 <= input.byteLength) {
      this.compress(input.subarray(offset, offset + 64));
      offset += 64;
    }
    if (offset < input.byteLength) {
      this.buffer.set(input.subarray(offset), 0);
      this.buffered = input.byteLength - offset;
    }
    return this;
  }

  digest(): string {
    const tail = new Uint8Array(this.buffered + 1 + 8 + 64);
    tail.set(this.buffer.subarray(0, this.buffered));
    tail[this.buffered] = 0x80;
    const paddedLength = Math.ceil((this.buffered + 1 + 8) / 64) * 64;
    const bits = BigInt(this.bytes) * 8n;
    const view = new DataView(tail.buffer);
    view.setUint32(paddedLength - 8, Number((bits >> 32n) & 0xffffffffn));
    view.setUint32(paddedLength - 4, Number(bits & 0xffffffffn));
    for (let i = 0; i < paddedLength; i += 64) this.compress(tail.subarray(i, i + 64));
    return Array.from(this.state, (word) => word.toString(16).padStart(8, '0')).join('');
  }

  private compress(block: Uint8Array): void {
    const w = new Uint32Array(64);
    const view = new DataView(block.buffer, block.byteOffset, block.byteLength);
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(i * 4);
    for (let i = 16; i < 64; i += 1) {
      const a = w[i - 15] ?? 0; const b = w[i - 2] ?? 0;
      const s0 = (rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3)) >>> 0;
      const s1 = (rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10)) >>> 0;
      w[i] = (((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) >>> 0);
    }
    let [a,b,c,d,e,f,g,h] = Array.from(this.state) as [number,number,number,number,number,number,number,number];
    for (let i = 0; i < 64; i += 1) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + s1 + ch + (K[i] ?? 0) + (w[i] ?? 0)) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) >>> 0;
      h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
    }
    const values = [a,b,c,d,e,f,g,h];
    for (let i = 0; i < 8; i += 1) this.state[i] = ((this.state[i] ?? 0) + (values[i] ?? 0)) >>> 0;
  }
}

function rotr(value: number, shift: number): number {
  return (value >>> shift) | (value << (32 - shift));
}

export async function hashFile(file: File): Promise<string> {
  const hasher = new Sha256();
  const reader = file.stream().getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    hasher.update(value);
  }
  return hasher.digest();
}

export function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let distance = 0;
  for (let i = 0; i < a.length; i += 1) {
    let n = parseInt(a[i] ?? '0', 16) ^ parseInt(b[i] ?? '0', 16);
    while (n) { distance += n & 1; n >>>= 1; }
  }
  return distance;
}
