const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG || 'photo-cull-review';
const API_BASE = import.meta.env.VITE_BILLING_BASE || 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason?: string; expiresAt?: string | null }

export interface LicenseVerification {
  valid: boolean;
  status: 'none' | 'cached' | 'verified' | 'unavailable';
  reason?: string;
}

export function checkoutUrl(): string {
  return `${API_BASE}/products/${PRODUCT_SLUG}/checkout`;
}

export function captureLicenseFromUrl(): boolean {
  const url = new URL(location.href);
  const license = url.searchParams.get('license');
  if (!license) return false;
  localStorage.setItem(LICENSE_KEY, license.trim());
  // A token is only an identifier. Never inherit a verdict from another token
  // or treat an unverified checkout return as paid access.
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function storeLicense(license: string): void {
  localStorage.setItem(LICENSE_KEY, license.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function hasOptimisticUnlock(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  return isSuccessfulVerdict(readVerdict());
}

export function hasStoredLicense(): boolean {
  return Boolean(localStorage.getItem(LICENSE_KEY)?.trim());
}

export async function verifyLicense(force = false): Promise<LicenseVerification> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { valid: false, status: 'none' };
  const cached = readVerdict();
  if (!force && cached && cached.checkedAt > 0 && Date.now() - cached.checkedAt < DAY) {
    return { valid: isSuccessfulVerdict(cached), status: 'cached', reason: cached.reason };
  }
  try {
    const response = await fetch(`${API_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const body = await response.json() as { valid: boolean; reason?: string; expires_at?: string | null };
    const verdict = { valid: body.valid === true, reason: body.reason, expiresAt: body.expires_at, checkedAt: Date.now() } satisfies Verdict;
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return { valid: isSuccessfulVerdict(verdict), status: 'verified', reason: body.reason };
  } catch {
    return { valid: isSuccessfulVerdict(cached), status: 'unavailable', reason: 'unavailable' };
  }
}

function isSuccessfulVerdict(verdict: Verdict | undefined): boolean {
  if (!verdict?.valid || !Number.isFinite(verdict.checkedAt) || verdict.checkedAt <= 0) return false;
  if (!verdict.expiresAt) return true;
  const expiresAt = Date.parse(verdict.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function readVerdict(): Verdict | undefined {
  try {
    const raw = localStorage.getItem(VERDICT_KEY);
    return raw ? JSON.parse(raw) as Verdict : undefined;
  } catch { return undefined; }
}
