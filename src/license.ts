const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG || 'photo-cull-review';
const API_BASE = import.meta.env.VITE_BILLING_BASE || 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason?: string }

export function checkoutUrl(): string {
  return `${API_BASE}/products/${PRODUCT_SLUG}/checkout`;
}

export function captureLicenseFromUrl(): void {
  const url = new URL(location.href);
  const license = url.searchParams.get('license');
  if (!license) return;
  localStorage.setItem(LICENSE_KEY, license.trim());
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 } satisfies Verdict));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(license: string): void {
  localStorage.setItem(LICENSE_KEY, license.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function hasOptimisticUnlock(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  const verdict = readVerdict();
  return verdict?.valid !== false;
}

export async function verifyLicense(force = false): Promise<boolean> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached.valid;
  try {
    const response = await fetch(`${API_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const body = await response.json() as { valid: boolean; reason?: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: body.valid, reason: body.reason, checkedAt: Date.now() } satisfies Verdict));
    return body.valid;
  } catch {
    return cached?.valid ?? true;
  }
}

function readVerdict(): Verdict | undefined {
  try {
    const raw = localStorage.getItem(VERDICT_KEY);
    return raw ? JSON.parse(raw) as Verdict : undefined;
  } catch { return undefined; }
}
