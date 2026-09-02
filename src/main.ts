import './styles.css';
import { clearData, loadData, saveData, useStorageNamespace } from './db';
import { ARCHIVE_PASS_PRICE, captureLicenseFromUrl, checkoutUrl, hasOptimisticUnlock, hasStoredLicense, storeLicense, verifyLicense } from './license';
import { FREE_FILE_LIMIT, scanFiles } from './scanner';
import type { AppData, Decision, MediaAsset, ReviewGroup } from './types';
import { EMPTY_DATA } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
if (!app) throw new Error('App root is missing.');

const demoMode = new URL(location.href).searchParams.get('demo') === '1';
useStorageNamespace(demoMode ? 'demo' : 'real');

let data: AppData = structuredClone(EMPTY_DATA);
let paid = false;
let busy = true;
let globalError = '';
let licenseNotice = '';
let toastTimer = 0;
const INVALID_BACKUP_MESSAGE = 'That file is not a Photo Cull Review backup. Choose a valid JSON backup exported from Photo Cull Review.';
const ROUTE_FOCUS_KEY = 'photo-cull-review:route-focus';

void init();

async function init(): Promise<void> {
  if (!demoMode) {
    captureLicenseFromUrl();
    paid = hasOptimisticUnlock();
  }
  if (demoMode) setDemoMetadata();
  try {
    data = await loadData();
    if (demoMode && !data.scan) {
      data = createDemoData();
      await saveData(data);
    }
  }
  catch (error) { globalError = message(error); }
  busy = false;
  render();
  bindGlobalEvents();
  focusRouteHeadingIfNeeded();
  if (!demoMode && hasStoredLicense()) {
    const verification = await verifyLicense();
    paid = verification.valid;
    if (verification.status === 'unavailable') {
      licenseNotice = paid
        ? 'We could not recheck this Archive pass. Its last successful check remains active.'
        : 'We could not verify this license. Free limits remain active. Check your connection and try again.';
    } else if (!verification.valid) {
      licenseNotice = 'This license is no longer active. Free limits are in use.';
    }
    render();
  }
  registerServiceWorker();
}

function render(): void {
  const offline = !navigator.onLine;
  app.innerHTML = `
    ${offline ? '<div class="offline-banner" role="status">Offline — your saved review is still available on this device.</div>' : ''}
    ${demoMode ? '<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, separate from your workspace</strong><span>Changes stay only in this sample.</span><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/" data-action="start-real">Start for real</a></aside>' : ''}
    <header class="site-header">
      <a class="brand" href="/" aria-label="Photo Cull Review home">
        <img src="/icons/icon.svg" alt="" width="34" height="34"><span>Photo Cull Review</span>
      </a>
      <nav aria-label="Primary">
        <a href="/?demo=1">Demo</a>
        <a href="/#how-it-works" aria-label="How it works"><span class="wide-label">How it works</span><span class="compact-label">How</span></a>
        <a href="/privacy/">Privacy</a>
        <button class="text-button" data-action="open-license" aria-label="${paid ? 'Archive pass active' : 'View Archive pass'}"><span class="wide-label">${paid ? 'Archive pass active' : 'View Archive pass'}</span><span class="compact-label">${paid ? 'Pass active' : 'View pass'}</span></button>
      </nav>
    </header>
    ${licenseNotice ? licenseNoticeView() : ''}
    ${busy ? loadingView() : data.scan ? workspaceView() : welcomeView()}
    <footer class="site-footer">
      <p>Local photo review before anything moves.</p>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
      <p class="provenance">Original generated archive illustration · Built by Param Factory · v1.0.11</p>
    </footer>
    <div id="route-status" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
    <div class="toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>
    ${licenseDialog()}
  `;
  bindViewEvents();
}

function loadingView(): string {
  return '<main id="main" class="loading"><p class="eyebrow">Opening Photo Cull Review</p><h1>Loading your photo review…</h1></main>';
}

function welcomeView(): string {
  return `<main id="main">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Review duplicate photos on this device</p>
        <h1 tabindex="-1">Clean up duplicate photos.<br><em>Before anything moves.</em></h1>
        <p class="lede">For households with large or crowded photo archives, compare exact copies and likely bursts before exporting a move plan.</p>
        <div class="hero-actions">
          <a class="button primary" href="/?demo=1">Try it with sample data</a>
          <span class="button-note">Opens a four-file sample review in this browser.</span>
          <button class="button secondary" data-action="choose-folder">Choose your photo folder</button>
          <span class="format-note">JPEG, PNG, WebP, GIF, BMP, MP4, MOV, M4V, WebM</span>
        </div>
        <input class="visually-hidden" id="folder-input" type="file" aria-label="Choose a photo folder" multiple webkitdirectory accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,video/mp4,video/quicktime,video/webm,video/x-m4v">
        <ul class="trust-facts" aria-label="Product facts"><li>Photos stay on this device</li><li>Works offline after the first visit</li><li>Free for up to ${FREE_FILE_LIMIT} files</li></ul>
        ${globalError ? `<p class="error" role="alert">${escapeHtml(globalError)}</p>` : ''}
      </div>
      <figure class="hero-art">
        <picture><source media="(max-width: 640px)" srcset="/assets/archive-room-mobile.webp"><img src="/assets/archive-room.webp" width="1280" height="853" alt="An imagined moonlit archive where a red thread connects photographic slides across paper dunes" fetchpriority="high" decoding="async"></picture>
        <figcaption>The app creates a move plan and does not move photos.</figcaption>
      </figure>
    </section>
    <section id="how-it-works" class="method" aria-labelledby="method-title">
      <p class="eyebrow">How it works</p><h2 id="method-title">Review duplicate and burst photos in three steps.</h2>
      <ol class="method-list">
        <li><span>01</span><h3>Find exact copies and likely bursts</h3><p>The app checks every byte to find exact copies. It compares photos and capture times to suggest likely bursts.</p></li>
        <li><span>02</span><h3>Review every group</h3><p>See why files were grouped. Mark each one keep or move to review; suggestions never become facts.</p></li>
        <li><span>03</span><h3>Export, don’t delete</h3><p>Download a CSV move plan for a separate review folder. Your source archive remains untouched.</p></li>
      </ol>
    </section>
    <section id="archive-pass" class="pricing" aria-labelledby="price-title">
      <div><p class="eyebrow">For folders over ${FREE_FILE_LIMIT} files</p><h2 id="price-title">Archive pass</h2><p>Free for folders up to ${FREE_FILE_LIMIT} supported files. A one-time ${ARCHIVE_PASS_PRICE} pass scans folders above the ${FREE_FILE_LIMIT}-file free limit.</p></div>
      <div class="price-action"><strong>${ARCHIVE_PASS_PRICE} <small>one time</small></strong><a class="button secondary" href="${checkoutUrl()}">Buy Archive pass at checkout<span class="visually-hidden"> (opens external checkout)</span></a><button class="text-button" data-action="open-license">Restore a license</button></div>
    </section>
  </main>`;
}

function workspaceView(): string {
  const group = data.groups[data.activeGroup];
  const decided = data.assets.filter((asset) => asset.decision !== 'undecided').length;
  const candidates = new Set(data.groups.flatMap((item) => item.assetIds)).size;
  const reviewCount = data.assets.filter((asset) => asset.decision === 'review').length;
  const completeGroups = data.groups.filter((item) => item.assetIds.every((id) => assetById(id)?.decision !== 'undecided')).length;
  const activeReview = !data.groups.length ? noCandidatesView() : group ? groupView(group, reviewCount) : completedView(reviewCount);
  const tools = `<div class="head-actions workspace-tools">
        <button class="text-button" data-action="reset">Start a new scan</button>
        <button class="button secondary" data-action="export-csv">Export move plan</button>
        <button class="text-button" data-action="export-json">Back up workspace</button>
        <button class="text-button import-label" data-action="choose-import">Restore workspace</button><input class="visually-hidden" id="import-input" type="file" aria-label="Choose a workspace backup" accept="application/json">
      </div>`;
  return `<main id="main" class="workspace ${demoMode ? 'demo-workspace' : ''}">
    <section class="workspace-head">
      <div><p class="eyebrow">${escapeHtml(data.scan?.rootName ?? 'Local folder')} · ${formatDate(data.scan?.scannedAt)}</p><h1 tabindex="-1">Review duplicate and burst photos</h1><p>${data.scan?.scanned.toLocaleString()} files are ready to review on this device. ${data.groups.length ? `${data.groups.length} candidate groups need a human decision.` : 'No duplicate or burst groups were found.'}</p></div>
      ${demoMode ? '' : tools}
    </section>
    ${globalError ? `<p class="error page-error" role="alert">${escapeHtml(globalError)}</p>` : ''}
    ${demoMode ? activeReview : ''}
    ${demoMode ? tools : ''}
    <section class="summary" aria-label="Review progress">
      <div><strong>${completeGroups}</strong><span>of ${data.groups.length} groups reviewed</span></div>
      <div><strong>${decided}</strong><span>of ${candidates} candidates decided</span></div>
      <div><strong>${formatBytes(data.assets.filter((asset) => asset.decision === 'review').reduce((sum, asset) => sum + asset.size, 0))}</strong><span>marked for review folder</span></div>
      <div class="progress-wrap"><span class="visually-hidden">${candidates ? Math.round((decided / candidates) * 100) : 100}% decided</span><div class="progress"><i style="width:${candidates ? (decided / candidates) * 100 : 100}%"></i></div></div>
    </section>
    ${demoMode ? '' : activeReview}
  </main>`;
}

function noCandidatesView(): string {
  return `<section class="empty-state"><div class="empty-mark" aria-hidden="true">✓</div><p class="eyebrow">Scan complete</p><h2>No candidates to review</h2><p>No exact copies or visually close photos with embedded camera capture time were found. Nothing has been moved or changed.</p><button class="button primary" data-action="reset">Scan another folder</button></section>`;
}

function completedView(reviewCount: number): string {
  return `<section class="empty-state"><div class="empty-mark" aria-hidden="true">✓</div><p class="eyebrow">Review complete</p><h2>Your plan is ready</h2><p>${reviewCount} ${reviewCount === 1 ? 'file is' : 'files are'} marked to move into a separate review folder. Export the move plan, inspect it, and use your file manager to make the moves.</p><button class="button primary" data-action="export-csv">Export move plan</button></section>`;
}

function groupView(group: ReviewGroup, reviewCount: number): string {
  const groupAssets = group.assetIds.map(assetById).filter((item): item is MediaAsset => Boolean(item));
  const exact = group.kind === 'exact';
  const reason = `<p class="explanation"><strong>Why grouped:</strong> ${escapeHtml(group.explanation)}</p>
      ${exact ? '<p class="recommendation">Start by keeping the clearest path you recognize. Identical bytes mean image quality is the same.</p>' : '<p class="recommendation warning">Look closely at expressions, focus, and motion. Similarity is only a lead—keep every frame you value.</p>'}`;
  return `<section class="review-stage" aria-labelledby="group-title">
    <aside class="queue" aria-label="Candidate groups">
      <div class="queue-head"><h2>Candidate groups</h2><span>${data.activeGroup + 1}/${data.groups.length}</span></div>
      <ol>${data.groups.map((item, index) => {
        const done = item.assetIds.every((id) => assetById(id)?.decision !== 'undecided');
        return `<li><button class="queue-item ${index === data.activeGroup ? 'active' : ''}" data-group="${index}" ${index === data.activeGroup ? 'aria-current="step"' : ''}><span class="kind-mark ${item.kind}">${item.kind === 'exact' ? '=' : '≈'}</span><span><strong>${item.kind === 'exact' ? 'Exact copies' : 'Likely burst'}</strong><small>${item.assetIds.length} files · ${done ? 'Reviewed' : 'Needs review'}</small></span></button></li>`;
      }).join('')}</ol>
    </aside>
    <div class="group-panel">
      <div class="group-title-row"><div><p class="eyebrow">Group ${data.activeGroup + 1} of ${data.groups.length}</p><h2 id="group-title">${exact ? 'These files are exact copies' : 'These frames look related'}</h2></div><span class="evidence-stamp ${group.kind}">${exact ? 'Same bytes' : 'Suggestion'}</span></div>
      ${demoMode ? '' : reason}
      <div class="asset-grid">${groupAssets.map(assetView).join('')}</div>
      ${demoMode ? reason : ''}
      <div class="group-controls">
        <button class="button secondary" data-action="previous" ${data.activeGroup === 0 ? 'disabled' : ''}>← Previous group</button>
        <button class="text-button" data-action="undo" ${data.history.length ? '' : 'disabled'}>Undo last decision</button>
        <button class="button primary" data-action="next">${data.activeGroup === data.groups.length - 1 ? 'Finish review' : 'Next group →'}</button>
      </div>
      <p class="shortcut-hint">Keyboard: <kbd>K</kbd> keep · <kbd>R</kbd> review · <kbd>S</kbd> skip group · <kbd>←</kbd><kbd>→</kbd> groups</p>
      ${reviewCount ? `<p class="plan-count">${reviewCount} marked for the review folder so far.</p>` : ''}
    </div>
  </section>`;
}

function assetView(asset: MediaAsset, index: number): string {
  return `<article class="asset ${asset.decision}" data-asset="${asset.id}">
    <div class="asset-image">${asset.thumbnail ? `<img src="${asset.thumbnail}" alt="Preview of ${escapeHtml(asset.name)}" width="320" height="220">` : `<div class="video-placeholder" role="img" aria-label="No preview available for ${escapeHtml(asset.name)}"><span>${asset.mediaType === 'video' ? '▶' : '◇'}</span><small>${asset.mediaType === 'video' ? 'Video' : 'Preview unavailable'}</small></div>`}<span class="asset-number">${index + 1}</span></div>
    <div class="asset-meta"><h3 title="${escapeHtml(asset.path)}">${escapeHtml(asset.name)}</h3><p>${formatBytes(asset.size)} · ${asset.captureTimestamp !== undefined ? `Captured ${formatDate(asset.captureTimestamp, true)}` : 'No embedded capture time'}</p><p class="path">${escapeHtml(asset.path)}</p></div>
    <fieldset><legend>Decision for ${escapeHtml(asset.name)}</legend>
      <button class="decision keep ${asset.decision === 'keep' ? 'selected' : ''}" data-decision="keep" data-id="${asset.id}" aria-pressed="${asset.decision === 'keep'}"><span aria-hidden="true">✓</span> Keep</button>
      <button class="decision review ${asset.decision === 'review' ? 'selected' : ''}" data-decision="review" data-id="${asset.id}" aria-pressed="${asset.decision === 'review'}"><span aria-hidden="true">↗</span> Move to review</button>
    </fieldset>
  </article>`;
}

function licenseDialog(): string {
  return `<dialog id="license-dialog" aria-labelledby="license-title"><form method="dialog" class="dialog-close"><button aria-label="Close license dialog">×</button></form><p class="eyebrow">One-time pass</p><h2 id="license-title">Archive pass</h2>${paid ? '<p class="license-good">✓ This device has an active archive pass.</p>' : `<p>Scan folders above the ${FREE_FILE_LIMIT}-file free limit for ${ARCHIVE_PASS_PRICE} once. The free product handles up to ${FREE_FILE_LIMIT} files. Exporting your move plan is always free.</p><a class="button primary wide" href="${checkoutUrl()}">Buy Archive pass at checkout<span class="visually-hidden"> (opens external checkout)</span></a><hr><form id="restore-form"><label for="license-token">Have a license? Paste it here</label><input id="license-token" name="license" autocomplete="off" required><button class="button secondary wide" type="submit">Verify and restore</button><p class="form-status" role="status" aria-live="polite"></p></form>`}<p class="legal-small">Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license. <a class="legal-touch-link" href="/terms/">Terms</a> · <a class="legal-touch-link" href="/privacy/">Privacy</a></p></dialog>`;
}

function licenseNoticeView(): string {
  return `<aside class="license-notice" role="status"><span>${escapeHtml(licenseNotice)}</span>${paid ? '' : `<a href="${checkoutUrl()}">Buy Archive pass at checkout<span class="visually-hidden"> (opens external checkout)</span></a><button class="text-button" data-action="open-license">Restore a license</button>`}</aside>`;
}

function bindViewEvents(): void {
  document.querySelector<HTMLInputElement>('#folder-input')?.addEventListener('change', handleFolder);
  document.querySelector<HTMLInputElement>('#import-input')?.addEventListener('change', handleImport);
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', handleAction));
  document.querySelectorAll<HTMLButtonElement>('[data-group]').forEach((button) => button.addEventListener('click', () => {
    data.activeGroup = Number(button.dataset.group); void saveData(data); render(); focusGroupTitle();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-decision]').forEach((button) => button.addEventListener('click', () => {
    setDecision(button.dataset.id ?? '', button.dataset.decision as Decision);
  }));
  const restore = document.querySelector<HTMLFormElement>('#restore-form');
  restore?.addEventListener('submit', handleLicenseRestore);
}

function bindGlobalEvents(): void {
  window.addEventListener('online', render);
  window.addEventListener('offline', render);
  window.addEventListener('keydown', handleShortcut);
  document.addEventListener('click', markRouteNavigation);
  window.addEventListener('pageshow', (event) => { if (event.persisted) focusRouteHeading(); });
}

async function handleFolder(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;
  globalError = '';
  app.innerHTML = scanProgressView(files.length);
  try {
    const result = await scanFiles(files, paid, updateScanProgress);
    data = {
      version: 1,
      assets: result.assets,
      groups: result.groups,
      scan: { scanned: result.assets.length, skipped: result.skipped + result.failures.length, scannedAt: Date.now(), rootName: result.rootName },
      activeGroup: 0,
      history: [],
    };
    await saveData(data);
    if (result.failures.length) globalError = `${result.failures.length} file(s) could not be read and were skipped.`;
    render();
    document.querySelector('h1')?.focus();
  } catch (error) {
    globalError = message(error);
    render();
  }
}

function scanProgressView(total: number): string {
  return `<header class="site-header"><span class="brand"><img src="/icons/icon.svg" alt="" width="34" height="34"><span>Photo Cull Review</span></span></header><main id="main" class="scan-screen"><div class="scan-orbit" aria-hidden="true"><i></i></div><p class="eyebrow">Local scan</p><h1>Checking photos for copies<br>and likely bursts.</h1><p id="scan-name">Preparing ${total.toLocaleString()} files…</p><div class="scan-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="0" aria-label="Files scanned"><i></i></div><p class="scan-count">0 / ${total.toLocaleString()}</p><p class="scan-assurance">Keep this tab open. File checks and small previews stay on this device.</p></main>`;
}

function updateScanProgress(complete: number, total: number, name: string): void {
  const bar = document.querySelector<HTMLElement>('.scan-progress');
  const count = document.querySelector<HTMLElement>('.scan-count');
  const label = document.querySelector<HTMLElement>('#scan-name');
  if (bar) { bar.setAttribute('aria-valuenow', String(complete)); bar.querySelector<HTMLElement>('i')?.style.setProperty('width', `${(complete / total) * 100}%`); }
  if (count) count.textContent = `${complete.toLocaleString()} / ${total.toLocaleString()}`;
  if (label) label.textContent = name;
}

function handleAction(event: Event): void {
  const action = (event.currentTarget as HTMLElement).dataset.action;
  if (action === 'open-license') document.querySelector<HTMLDialogElement>('#license-dialog')?.showModal();
  if (action === 'choose-folder') document.querySelector<HTMLInputElement>('#folder-input')?.click();
  if (action === 'choose-import') document.querySelector<HTMLInputElement>('#import-input')?.click();
  if (action === 'reset') void resetWorkspace();
  if (action === 'reset-demo') void resetDemo();
  if (action === 'start-real') {
    event.preventDefault();
    void clearData().finally(() => { location.href = '/'; });
  }
  if (action === 'export-csv') exportMovePlan();
  if (action === 'export-json') exportWorkspace();
  if (action === 'previous') navigateGroup(-1);
  if (action === 'next') navigateGroup(1);
  if (action === 'undo') undoDecision();
}

async function resetDemo(): Promise<void> {
  if (!demoMode) return;
  await clearData();
  data = createDemoData();
  await saveData(data);
  globalError = '';
  render();
  document.querySelector<HTMLElement>('h1')?.focus();
  showToast('Sample review reset.');
}

async function resetWorkspace(): Promise<void> {
  if (data.scan && !confirm('Start a new scan? This clears the saved workspace and decisions on this device. Export a workspace backup first if you need it.')) return;
  await clearData();
  data = structuredClone(EMPTY_DATA); globalError = ''; render(); focusRouteHeading();
}

function setDecision(id: string, decision: Decision): void {
  const asset = assetById(id);
  if (!asset || asset.decision === decision) return;
  data.history.push({ at: Date.now(), assetId: id, from: asset.decision, to: decision });
  asset.decision = decision;
  void saveData(data);
  render();
  document.querySelector<HTMLButtonElement>(`[data-id="${CSS.escape(id)}"][data-decision="${decision}"]`)?.focus();
  showToast(decision === 'keep' ? `${asset.name} marked keep.` : `${asset.name} added to the review-folder plan.`);
}

function undoDecision(): void {
  const last = data.history.pop();
  if (!last) return;
  const asset = assetById(last.assetId);
  if (asset) asset.decision = last.from;
  void saveData(data); render(); showToast('Last decision undone.');
}

function navigateGroup(delta: number): void {
  const next = data.activeGroup + delta;
  if (next >= data.groups.length) {
    const incomplete = data.groups.findIndex((group) => group.assetIds.some((id) => assetById(id)?.decision === 'undecided'));
    if (incomplete >= 0) {
      data.activeGroup = incomplete; void saveData(data); render(); focusGroupTitle(); showToast('A group still has undecided files. Review each candidate before finishing.'); return;
    }
    data.activeGroup = data.groups.length; void saveData(data); render(); document.querySelector('h2')?.focus(); return;
  }
  data.activeGroup = Math.max(0, next); void saveData(data); render(); focusGroupTitle();
}

function focusGroupTitle(): void {
  const title = document.querySelector<HTMLElement>('#group-title');
  title?.setAttribute('tabindex', '-1'); title?.focus();
}

function exportMovePlan(): void {
  const selected = data.assets.filter((asset) => asset.decision === 'review');
  if (!selected.length) { showToast('Mark at least one file “Move to review” before exporting.'); return; }
  const headers = ['source_path','review_path','size_bytes','sha256','group_type','reason'];
  const rows = selected.map((asset) => {
    const group = data.groups.find((item) => item.assetIds.includes(asset.id));
    return [asset.path, `_photo-review/${asset.path}`, asset.size, asset.sha256, group?.kind ?? '', group?.explanation ?? 'Manual review choice'];
  });
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  download(`photo-cull-move-plan-${dateStamp()}.csv`, `# PLAN ONLY — Photo Cull Review never moved or deleted these files.\n${csv}`, 'text/csv');
  showToast(`Exported a plan for ${selected.length} file${selected.length === 1 ? '' : 's'}.`);
}

function exportWorkspace(): void {
  download(`photo-cull-workspace-${dateStamp()}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), product: 'photo-cull-review', data }, null, 2), 'application/json');
  showToast('Workspace backup exported.');
}

async function handleImport(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  let restored: AppData | undefined;
  try {
    restored = parseWorkspaceBackup(await file.text());
  } catch { /* File read failures use the same actionable invalid-backup path. */ }
  if (!restored) {
    globalError = INVALID_BACKUP_MESSAGE;
    render();
    return;
  }
  try {
    await saveData(restored);
    data = restored;
    globalError = '';
    render();
    showToast('Workspace restored.');
  } catch {
    globalError = 'The backup is valid, but it could not be saved. Check this browser’s site storage and try again.';
    render();
  }
}

async function handleLicenseRestore(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const token = new FormData(form).get('license')?.toString().trim() ?? '';
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!token) return;
  storeLicense(token); if (status) status.textContent = 'Checking license…';
  const verification = await verifyLicense(true);
  paid = verification.valid;
  if (paid) { licenseNotice = ''; render(); showToast('Archive pass restored on this device.'); }
  else if (status) status.textContent = verification.status === 'unavailable'
    ? 'We could not verify this license. Check your connection and try again. Free limits remain active.'
    : 'That license is no longer active for this product. Check the token and try again.';
}

function handleShortcut(event: KeyboardEvent): void {
  if (!data.scan || event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target as HTMLElement;
  if (target.matches('input, textarea, select, a') || target.closest('dialog')) return;
  // A shortcut decision deliberately keeps focus on its matching decision
  // button after the view is redrawn. Keep the review shortcuts available
  // there so a user can work through a group without moving focus by hand.
  // Other buttons retain their native keyboard behaviour.
  if (target.matches('button:not([data-decision])')) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); navigateGroup(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); navigateGroup(1); }
  if (event.key.toLowerCase() === 's') { event.preventDefault(); navigateGroup(1); }
  if (event.key.toLowerCase() === 'k' || event.key.toLowerCase() === 'r') {
    const group = data.groups[data.activeGroup];
    const undecided = group?.assetIds.map(assetById).find((asset) => asset?.decision === 'undecided');
    if (undecided) { event.preventDefault(); setDecision(undecided.id, event.key.toLowerCase() === 'k' ? 'keep' : 'review'); }
  }
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const register = (): void => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.'); });
      });
    }).catch(() => { /* The app remains fully usable without installation. */ });
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

function showToast(text: string): void {
  window.clearTimeout(toastTimer);
  const toast = document.querySelector<HTMLElement>('.toast');
  if (!toast) return;
  toast.textContent = text; toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4200);
}

function setDemoMetadata(): void {
  const title = 'Demo — Photo Cull Review';
  const description = 'Try a four-file duplicate photo review with separate sample data.';
  const canonical = 'https://photo-cull-review.sociobot.in/?demo=1';
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('link[rel="canonical"]', 'href', canonical);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
}

function markRouteNavigation(event: MouseEvent): void {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && (destination.pathname !== location.pathname || destination.search !== location.search)) {
    sessionStorage.setItem(ROUTE_FOCUS_KEY, '1');
  }
}

function focusRouteHeadingIfNeeded(): void {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (sessionStorage.getItem(ROUTE_FOCUS_KEY) === '1' || navigation?.type === 'back_forward') {
    sessionStorage.removeItem(ROUTE_FOCUS_KEY);
    focusRouteHeading();
  }
}

function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLElement>('main h1');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus();
  announceRoute(`${heading.textContent?.replace(/\s+/g, ' ').trim() ?? 'Page'} opened.`);
}

function announceRoute(text: string): void {
  const status = document.querySelector<HTMLElement>('#route-status');
  if (status) status.textContent = text;
}

function setMeta(selector: string, attribute: string, value: string): void {
  document.querySelector(selector)?.setAttribute(attribute, value);
}

function assetById(id: string): MediaAsset | undefined { return data.assets.find((asset) => asset.id === id); }
function message(error: unknown): string { return error instanceof Error ? error.message : 'Something went wrong. Try again.'; }
function parseWorkspaceBackup(contents: string): AppData | undefined {
  let parsed: unknown;
  try { parsed = JSON.parse(contents); }
  catch { return undefined; }
  if (!isRecord(parsed)) return undefined;
  const backup = parsed as { product?: unknown; data?: unknown };
  if (backup.product !== 'photo-cull-review' || !isRecord(backup.data)) return undefined;
  const candidate = backup.data as Partial<AppData>;
  if (
    candidate.version !== 1
    || !Array.isArray(candidate.assets) || !candidate.assets.every(isMediaAsset)
    || !Array.isArray(candidate.groups) || !candidate.groups.every(isReviewGroup)
    || !Number.isInteger(candidate.activeGroup) || candidate.activeGroup! < 0 || candidate.activeGroup! > candidate.groups.length
    || !Array.isArray(candidate.history) || !candidate.history.every(isHistoryEntry)
    || (candidate.scan !== undefined && !isScanSummary(candidate.scan))
  ) return undefined;
  const assetIds = new Set(candidate.assets.map((asset) => asset.id));
  if (candidate.groups.some((group) => group.assetIds.some((id) => !assetIds.has(id)))) return undefined;
  return candidate as AppData;
}
function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function isMediaAsset(value: unknown): value is MediaAsset {
  if (!isRecord(value)) return false;
  return ['id', 'name', 'path', 'mime', 'sha256'].every((key) => typeof value[key] === 'string')
    && (value.mediaType === 'image' || value.mediaType === 'video')
    && (value.decision === 'undecided' || value.decision === 'keep' || value.decision === 'review')
    && typeof value.size === 'number' && Number.isFinite(value.size) && value.size >= 0
    && typeof value.lastModified === 'number' && Number.isFinite(value.lastModified)
    && (value.captureTimestamp === undefined || typeof value.captureTimestamp === 'number' && Number.isFinite(value.captureTimestamp))
    && (value.perceptualHash === undefined || typeof value.perceptualHash === 'string')
    && (value.thumbnail === undefined || typeof value.thumbnail === 'string');
}
function isReviewGroup(value: unknown): value is ReviewGroup {
  return isRecord(value)
    && typeof value.id === 'string'
    && (value.kind === 'exact' || value.kind === 'similar')
    && Array.isArray(value.assetIds) && value.assetIds.every((id) => typeof id === 'string')
    && typeof value.explanation === 'string';
}
function isHistoryEntry(value: unknown): value is AppData['history'][number] {
  return isRecord(value)
    && typeof value.at === 'number' && Number.isFinite(value.at)
    && typeof value.assetId === 'string'
    && (value.from === 'undecided' || value.from === 'keep' || value.from === 'review')
    && (value.to === 'undecided' || value.to === 'keep' || value.to === 'review');
}
function isScanSummary(value: unknown): value is NonNullable<AppData['scan']> {
  return isRecord(value)
    && typeof value.scanned === 'number' && Number.isFinite(value.scanned) && value.scanned >= 0
    && typeof value.skipped === 'number' && Number.isFinite(value.skipped) && value.skipped >= 0
    && typeof value.scannedAt === 'number' && Number.isFinite(value.scannedAt)
    && typeof value.rootName === 'string';
}
function formatBytes(bytes: number): string { if (!bytes) return '0 B'; const units = ['B','KB','MB','GB','TB']; const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`; }
function formatDate(value?: number, time = false): string { if (!value) return 'Unknown date'; return new Intl.DateTimeFormat(undefined, time ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(value); }
function dateStamp(): string { return new Date().toISOString().slice(0, 10); }
function csvCell(value: string | number): string { return `"${String(value).replaceAll('"', '""')}"`; }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char] ?? char); }
function download(name: string, contents: string, type: string): void { const url = URL.createObjectURL(new Blob([contents], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }

function createDemoData(): AppData {
  const captured = Date.UTC(2025, 6, 19, 15, 42);
  const assets: MediaAsset[] = [
    { id: 'demo-picnic-1', name: 'IMG_2041.jpg', path: 'Family Picnic/IMG_2041.jpg', mediaType: 'image', mime: 'image/jpeg', size: 4_281_004, lastModified: captured, captureTimestamp: captured, sha256: '8ca4d5901f13e8cbdd47efc129e6599ea2ca8f1c4fae4d4bea85fb99d03fc459', thumbnail: '/samples/picnic-wide.svg', decision: 'undecided' },
    { id: 'demo-picnic-copy', name: 'IMG_2041 copy.jpg', path: 'Family Picnic/Phone imports/IMG_2041 copy.jpg', mediaType: 'image', mime: 'image/jpeg', size: 4_281_004, lastModified: captured + 2_000, captureTimestamp: captured, sha256: '8ca4d5901f13e8cbdd47efc129e6599ea2ca8f1c4fae4d4bea85fb99d03fc459', thumbnail: '/samples/picnic-wide.svg', decision: 'undecided' },
    { id: 'demo-sparklers-1', name: 'DSC_7718.jpg', path: 'Summer Evening/DSC_7718.jpg', mediaType: 'image', mime: 'image/jpeg', size: 6_104_322, lastModified: captured + 8_000, captureTimestamp: captured + 8_000, sha256: 'bc11c3832ddf35a026c7b46f62c1b3a4284746d41eb3012151c9a0bed70bf491', perceptualHash: '003e7c7c7e3c1800', thumbnail: '/samples/sparklers-close.svg', decision: 'undecided' },
    { id: 'demo-sparklers-2', name: 'DSC_7719.jpg', path: 'Summer Evening/DSC_7719.jpg', mediaType: 'image', mime: 'image/jpeg', size: 6_220_815, lastModified: captured + 11_000, captureTimestamp: captured + 11_000, sha256: 'ff11b36933275c4eb041120d6c41722c225b99b5c2805d6281e5183aecdd5d2f', perceptualHash: '003e7c7e7e3c1800', thumbnail: '/samples/sparklers-wide.svg', decision: 'undecided' },
  ];
  return {
    version: 1,
    assets,
    groups: [
      { id: 'demo-exact', kind: 'exact', assetIds: ['demo-picnic-1', 'demo-picnic-copy'], explanation: 'Same file size and complete SHA-256 hash (8ca4d5901f…). These files are byte-for-byte identical.' },
      { id: 'demo-similar', kind: 'similar', assetIds: ['demo-sparklers-1', 'demo-sparklers-2'], explanation: 'Captured within 3 seconds according to embedded camera metadata and visually close by a 64-bit difference hash. This suggests a burst—it does not prove the photos are duplicates.' },
    ],
    scan: { scanned: 4, skipped: 0, scannedAt: captured, rootName: 'Sample family archive' },
    activeGroup: 0,
    history: [],
  };
}
